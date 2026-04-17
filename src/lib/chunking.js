const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

export function chunkText(text) {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(" ");
    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks;
}
