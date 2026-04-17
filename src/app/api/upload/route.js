import { prisma } from "@/lib/db-config";
import { extractTextFromPDF, chunkText } from "@/lib/pdf";
import { generateEmbeddings } from "@/lib/embeddings";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPDF(buffer);
    const chunks = chunkText(text);

    const embeddings = await generateEmbeddings(chunks);

    const documents = await Promise.all(
      chunks.map((content, index) =>
        prisma.document.create({
          data: {
            content,
            embedding: embeddings[index],
          },
        })
      )
    );

    return Response.json({
      success: true,
      chunksCreated: documents.length,
      documentIds: documents.map((d) => d.id),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
