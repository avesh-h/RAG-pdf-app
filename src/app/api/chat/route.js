import { sql } from "@/lib/db-config";
import { generateEmbedding } from "@/lib/embeddings";
import { openai } from "@ai-sdk/openai";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    const queryEmbedding = await generateEmbedding(userMessage);

    const results = await sql`
      SELECT content, 1 - (embedding <=> ${queryEmbedding}::vector) as similarity
      FROM "Document"
      ORDER BY embedding <=> ${queryEmbedding}::vector
      LIMIT 5
    `;

    const context = results
      .map((r) => r.content)
      .join("\n\n");

    const systemPrompt = `You are a helpful AI assistant. Use the following context from documents to answer the user's question. If the context doesn't contain relevant information, say so.

Context:
${context}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    return Response.json({
      message: response.choices[0].message,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Chat failed" }, { status: 500 });
  }
}
