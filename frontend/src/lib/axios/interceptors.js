import { api } from "./client";

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // network / CORS / no response
    if (!error.response) {
      return Promise.reject(error);
    }

    // only handle 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // do not retry refresh endpoint itself
    if (originalRequest.url.includes("/auth/refresh")) {
      forceLogout();
      return Promise.reject(error);
    }

    // avoid infinite loops
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = api.post("/auth/refresh");
      }

      await refreshPromise;

      isRefreshing = false;
      refreshPromise = null;

      // retry original request (cookies already updated)
      return api(originalRequest);
    } catch (err) {
      isRefreshing = false;
      refreshPromise = null;

      forceLogout();
      return Promise.reject(err);
    }
  }
);

function forceLogout() {
  try {
    api.post("/auth/logout"); // clears cookies on backend
  } catch {}

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
