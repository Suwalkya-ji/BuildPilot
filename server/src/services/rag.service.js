import { qdrant } from "../config/qdrant.js";
import { generateEmbedding } from "./embedding.service.js";

const COLLECTION_NAME = "project_files";

export const searchRelevantFiles = async (
  projectId,
  query,
  limit = 5
) => {
  try {
    // Generate embedding for user's query
    const queryVector = await generateEmbedding(query);

    // Search similar vectors in Qdrant
    const results = await qdrant.query(COLLECTION_NAME, {
      query: queryVector,

      filter: {
        must: [
          {
            key: "projectId",
            match: {
              value: projectId,
            },
          },
        ],
      },

      limit,

      with_payload: true,
    });

    return results?.points?.map((point) => point.payload) || [];
  } catch (error) {
    console.warn("Semantic Search Warning (falling back to direct file context):", error.message);
    return [];
  }
};