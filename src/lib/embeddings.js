import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

const EMBEDDING_MODEL = "text-embedding-3-small";

// for single text to convert user query to vector embedding
export async function generateEmbedding(text) {
  const input = text.replace("\n", " ");

  const { embedding } = await embed({
    model: openai.textEmbeddingModel(EMBEDDING_MODEL),
    value: input,
  });

  return embedding;
}

// for multiple texts to convert user uploaded pdf smaller chunks to vector embeddings
export async function generateEmbeddings(texts) {
  const inputs = texts.map((text) => text.replace("\n", " "));

  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel(EMBEDDING_MODEL),
    values: inputs,
  });

  console.log("Embeddings generated:", embeddings);

  return embeddings;
}
