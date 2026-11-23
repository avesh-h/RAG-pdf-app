import { searchDocuments } from "@/lib/search";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

// Number of PDF chunks sent to the model with every question
const TOP_K = 8;

function normalizeMessages(messages) {
  return messages.map((m) => ({
    role: m.role,
    content: m.parts
      ? m.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("")
      : (m.content ?? ""),
  }));
}

// Short follow-ups like "and the second one?" or "when did he start?" are
// meaningless on their own for vector search, so we add the previous user
// question to give the search the missing topic. No LLM call needed.
function buildSearchQuery(userMessages) {
  const last = userMessages.at(-1)?.content ?? "";
  const previous = userMessages.at(-2)?.content ?? "";
  const isShort = last.trim().split(/\s+/).length < 6;
  return isShort && previous ? `${previous} ${last}` : last;
}

// PDF chat ALWAYS searches the document: the embedding model runs locally
// (free, fast), so there is no reason to skip retrieval and risk the model
// answering from imagination.
async function buildSystemPrompt(searchQuery, fileId) {
  // threshold -1 = no similarity cut-off, just take the best TOP_K chunks.
  // MiniLM gives low scores for short questions, so a cut-off drops real answers.
  const results = await searchDocuments(searchQuery, TOP_K, -1, fileId);

  const context =
    results.length > 0
      ? results.map((doc) => doc.content).join("\n\n---\n\n")
      : "No content found for this document.";

  return `You answer questions about an uploaded document.

RULES:
- Use ONLY the document context below. The context is split into chunks that may be out of order and may mix columns of the page — combine information from all chunks.
- Use the conversation history only to understand what the user is referring to (for example "he", "that", "the first one") and for reformatting requests (table, shorter, translate).
- If the answer is not in the context, reply exactly: "I couldn't find that in the document." Never guess.
- Never invent names, companies, dates or numbers. Never add citation markers such as 【1†L1-L4】 or [1].
- Always use Markdown. For tables use pipe syntax (| col | col |), never HTML tags.

Document context:
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

    const systemPrompt = await buildSystemPrompt(
      buildSearchQuery(userMessages),
      fileId,
    );

    const result = streamText({
      model: groq(GROQ_MODEL),
      system: systemPrompt,
      messages: normalizedMessages,
      temperature: 0,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
