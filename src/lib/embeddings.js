// import { openai } from "@ai-sdk/openai";
// import { embed, embedMany } from "ai";
import { InferenceClient } from "@huggingface/inference";

// const EMBEDDING_MODEL = "text-embedding-3-small";

// // for single text to convert user query to vector embedding
// export async function generateEmbedding(text) {
//   const input = text.replace("\n", " ");

//   const { embedding } = await embed({
//     model: openai.textEmbeddingModel(EMBEDDING_MODEL),
//     value: input,
//   });

//   return embedding;
// }

// // for multiple texts to convert user uploaded pdf smaller chunks to vector embeddings
// export async function generateEmbeddings(texts) {
//   const inputs = texts.map((text) => text.replace("\n", " "));

//   const { embeddings } = await embedMany({
//     model: openai.textEmbeddingModel(EMBEDDING_MODEL),
//     values: inputs,
//   });

//   console.log("Embeddings generated:", embeddings);

//   return embeddings;
// }

const client = new InferenceClient(process.env.HF_TOKEN);

const EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2";

// for single text to convert user query to vector embedding
export async function generateEmbedding(text) {
  const input = text.replace("\n", " ");

  const result = await client.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: input,
    provider: "hf-inference",
  });

  return Array.from(result);
}

// for multiple texts to convert PDF chunks to vector embeddings
export async function generateEmbeddings(texts) {
  const inputs = texts.map((text) => text.replace("\n", " "));

  const result = await client.featureExtraction({
    model: EMBEDDING_MODEL,
    inputs: inputs,
    provider: "hf-inference",
  });

  return result.map((embedding) => Array.from(embedding));
}
