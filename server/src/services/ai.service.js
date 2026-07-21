import groq from "../lib/groq.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import { parseAIResponse } from "../utils/aiResponseParser.js";
import { searchRelevantFiles } from "./rag.service.js";

/**
 * ==========================================
 * Generate New Website
 * ==========================================
 */
export const generateWebsiteService = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are an expert React.js and Tailwind CSS developer generating code for a Sandpack in-browser preview.

Generate a complete React project.

Return ONLY valid JSON with this exact format:

{
  "files":[
    {
      "path":"src/App.jsx",
      "content":"...",
      "type":"file",
      "language":"jsx"
    },
    {
      "path":"src/index.js",
      "content":"...",
      "type":"file",
      "language":"javascript"
    }
  ]
}

STRICT RULES — FOLLOW EXACTLY:

1. Return ONLY the JSON object. No markdown, no backticks, no explanations.
2. NEVER generate CSS files (App.css, index.css, styles.css, etc.). ZERO CSS files allowed.
3. NEVER import CSS files in any component. Remove any line like: import './App.css';
4. Use ONLY Tailwind CSS utility classes for ALL styling (className="...").
5. MANDATORY ENTRY POINT: "src/App.jsx" MUST ALWAYS be included in the files array as the root component. App.jsx MUST import and render all subcomponents.
6. MANDATORY INDEX: "src/index.js" MUST ALWAYS be included, importing App from './App' and rendering it.
7. Generate modular separate component files: src/App.jsx, src/components/... or src/Header.jsx.
8. Each component file must have its full implementation — no placeholder or empty components.
9. Component imports MUST use relative paths without file extensions: import Header from './Header' or import VisitingCard from './VisitingCard'
10. Every file content MUST be multi-line and properly indented. NEVER minify onto a single line.
11. For interactive features (auth, CRUD, forms), use React useState/localStorage — no backend calls.
12. Every file object must have: path, content, type, language fields.
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

  const summaryText = `I have generated your MERN & React application with ${parsedResponse.files.length} modular files (${parsedResponse.files.map(f => f.path.split("/").pop()).join(", ")}). You can inspect the code in Monaco Editor or test it live in Preview.`;

  return {
    files: parsedResponse.files,
    rawResponse: summaryText,
  };
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

  // Deduplicate message in project history
  const lastMsg = project.messages[project.messages.length - 1];
  if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== message) {
    project.messages.push({
      role: "user",
      content: message,
    });
  }

  await project.save();

  try {
    // Search and inject relevant project files with fallback
    const relevantFiles = await searchRelevantFiles(
      project._id.toString(),
      message
    );

    const projectContext = relevantFiles
      .map(
        (file) => `
File: ${file.filePath || file.path}

${file.content}
`
      )
      .join("\n\n");

    const formattedHistory = project.messages.map((msg) => ({
      role: msg.role === "system" ? "assistant" : msg.role,
      content: msg.content,
    }));

    const messages = [
      {
        role: "system",
        content: `
You are an expert React.js and Tailwind CSS developer modifying a project running in Sandpack in-browser preview.

Relevant project context:
${projectContext}

STRICT RULES — FOLLOW EXACTLY:
1. Return ONLY the JSON object. No markdown, no backticks, no explanations.
2. NEVER generate CSS files (App.css, index.css, styles.css, etc.). ZERO CSS files allowed.
3. NEVER import CSS files. Remove any line like: import './App.css';
4. Use ONLY Tailwind CSS utility classes for ALL styling.
5. MANDATORY: "src/App.jsx" MUST ALWAYS be included in the returned files array. App.jsx MUST be the main entry component that renders all subcomponents.
6. MANDATORY: "src/index.js" MUST ALWAYS be included in the returned files array.
7. Component imports MUST use relative paths without file extensions: import Header from './Header'
8. Every file content MUST be multi-line and properly indented.
9. For interactive features, use React useState/localStorage — no backend calls.
10. Return ONLY valid JSON: { "files": [] }
`,
      },

      ...formattedHistory,

      {
        role: "system",
        content: `
Current project files:

${JSON.stringify(project.generatedFiles, null, 2)}

Modify the project according to the latest user request.

Return the COMPLETE updated files array containing ALL files (including src/App.jsx, src/index.js, and any new or modified component files).
`,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages,
    });

    const aiResponse = completion.choices[0].message.content;
    const parsedResponse = parseAIResponse(aiResponse);

    if (parsedResponse && parsedResponse.files && parsedResponse.files.length > 0) {
      project.generatedFiles = parsedResponse.files;
    }

    const assistantSummary = `Updated project code with requested modifications across ${parsedResponse.files.length} files. Hot-reloading live preview and Monaco Editor updated.`;

    project.messages.push({
      role: "assistant",
      content: assistantSummary,
    });

    project.status = "completed";
    await project.save();

    return project;
  } catch (error) {
    console.error("AI Chat Service Error:", error);
    project.status = "failed";
    await project.save();

    throw new ApiError(
      500,
      error.message || "Chat generation failed."
    );
  }
};