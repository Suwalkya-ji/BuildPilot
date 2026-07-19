import ApiError from "./ApiError.js";

export const parseAIResponse = (response) => {
  if (!response) {
    throw new ApiError(500, "Empty AI response.");
  }

  // Remove Markdown wrappers
  const cleanResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let parsed;

  try {
    parsed = JSON.parse(cleanResponse);
  } catch {
    throw new ApiError(500, "AI returned invalid JSON.");
  }

  if (!parsed.files || !Array.isArray(parsed.files)) {
    throw new ApiError(
      500,
      "AI response must contain a files array."
    );
  }

  parsed.files = parsed.files.map((file) => ({
    path: file.path || "",
    content: file.content || "",
    type: file.type || "file",
    language: file.language || "",
  }));

  return parsed;
};