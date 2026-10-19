import { QdrantClient } from "@qdrant/js-client-rest";

// QDRANT_API_KEY is only needed for Qdrant Cloud, not a local container
export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY || undefined,
});