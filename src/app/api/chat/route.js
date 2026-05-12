import { searchDocuments } from "@/lib/search";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

function normalizeMessages(messages) {
  return messages.map((m) => ({
    role: m.role,
    content: m.parts
      ? m.parts.filter((p) => p.type === "text").map((p) => p.text).join("")
      : (m.content ?? ""),
  }));
}

async function detectIntent(normalizedMessages) {
  const recentMessages = normalizedMessages.slice(-4);

  const intentResult = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are an intent classifier for a document Q&A chat. Classify the LAST user message.

Reply with ONLY a JSON object, nothing else:
{"type": "FOLLOWUP"}
OR
{"type": "NEW_QUESTION"}

A message is FOLLOWUP if it does ANY of the following relative to the previous assistant response:
- Asks to reformat or restructure (table, list, bullet points, numbered, chart, JSON, CSV, etc.)
- Asks to simplify, shorten, lengthen, rephrase, or rewrite
- Asks for clarification, elaboration, or more detail on something already mentioned
- Asks for an example or analogy based on what was just explained
- References the previous response using words like: "that", "this", "those", "it", "the above", "you mentioned", "from your answer", "based on that", "what about X you said"
- Asks a comparison or follow-on question about items already listed or explained
- Asks which option from the previous answer is better/faster/recommended
- Continues the same topic with "what else", "and also", "anything more", "go on"
- Asks to translate or convert the previous response to another language or format
- Asks to correct, verify, or challenge something from the previous answer

A message is NEW_QUESTION only if it introduces a topic that was NOT part of the previous response and has no reference to prior context.

When in doubt, classify as FOLLOWUP.`,
    messages: recentMessages,
  });

  const text = (await intentResult.text).trim();

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { type: "NEW_QUESTION" };
  }
}

async function buildRagPrompt(userQuery, fileId) {
  const results = await searchDocuments(userQuery, 8, 0.2, fileId);

  const context =
    results.length > 0
      ? results.map((doc, i) => `[${i + 1}] ${doc.content}`).join("\n\n")
      : "No relevant information found.";

  return `You are a helpful assistant that answers questions about uploaded documents.
Answer the user's question using the context below. The context may be split across multiple numbered chunks — combine information from all relevant chunks into a single complete answer.
Only say you don't have enough information if the topic is genuinely absent from all chunks.
IMPORTANT: Always use Markdown formatting. For tables, use Markdown pipe syntax (| col | col |) — never use HTML tags like <table>, <tr>, or <td>.

Context:
${context}`;
}

export async function POST(req) {
  try {
    const { messages, fileId } = await req.json();

    if (!fileId) {
      return Response.json({ error: "No file selected" }, { status: 400 });
    }

    const normalizedMessages = normalizeMessages(messages);
    const userMessages = normalizedMessages.filter((m) => m.role === "user");
    const userQuery = userMessages.at(-1)?.content ?? "";

    let systemPrompt;

    if (userMessages.length > 1) {
      // There is conversation history — detect if this is a follow-up
      const intent = await detectIntent(normalizedMessages);

      if (intent.type === "FOLLOWUP") {
        systemPrompt = `You are a helpful assistant answering questions about an uploaded document.
The user is asking a follow-up based on the conversation history. Use the previous messages to answer directly — do not look for new information.
If asked to reformat something, reformat it fully and correctly.
IMPORTANT: Always use Markdown formatting. For tables, use Markdown pipe syntax (| col | col |) — never use HTML tags like <table>, <tr>, or <td>.`;
      } else {
        systemPrompt = await buildRagPrompt(userQuery, fileId);
      }
    } else {
      // First message — always do vector search
      systemPrompt = await buildRagPrompt(userQuery, fileId);
    }

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: normalizedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
