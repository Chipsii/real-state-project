import axios from "axios";

export const backendApi = axios.create({
  baseURL: process.env.BACKEND_URL,
  timeout: 15000,
});
