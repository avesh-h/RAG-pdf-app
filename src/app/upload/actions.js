"use server";

import { chunkText } from "@/lib/chunking";
import prisma from "@/lib/db-config";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractText } from "unpdf";

export async function processPdfFile(formData) {
  try {
    const file = formData.get("pdf");
    if (!file) return { success: false, error: "No file provided" };

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // ✅ unpdf is designed for Node.js server environments
    const { text } = await extractText(uint8Array, { mergePages: true });

    if (!text || text.trim().length === 0) {
      return { success: false, error: "Failed to extract text from PDF" };
    }

    const chunks = chunkText(text);
    const embeddings = await generateEmbeddings(chunks);

    // Store in DB — format embedding as Postgres vector string "[0.1, 0.2, ...]"
    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: `[${embeddings[index].join(",")}]`, // ✅ Postgres vector format
    }));

    // Prisma doesn't support Unsupported() in create, use raw query
    await Promise.all(
      records.map(
        (record) =>
          prisma.$executeRaw`
          INSERT INTO "Document" (content, embedding)
          VALUES (${record.content}, ${record.embedding}::vector)
        `,
      ),
    );

    return { success: true, message: "PDF file processed successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
