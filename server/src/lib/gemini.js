import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

/**
 * Send chat-style messages ({ role, content }) to Gemini and get back
 * the reply text as JSON. The first "system" message becomes the system
 * instruction; later system messages are sent as user turns.
 */
export const generateJSON = async (messages) => {
  const [first, ...rest] = messages;
  const hasSystem = first?.role === "system";

  const contents = (hasSystem ? rest : messages).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await ai.models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: hasSystem ? first.content : undefined,
      responseMimeType: "application/json",
    },
  });

  return response.text;
};
