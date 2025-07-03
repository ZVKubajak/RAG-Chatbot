import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 120000,
});

export default api;
