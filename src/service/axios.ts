// This axios if to try how to use AXIOS and implement in to my Trending Now Section. As a note the HERO section does not use AXIOS Yet per today (251015-Wednesday)

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { APIConfig } from "../config/apiConfig";

const axiosInstance = axios.create({
  baseURL: APIConfig.baseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // avoid hanging requests
  params: { language: "en-us" },
});

//Attach auth automatically on every request
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (APIConfig.apiKey) {
      config.params = { ...(config.params || {}), api_key: APIConfig.apiKey };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

if (import.meta.env.DEV && !APIConfig.apiKey) {
  // Helps you catch a missing key early while developing
  // // (Remove this block if you prefer silent behavior)
  // // eslint-disable-next-line no-console
  console.warn("TMDB api_key is missing. Set VITE_TMDB_API_KEY in your .env");
}

// Normalize TMDB errors into readable messages
axiosInstance.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const msg =
        (data && (data.status_message || data.message)) || error.message;
      // Common TMDB statuses: 401/403 auth, 404 not found, 429 rate limit
      return Promise.reject(new Error(`${status}: ${msg}`));
    }
    if (error.request) {
      return Promise.reject(new Error("Network error: no resonse from server"));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
