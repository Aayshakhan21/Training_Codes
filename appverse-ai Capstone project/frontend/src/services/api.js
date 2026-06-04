// src/services/api.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request Interceptor (attach JWT) ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor (auto-refresh on 401) ────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const newToken = data.data.accessToken;
          localStorage.setItem("accessToken", newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  refresh:  (token) => api.post("/auth/refresh", { refreshToken: token }),
  logout:   (userId) => api.post(`/auth/logout/${userId}`),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
};

// ── Apps ─────────────────────────────────────────────────
export const appsAPI = {
  list:        (params) => api.get("/apps", { params }),
  search:      (q, page = 0) => api.get("/apps/search", { params: { q, page } }),
  getById:     (id) => api.get(`/apps/${id}`),
  getBySlug:   (slug) => api.get(`/apps/slug/${slug}`),
  purchaseStatus: (id) => api.get(`/apps/${id}/purchase-status`),
  purchaseDemo:   (id, data) => api.post(`/apps/${id}/purchase-demo`, data),
  trending:    (limit = 10) => api.get("/apps/trending", { params: { limit } }),
  create:      (data) => api.post("/apps", data),
  update:      (id, data) => api.put(`/apps/${id}`, data),
  delete:      (id) => api.delete(`/apps/${id}`),
  download:    (id) => api.post(`/apps/${id}/download`),
  changeStatus:(id, data) => api.patch(`/apps/${id}/status`, data),
  pending:     (params) => api.get("/apps/pending", { params }),
  topRated:    (limit = 10) => api.get("/apps/top-rated", { params: { limit } }),
  featured:    (limit = 10) => api.get("/apps/featured", { params: { limit } }),
  versions:    (id) => api.get(`/apps/${id}/versions`),
  addVersion:  (id, data) => api.post(`/apps/${id}/versions`, data),
  rollbackVersion: (id, versionId) => api.post(`/apps/${id}/versions/${versionId}/rollback`),
};

// ── Reviews ──────────────────────────────────────────────
export const reviewsAPI = {
  getByApp:  (appId, page = 0) => api.get(`/reviews/app/${appId}`, { params: { page } }),
  add:       (appId, userId, data) => api.post(`/reviews/app/${appId}/user/${userId}`, data),
  delete:    (reviewId, params) => api.delete(`/reviews/${reviewId}`, { params }),
  flagged:   () => api.get("/reviews/flagged"),
  moderate:  (reviewId, approve) => api.patch(`/reviews/${reviewId}/moderate`, null, { params: { approve } }),
};

// ── Recommendations ──────────────────────────────────────
export const recommendAPI = {
  forUser:  (userId, limit = 10) => api.get(`/recommendations/user/${userId}`, { params: { limit } }),
  trending: (limit = 10) => api.get("/recommendations/trending", { params: { limit } }),
  similar:  (appId, limit = 6) => api.get(`/recommendations/similar/${appId}`, { params: { limit } }),
};

export const aiAPI = {
  analyzeReview: (data) => api.post("/ai/analyze-review", data),
  recommendations: (data) => api.post("/ai/recommendations", data),
  similarApps: (data) => api.post("/ai/similar-apps", data),
  trending: (data) => api.post("/ai/trending", data),
  chat: (data) => api.post("/ai/chat", data),
  reviewSummary: (data) => api.post("/ai/review-summary", data),
};

// ── Categories ────────────────────────────────────────────
export const categoriesAPI = {
  list:    () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
};

export const usersAPI = {
  me: () => api.get("/users/me"),
  updateMe: (data) => api.put("/users/me", data),
  changePassword: (data) => api.post("/users/me/change-password", data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const bookmarksAPI = {
  list: () => api.get("/bookmarks"),
  add: (appId) => api.post(`/bookmarks/${appId}`),
  remove: (appId) => api.delete(`/bookmarks/${appId}`),
};

export const notificationsAPI = {
  list: () => api.get("/notifications"),
  markRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllRead: () => api.patch("/notifications/read-all"),
};

export const downloadsAPI = {
  mine: (params) => api.get("/downloads/me", { params }),
  remove: (downloadId) => api.delete(`/downloads/${downloadId}`),
};

export const developerAPI = {
  stats: () => api.get("/developer/stats"),
  apps: (params) => api.get("/developer/apps", { params }),
  downloads: (params) => api.get("/developer/downloads", { params }),
  analytics: () => api.get("/developer/stats"),
};

// ── Admin ─────────────────────────────────────────────────
export const adminAPI = {
  stats:        () => api.get("/admin/stats"),
  analytics:    () => api.get("/admin/analytics"),
  users:        (params) => api.get("/admin/users", { params }),
  developers:   (params) => api.get("/admin/developers", { params }),
  toggleUser:   (userId) => api.patch(`/admin/users/${userId}/toggle`),
  makeDeveloper:(userId) => api.patch(`/admin/users/${userId}/make-developer`),
  removeDeveloper:(userId) => api.patch(`/admin/developers/${userId}/remove-developer`),
  pendingApps:  (params) => api.get("/admin/apps/pending", { params }),
};

export default api;
