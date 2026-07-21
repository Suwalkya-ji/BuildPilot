import apiClient from "./axios";

export const getProjectsApi = async () => {
  const response = await apiClient.get("/projects");
  return response.data;
};

export const getProjectApi = async (id) => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

export const createProjectApi = async (projectData) => {
  const response = await apiClient.post("/projects", projectData);
  return response.data;
};

export const updateProjectApi = async (id, updateData) => {
  const response = await apiClient.put(`/projects/${id}`, updateData);
  return response.data;
};

export const deleteProjectApi = async (id) => {
  const response = await apiClient.delete(`/projects/${id}`);
  return response.data;
};
