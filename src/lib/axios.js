import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, //sends the cookie to the backend
});