import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";
import {
  reindexProjectFiles,
  deleteProjectVectors,
} from "./vector.service.js";

export const createProjectService = async (data, userId) => {
  const project = await Project.create({
    ...data,
    owner: userId,
  });

  return project;
};

export const getProjectsService = async (userId) => {
  return await Project.find({ owner: userId }).sort({
    createdAt: -1,
  });
};

export const getProjectByIdService = async (id, userId) => {
  const project = await Project.findOne({
    _id: id,
    owner: userId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
};

export const updateProjectService = async (
  id,
  data,
  userId
) => {
  const project = await Project.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Manual edits change the files, so refresh chat context (runs in background)
  if (data.generatedFiles) {
    reindexProjectFiles(project._id.toString(), project.generatedFiles);
  }

  return project;
};

export const deleteProjectService = async (
  id,
  userId
) => {
  const project = await Project.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Remove the project's indexed files too
  deleteProjectVectors(project._id.toString()).catch(() => {});
};