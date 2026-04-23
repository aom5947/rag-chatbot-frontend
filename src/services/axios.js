import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  // baseURL: import.meta.env.VITE_API_URL || "https://backend412.germanyitalyjapan.online",
});

// แนบ access token ทุก request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// refresh token อัตโนมัติ
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem("refresh_token");

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/refresh`, {
          refresh_token: refresh,
        });

        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        original.headers.Authorization = `Bearer ${res.data.access_token}`;
        return api(original);

      } catch (e) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;