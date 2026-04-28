import { groq } from "@ai-sdk/groq";
import { tavily } from "@tavily/core";
import { streamText } from "ai";

export async function POST(request) {
  try {
    // step-1 get user message
    const { messages } = await request.json();
    const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);
    const userQuery = lastUserMessage?.parts
      ? lastUserMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("")
      : (lastUserMessage?.content ?? "");

    // step-2 call tavily api get result from web top 5 results
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const searchResults = await client.search(userQuery, {
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

    // Send context + query to Groq and stream the response
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a precise and thorough research assistant. Answer the user's question directly and comprehensively using the provided web sources.

CRITICAL RULES:
- Start your answer DIRECTLY — never begin with "Introduction" or any generic header
- Answer the specific question asked — do not write a generic essay
- Match your format to the content — use numbered steps only if the answer is a process, use bullet points only if listing items, use plain paragraphs if explaining a concept
- Be detailed and specific — include actual facts, numbers, names, examples from the sources
- Never pad with generic filler like "it is important to note" or "in conclusion"
- Write like a knowledgeable expert explaining to a curious person — direct, clear, specific

Sources:
${context}`,
      messages: [{ role: "user", content: userQuery }],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Search error:", error);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
