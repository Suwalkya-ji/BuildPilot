import apiClient from "./axios";

export const generateWebsiteApi = async (data) => {
  const response = await apiClient.post("/ai/generate", data);
  return response.data;
};

export const chatWithProjectApi = async (data) => {
  const response = await apiClient.post("/ai/chat", data);
  return response.data;
};
