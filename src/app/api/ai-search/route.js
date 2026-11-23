import { groq } from "@ai-sdk/groq";
import { tavily } from "@tavily/core";
import { generateText, streamText } from "ai";

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

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

// Decide: can the last message be answered from the conversation alone,
// or does it need fresh facts from the web? Also rewrites the message into a
// standalone search query ("what about its price?" -> "iPhone 17 price in India").
async function detectIntent(normalizedMessages) {
  const lastMsg = normalizedMessages.at(-1)?.content ?? "";
  const recentMessages = normalizedMessages.slice(-6);

  try {
    const { text } = await generateText({
      model: groq(GROQ_MODEL),
      temperature: 0,
      system: `You decide whether the LAST user message can be answered using ONLY the conversation so far, or needs a fresh web search.

ANSWER_FROM_HISTORY — only when the last message works on content that is ALREADY in the previous assistant answer:
- reformat it (table, bullets, JSON), shorten, lengthen, simplify, rephrase, translate
- explain, summarise, or compare things the previous answer already stated

SEARCH — whenever answering needs facts that are NOT already written in the previous answers:
- new details, numbers, prices, dates, names, statistics, news, "latest", "current"
- other items or people not covered yet
- a different topic, OR a new aspect of the same topic (e.g. "what about its price in India?")

For SEARCH, "searchQuery" must be a standalone Google-style query: replace pronouns (it, they, this, that) with the real subject from the conversation, keep needed context, drop filler words.

When in doubt, choose SEARCH. A search is cheap; a wrong answer from memory is not.

Reply with ONLY one JSON object, nothing else:
{"type": "ANSWER_FROM_HISTORY", "searchQuery": null}
OR
{"type": "SEARCH", "searchQuery": "<standalone query>"}`,
      messages: recentMessages,
    });

    // Strip any markdown fences just in case
    const clean = text.replace(/```json|```/g, "").trim();
    const intent = JSON.parse(clean);

    if (intent.type === "ANSWER_FROM_HISTORY") return intent;
    return { type: "SEARCH", searchQuery: intent.searchQuery || lastMsg };
  } catch {
    // Anything unexpected -> safest option is to search with the raw message
    return { type: "SEARCH", searchQuery: lastMsg };
  }
}

export async function POST(request) {
  try {
    // Step 1 — Get full message history from useChat
    const { messages } = await request.json();
    console.log("Messages:", messages);
    const normalizedMessages = normalizeMessages(messages);

    console.log("Normalized messages:", normalizedMessages);

    // Step 2 — First question always searches (no history to answer from, so
    // skip the classifier call). Later questions: decide search vs. history.
    const isFirstQuestion =
      normalizedMessages.filter((m) => m.role === "user").length <= 1;
    const intent = isFirstQuestion
      ? { type: "SEARCH", searchQuery: normalizedMessages.at(-1)?.content ?? "" }
      : await detectIntent(normalizedMessages);

    console.log("Intent:", intent);

    let systemPrompt = "";

    if (intent.type === "SEARCH") {
      // Step 3a — Needs fresh facts: search Tavily with the clean query
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
      // Step 3b — Answerable from the conversation: no Tavily call
      systemPrompt = `You are a precise and thorough research assistant. The user is asking a follow-up question based on your previous response.

CRITICAL RULES:
- Use the conversation history to answer — do not search for new information
- If the history does not actually contain what is needed, say so briefly instead of guessing or inventing facts
- Be direct and specific — answer exactly what was asked
- Match format to content: numbered steps for processes, bullets for lists, paragraphs for concepts
- Do not repeat everything you said before — build on it
- Write like a knowledgeable expert continuing an explanation`;
    }

    // Step 4 — Stream response with full conversation history
    const result = streamText({
      model: groq(GROQ_MODEL),
      system: systemPrompt,
      messages: normalizedMessages, // full history, not just last message
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
