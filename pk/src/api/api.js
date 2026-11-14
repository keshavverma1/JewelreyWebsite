
import axios from "axios";

const api = axios.create({
  baseURL: "https://internal.pkjewels.world/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
