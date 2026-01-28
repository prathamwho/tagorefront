import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:1601/api" : "https://tagore-backend.onrender.com",
  withCredentials: true, //sends the cookie to the backend
});