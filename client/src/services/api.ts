import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://rag-chatbot-production-ffa2.up.railway.app/api",
  // baseURL: "http://localhost:3001/api",
  timeout: 120000,
});

export default api;
