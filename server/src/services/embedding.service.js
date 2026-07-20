import { InferenceClient } from "@huggingface/inference";

export const generateEmbedding = async (text) => {
  try {
    const client = new InferenceClient(process.env.HF_API_KEY);
    const embedding = await client.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    return embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    throw error;
  }
};