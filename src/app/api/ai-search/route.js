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
    });

    // Step-3 Build context string from all 5 results
    const context = searchResults.results
      .map((source, i) => `Source ${i + 1}: ${source.title}\n${source.content}`)
      .join("\n\n---\n\n");

    // Send context + query to Groq and stream the response
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a helpful research assistant that answers questions using web search results.

Use the following sources to answer the user's question accurately and clearly.

FORMAT RULES — follow these strictly:
- Use ## for main section headings
- Use **bold** only for important terms or key points
- Use bullet points for lists of items or steps
- Add a blank line between each section
- Keep paragraphs short — maximum 3 sentences each
- Never use === or --- as separators
- Never dump walls of text — break it up clearly

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
