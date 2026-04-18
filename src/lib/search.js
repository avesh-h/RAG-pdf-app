import { generateEmbedding } from "./embeddings";
import prisma from "./db-config";

/**
 * Search for similar documents using Prisma with cosine distance
 * Equivalent to Drizzle's cosineDistance implementation
 */
export async function searchDocuments(query, limit = 5, threshold = 0.5) {
  // Step 1: Generate embedding for the search query
  const embedding = await generateEmbedding(query);

  // Step 2: Format as postgres vector string
  const vectorString = `[${embedding.join(",")}]`;

  // Step 3: Query with cosine similarity — equivalent to Drizzle's cosineDistance
  const similarDocuments = await prisma.$queryRaw`
    SELECT
      id,
      content,
      1 - (embedding <=> ${vectorString}::vector) AS similarity
    FROM "Document"
    WHERE 1 - (embedding <=> ${vectorString}::vector) > ${threshold}
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;

  return similarDocuments;
}
