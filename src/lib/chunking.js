const CHUNK_SIZE = 800; // characters — large enough to keep related sentences together
const CHUNK_OVERLAP = 100; // overlap so content at boundaries isn't lost

export function chunkText(text) {
  // Clean up extra whitespace first
  const cleanText = text.replace(/\s+/g, " ").trim();

  const chunks = [];

  for (let i = 0; i < cleanText.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = cleanText.slice(i, i + CHUNK_SIZE);
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }

  console.log(
    `✅ Created ${chunks.length} chunks from ${cleanText.length} characters`,
  );
  return chunks;
}
