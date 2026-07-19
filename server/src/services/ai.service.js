import groq from "../lib/groq.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import { parseAIResponse } from "../utils/aiResponseParser.js";

/**
 * ==========================================
 * Generate New Website
 * ==========================================
 */
export const generateWebsiteService = async (
  projectId,
  prompt,
  userId
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  project.status = "generating";

  // Save first user prompt
  project.messages.push({
    role: "user",
    content: prompt,
  });

  await project.save();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `
You are an expert React.js and Tailwind CSS developer.

Generate a complete React project.

Return ONLY valid JSON.

Response format:

{
  "files":[
    {
      "path":"src/App.jsx",
      "content":"...",
      "type":"file",
      "language":"jsx"
    }
  ]
}

Rules:

- Return ONLY JSON.
- Do NOT use markdown.
- Do NOT use \`\`\`.
- Do NOT write explanations.
- Generate a complete React project.
- Use Tailwind CSS.
- Use functional components.
- Every file must contain:
  - path
  - content
  - type
  - language
`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    const parsedResponse = parseAIResponse(aiResponse);

    project.prompt = prompt;
    project.generatedFiles = parsedResponse.files;

    project.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    project.status = "completed";

    await project.save();

    return project;
  } catch (error) {
    project.status = "failed";
    await project.save();

    throw new ApiError(
      500,
      error.message || "Website generation failed."
    );
  }
};

/**
 * ==========================================
 * Continue Chat With Existing Project
 * ==========================================
 */
export const chatWithProjectService = async (
  projectId,
  message,
  userId
) => {
  const project = await Project.findOne({
    _id: projectId,
    owner: userId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  project.status = "generating";

  project.messages.push({
    role: "user",
    content: message,
  });

  await project.save();

  try {
    const formattedHistory = project.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const messages = [
      {
        role: "system",
        content: `
You are an expert React.js developer.

You are modifying an existing React project.

Return ONLY valid JSON.

Response format:

{
  "files":[]
}

Rules:

- Return ONLY JSON.
- No markdown.
- No explanation.
- Return the COMPLETE updated project.
`,
      },

      ...formattedHistory,

      {
        role: "system",
        content: `
Current project files:

${JSON.stringify(project.generatedFiles, null, 2)}

Modify the project according to the latest user request.

Return the COMPLETE updated files array.
`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const aiResponse = completion.choices[0].message.content;

    const parsedResponse = parseAIResponse(aiResponse);

    project.generatedFiles = parsedResponse.files;

    project.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    project.status = "completed";

    await project.save();

    return project;
  } catch (error) {
    project.status = "failed";

    await project.save();

    throw new ApiError(
      500,
      error.message || "Chat generation failed."
    );
  }
};