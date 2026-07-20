import { qdrant } from "../config/qdrant.js";
import { generateEmbedding } from "./embedding.service.js";
import crypto from "crypto";

const COLLECTION_NAME = "project_files";

export const indexProjectFile = async (
  projectId,
  filePath,
  content
) => {
  try {
    const embedding = await generateEmbedding(content);

    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: crypto.randomUUID(),

          vector: embedding,

          payload: {
            projectId,
            filePath,
            content,
          },
        },
      ],
    });

    console.log(`✅ Indexed ${filePath}`);
  } catch (error) {
    console.error("Indexing Error:", error);
    throw error;
  }
};

export const deleteProjectVectors = async (projectId) => {
  try {
    await qdrant.delete(COLLECTION_NAME, {
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
      wait: true,
    });

    console.log(`🗑 Deleted vectors for project ${projectId}`);
  } catch (error) {
    console.error("Delete Vector Error:", error);
    throw error;
  }
};