import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} from "../services/project.service.js";

import {
  validateCreateProject,
  validateUpdateProject,
} from "../validations/project.validation.js";

export const createProject = asyncHandler(async (req, res) => {
  validateCreateProject(req.body);

  const project = await createProjectService(
    req.body,
    req.user._id
  );

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project Created"));
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await getProjectsService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects));
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(
    req.params.id,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, project));
});

export const updateProject = asyncHandler(async (req, res) => {
  validateUpdateProject(req.body);

  const project = await updateProjectService(
    req.params.id,
    req.body,
    req.user._id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Updated"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  await deleteProjectService(
    req.params.id,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Project Deleted Successfully"
    )
  );
});