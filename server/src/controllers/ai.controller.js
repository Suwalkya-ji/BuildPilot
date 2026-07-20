import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  generateWebsiteService,
  chatWithProjectService,
} from "../services/ai.service.js";
import generationQueue from "../queues/generation.queue.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

export const generateWebsite = asyncHandler(async (req, res) => {
  const { projectId, prompt } = req.body;

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  project.status = "queued";
  await project.save();

  const job = await generationQueue.add("generate", {
    projectId,
    prompt,
    userId: req.user._id,
  });

  return res.status(202).json({
    success: true,
    message: "Generation started",
    jobId: job.id,
  });
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