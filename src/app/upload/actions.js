"use server";

import { chunkText } from "@/lib/chunking";
import prisma from "@/lib/db-config";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractText } from "unpdf";
import { auth } from "@/auth";

export async function processPdfFile(formData) {
  try {
    // Get current logged in user
    const session = await auth();

    if (!session || !session.user) {
      return { success: false, error: "You must be logged in to upload files" };
    }
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

    // Step 1 — Create a File record first linked to this user
    const fileRecord = await prisma.file.create({
      data: {
        filename: file.name,
        userId: session.user.id,
      },
    });

    // Step 2 — Store all chunks linked to that File
    await Promise.all(
      chunks.map(
        (chunk, index) =>
          prisma.$executeRaw`
          INSERT INTO "Document" (content, embedding, "fileId")
          VALUES (${chunk}, ${`[${embeddings[index].join(",")}]`}::vector, ${fileRecord.id})
        `,
      ),
    );

    return { 
      success: true, 
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        uploadedAt: fileRecord.uploadedAt.toISOString()
      }, 
      message: "PDF file processed successfully" 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
