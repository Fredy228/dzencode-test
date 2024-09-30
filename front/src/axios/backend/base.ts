import axios, { isAxiosError } from "axios";
import { get, set, remove } from "local-storage";
import Notiflix from "notiflix";

import $authAPI from "../auth/base";

const $api = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_SERVER_BACKEND_URL,
});

$api.interceptors.request.use((config) => {
  const token = get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        console.log("refreshing");
        const { data } = await $authAPI.get<{ accessToken: string }>(
          "/auth/refresh",
        );
        set("token", data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === 401) {
          remove("token");
          Notiflix.Notify.failure("Your session has expired.");
          document.location.href = "/auth/login";
        } else {
          Notiflix.Notify.failure("Unknown session validation error");
        }
      }
    }
    throw error;
  },
);

export default $api;
