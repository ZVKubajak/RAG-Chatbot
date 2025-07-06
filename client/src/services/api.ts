import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://rag-chatbot-production-6edd.up.railway.app/api",
  timeout: 120000,
});

export default api;
