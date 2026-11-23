import { pipeline, env } from "@xenova/transformers";

// Serverless (Vercel) file system is read-only except /tmp, so download/cache
// the model there instead of inside node_modules.
if (process.env.VERCEL) {
  env.cacheDir = "/tmp/transformers-cache";
}

const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

// Singleton class to hold pipeline instance across server invocations
class PipelineSingleton {
  static task = "feature-extraction";
  static model = MODEL_NAME;
  static instance = null;

  static async getInstance() {
    if (!this.instance) {
      this.instance = await pipeline(this.task, this.model);
    }
    return this.instance;
  }
}

// For single text to convert user query to vector embedding (384 dimensions)
export async function generateEmbedding(text) {
  const extractor = await PipelineSingleton.getInstance();
  const input = text.replace(/\n/g, " ");

  const output = await extractor(input, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}

// For multiple texts to convert PDF chunks to vector embeddings (384 dimensions each)
export async function generateEmbeddings(texts, batchSize = 32) {
  const extractor = await PipelineSingleton.getInstance();
  const inputs = texts.map((text) => text.replace(/\n/g, " "));

  if (inputs.length === 0) return [];

  const results = [];
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const output = await extractor(batch, { pooling: "mean", normalize: true });
    results.push(...output.tolist());
  }

  return results;
}
