import { qdrant } from "../config/qdrant.js";

const COLLECTION_NAME = "project_files";

export const createCollection = async () => {
  try {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (exists) {
      console.log("✅ Qdrant collection already exists");
      return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 384, // We'll use an embedding model with 384 dimensions
        distance: "Cosine",
      },
    });

    console.log("✅ Qdrant collection created");
  } catch (error) {
    console.error("❌ Failed to create collection:", error);
    throw error;
  }
};