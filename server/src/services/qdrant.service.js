import { qdrant } from "../config/qdrant.js";

const COLLECTION_NAME = "project_files";

export const createCollection = async () => {
  try {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (exists) {
    console.info("[Qdrant] Collection already exists");
      return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384, // We'll use an embedding model with 384 dimensions
        distance: "Cosine",
      },
    });

    console.info("[Qdrant] Collection created successfully");
  } catch (error) {
    console.error("❌ Failed to create collection:", error);
    throw error;
  }
};