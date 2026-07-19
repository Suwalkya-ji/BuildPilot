import dotenv from "dotenv";
dotenv.config();

import groq from "./lib/groq.js";

async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence.",
        },
      ],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
  }
}

testGroq();