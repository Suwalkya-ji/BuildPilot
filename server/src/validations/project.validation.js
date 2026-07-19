import ApiError from "../utils/ApiError.js";

export const validateCreateProject = (data) => {
  const { title } = data;

  if (!title) {
    throw new ApiError(400, "Project title is required");
  }
};

export const validateUpdateProject = (data) => {
  const { title } = data;

  if (!title) {
    throw new ApiError(400, "Project title is required");
  }
};