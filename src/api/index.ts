import axios from "axios";

const HARDCODED_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MTg4NDkyLCJpYXQiOjE3NTUxNTI1NTIsImp0aSI6IjM2NzNkYzkwMzYzMDRjOWM5YTQxNDg0NjQ1MzJmNjVlIiwidXNlcl9pZCI6Mn0.kuHCO1p4NP2SVghK6WZko1KnUyvtcTyoS5-5x8IpOg8";
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1.0",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = `${HARDCODED_TOKEN}`;
  const csrfToken =
    "JPUrI3Fd9u0vEDavCK8ewnKyL6q3pAhZKmVm0BZOC6WA00P9ZyyUuT2uhzDMweWM";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (csrfToken) {
    config.headers["X-CSRFTOKEN"] = csrfToken;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - please login again");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
