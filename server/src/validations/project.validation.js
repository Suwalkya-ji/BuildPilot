import ApiError from "../utils/ApiError.js";

export const validateCreateProject = (data) => {
  const { title } = data;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Project title is required");
  }
};

export const validateUpdateProject = (data) => {
  if (data.title !== undefined && (!data.title || !data.title.trim())) {
    throw new ApiError(400, "Project title cannot be empty");
  }
};