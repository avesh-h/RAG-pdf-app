import { groq } from "@ai-sdk/groq";
import { tavily } from "@tavily/core";
import { streamText } from "ai";

// Helper: convert useChat message format → Groq format
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

// Helper: detect if the latest message is a follow-up or a new question
async function detectIntent(normalizedMessages) {
  const recentMessages = normalizedMessages.slice(-4); // last 4 messages max

  const intentResult = streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are an intent classifier. Analyze the conversation and classify the LAST user message.

Reply with ONLY a JSON object in this exact format, nothing else:
{"type": "FOLLOWUP", "searchQuery": null}
OR
{"type": "NEW_QUESTION", "searchQuery": "<the actual search query to use>"}

Rules:
- FOLLOWUP: last message is asking for more detail, clarification, summary, rephrasing, or continuation of the previous topic. searchQuery must be null.
- NEW_QUESTION: last message is a completely different/unrelated topic. searchQuery must be the clean search query string.`,
    messages: recentMessages,
  });

  const text = (await intentResult.text).trim();

  try {
    // Strip any markdown fences just in case
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    // Fallback: treat as new question
    const lastMsg = normalizedMessages.at(-1)?.content ?? "";
    return { type: "NEW_QUESTION", searchQuery: lastMsg };
  }
}

export async function POST(request) {
  try {
    // Step 1 — Get full message history from useChat
    const { messages } = await request.json();
    console.log("Messages:", messages);
    const normalizedMessages = normalizeMessages(messages);

    console.log("Normalized messages:", normalizedMessages);

    // Step 2 — Detect if this is a follow-up or a new question
    const intent = await detectIntent(normalizedMessages);

    console.log("Intent:", intent);

    let systemPrompt = "";

    if (intent.type === "NEW_QUESTION") {
      // Step 3a — New question: search Tavily with the clean query
      const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
      const searchResults = await client.search(intent.searchQuery, {
        maxResults: 5,
        searchDepth: "advanced",
      });

      // Step-3 Build context string from all 5 results
      const context = searchResults.results
        .map(
          (source, i) =>
            `Source ${i + 1} — ${source.title}\nURL: ${source.url}\n${source.content}`,
        )
        .join("\n\n---\n\n");

      systemPrompt = `You are a precise and thorough research assistant. Answer the user's question directly and comprehensively using the provided web sources.

CRITICAL RULES:
- Start your answer DIRECTLY — never begin with "Introduction" or any generic header
- Answer the specific question asked — do not write a generic essay
- Match your format to the content — use numbered steps only if the answer is a process, use bullet points only if listing items, use plain paragraphs if explaining a concept
- Be detailed and specific — include actual facts, numbers, names, examples from the sources
- Never pad with generic filler like "it is important to note" or "in conclusion"
- Write like a knowledgeable expert explaining to a curious person — direct, clear, specific

Sources:
${context}`;
    } else {
      // Step 3b — Follow-up: no Tavily call, answer from conversation history
      systemPrompt = `You are a precise and thorough research assistant. The user is asking a follow-up question based on your previous response.

CRITICAL RULES:
- Use the conversation history to answer — do not search for new information
- Be direct and specific — answer exactly what was asked
- Match format to content: numbered steps for processes, bullets for lists, paragraphs for concepts
- Do not repeat everything you said before — build on it
- Write like a knowledgeable expert continuing an explanation`;
    }

    // Step 4 — Stream response with full conversation history
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      messages: normalizedMessages, // full history, not just last message
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
