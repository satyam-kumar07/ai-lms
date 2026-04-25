import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-lms-backend-m6q4.onrender.com/api",
});

export default API;