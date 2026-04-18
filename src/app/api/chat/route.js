import { searchDocuments } from "@/lib/search";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // ✅ Get last user message
    const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);
    const userQuery = lastUserMessage?.parts
      ? lastUserMessage.parts
          .filter((p) => p.type === "text")
          .map((p) => p.text)
          .join("")
      : (lastUserMessage?.content ?? "");

    // ✅ Manually search — don't rely on Groq to call the tool
    const results = await searchDocuments(userQuery, 5, 0.2);
    console.log("📄 Search results:", results.length, "chunks found");

    const context =
      results.length > 0
        ? results.map((doc, i) => `[${i + 1}] ${doc.content}`).join("\n\n")
        : "No relevant information found.";

    // ✅ Inject context directly into system prompt — no tools needed
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: `You are a helpful assistant that answers questions about uploaded documents.
Use the following context to answer the user's question.
If the answer is not in the context, say "I don't have enough information to answer that."

Context:
${context}`,
      messages: [{ role: "user", content: userQuery }],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
