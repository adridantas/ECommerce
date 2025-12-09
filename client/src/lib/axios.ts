import axios from "axios";

const token = localStorage.getItem("token");

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 🔥 Aplica o token ao instance
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 🔥 Garante que qualquer mudança futura atualiza o header
api.interceptors.request.use(
  (config) => {
    const newToken = localStorage.getItem("token");
    if (newToken) {
      config.headers["Authorization"] = `Bearer ${newToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
