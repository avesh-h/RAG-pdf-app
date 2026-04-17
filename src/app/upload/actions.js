"use server";

import { chunkText } from "@/lib/chunking";
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

    console.log("embeddings", embeddings);

    return { success: true, message: "PDF file processed successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
