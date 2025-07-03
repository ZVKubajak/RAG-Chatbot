import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "hhtp://localhost:3001/api",
  timeout: 30000,
});

export default api;
