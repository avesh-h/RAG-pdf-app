const CHUNK_SIZE = 200; // ✅ characters not words
const CHUNK_OVERLAP = 20; // ✅ overlap in characters

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
