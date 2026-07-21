import ApiError from "./ApiError.js";

/**
 * Robustly extract and parse JSON object from AI response string.
 */
function extractAndParseJSON(str) {
  if (!str || typeof str !== "string") return null;

  // 1. Direct JSON parse
  try {
    return JSON.parse(str.trim());
  } catch (e) {
    // continue
  }

  // 2. Try extracting from ```json ... ``` or ``` ... ``` code blocks
  const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (e) {
      // continue
    }
  }

  // 3. Extract substring between first '{' and last '}'
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = str.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSubstring);
    } catch (e) {
      // 4. Fallback: sanitize trailing commas and unescaped control chars
      try {
        const cleanedStr = jsonSubstring
          .replace(/,\s*([}\]])/g, "$1")
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
            if (match === "\n") return "\\n";
            if (match === "\r") return "\\r";
            if (match === "\t") return "\\t";
            return "";
          });
        return JSON.parse(cleanedStr);
      } catch (innerErr) {
        // continue
      }
    }
  }

  return null;
}

export const parseAIResponse = (response) => {
  if (!response) {
    throw new ApiError(500, "Empty AI response.");
  }

  const parsed = extractAndParseJSON(response);

  if (!parsed) {
    console.error(
      "❌ Failed to parse AI JSON response. Response snippet:",
      response.length > 500 ? response.slice(0, 500) + "..." : response
    );
    throw new ApiError(500, "AI returned invalid JSON.");
  }

  if (!parsed.files || !Array.isArray(parsed.files)) {
    throw new ApiError(
      500,
      "AI response must contain a files array."
    );
  }

  // Deduplicate files by path and unescape newlines
  const uniqueFilesMap = new Map();

  parsed.files.forEach((file) => {
    const filePath = file.path || file.filePath || "";
    if (filePath && !uniqueFilesMap.has(filePath)) {
      let rawContent = file.content || "";
      if (typeof rawContent === "string") {
        rawContent = rawContent.replace(/\\n/g, "\n");
      }

      uniqueFilesMap.set(filePath, {
        path: filePath,
        content: rawContent,
        type: file.type || "file",
        language: file.language || "",
      });
    }
  });

  parsed.files = Array.from(uniqueFilesMap.values());

  return parsed;
};