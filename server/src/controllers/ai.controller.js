import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateWebsiteService } from "../services/ai.service.js";
import { chatWithProjectService } from "../services/ai.service.js";

export const generateWebsite = asyncHandler(async (req, res) => {
  const { projectId, prompt } = req.body;

  const project = await generateWebsiteService(
    projectId,
    prompt,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      project,
      "Website generated successfully."
    )
  );
});

export const chatWithProjectController = asyncHandler(
  async (req, res) => {

    const { projectId, message } = req.body;

    const project =
      await chatWithProjectService(
        projectId,
        message,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        project,
        "Chat response generated successfully."
      )
    );

  }
);