// src/context/AppContext.js
import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { appsAPI, categoriesAPI, downloadsAPI, recommendAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const initialState = {
  apps: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  categories: [],
  trendingApps: [],
  recommendations: [],
  selectedCategory: null,
  searchQuery: "",
  sortBy: "createdAt",
  sortDir: "desc",
  loading: false,
  searchLoading: false,
  searchResults: [],
  ownedAppIds: [],
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_APPS":
      return {
        ...state,
        apps: Array.isArray(action.payload?.content) ? action.payload.content : [],
        totalPages: Number.isFinite(action.payload?.totalPages) ? action.payload.totalPages : 0,
        totalElements: Number.isFinite(action.payload?.totalElements) ? action.payload.totalElements : 0,
        currentPage: Number.isFinite(action.payload?.number) ? action.payload.number : 0,
        loading: false,
      };
    case "SET_CATEGORIES":
      return { ...state, categories: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_TRENDING":
      return { ...state, trendingApps: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_RECOMMENDATIONS":
      return { ...state, recommendations: Array.isArray(action.payload) ? action.payload : [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SEARCH_LOADING":
      return { ...state, searchLoading: action.payload };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: Array.isArray(action.payload) ? action.payload : [], searchLoading: false };
    case "SET_OWNED_APP_IDS":
      return { ...state, ownedAppIds: Array.isArray(action.payload) ? action.payload : [] };
    case "ADD_OWNED_APP_ID": {
      const nextId = String(action.payload);
      const ownedAppIds = state.ownedAppIds.map(String);
      if (ownedAppIds.includes(nextId)) return state;
      return { ...state, ownedAppIds: [...state.ownedAppIds, action.payload] };
    }
    case "SET_FILTER":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  const fetchApps = useCallback(async (params = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data } = await appsAPI.list({
        page: state.currentPage,
        size: 12,
        sortBy: state.sortBy,
        direction: state.sortDir,
        categoryId: state.selectedCategory,
        ...params,
      });
      dispatch({ type: "SET_APPS", payload: data.data });
    } catch {
      toast.error("Failed to load apps");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [state.currentPage, state.sortBy, state.sortDir, state.selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await categoriesAPI.list();
      dispatch({ type: "SET_CATEGORIES", payload: data.data });
    } catch {/* silent */}
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const { data } = await appsAPI.trending(8);
      dispatch({ type: "SET_TRENDING", payload: data.data });
    } catch {/* silent */}
  }, []);

  const fetchRecommendations = useCallback(async (userId) => {
    try {
      const { data } = await recommendAPI.forUser(userId);
      dispatch({ type: "SET_RECOMMENDATIONS", payload: data.data });
    } catch {/* silent */}
  }, []);

  const fetchOwnedApps = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "SET_OWNED_APP_IDS", payload: [] });
      return;
    }

    try {
      const { data } = await downloadsAPI.mine({ page: 0, size: 200 });
      const downloads = Array.isArray(data.data?.content) ? data.data.content : [];
      const ids = downloads
        .map((item) => item?.app?.id)
        .filter((value) => value !== null && value !== undefined);
      dispatch({ type: "SET_OWNED_APP_IDS", payload: ids });
    } catch {
      dispatch({ type: "SET_OWNED_APP_IDS", payload: [] });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOwnedApps();
  }, [fetchOwnedApps, user?.id]);

  const searchApps = useCallback(async (query) => {
    if (!query.trim()) return;
    dispatch({ type: "SET_SEARCH_LOADING", payload: true });
    try {
      const { data } = await appsAPI.search(query);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: data.data.content || [] });
    } catch {
      dispatch({ type: "SET_SEARCH_LOADING", payload: false });
    }
  }, []);

  const setFilter = (filter) => dispatch({ type: "SET_FILTER", payload: filter });

  const downloadApp = async (appId) => {
    try {
      await appsAPI.download(appId);
      dispatch({ type: "ADD_OWNED_APP_ID", payload: appId });
      toast.success("Download started!");
    } catch {
      toast.error("Download failed");
    }
  };

  const isAppOwned = useCallback((appId) => {
    const id = String(appId);
    return state.ownedAppIds.map(String).includes(id);
  }, [state.ownedAppIds]);

  return (
    <AppContext.Provider value={{
      ...state,
      fetchApps,
      fetchCategories,
      fetchTrending,
      fetchRecommendations,
      searchApps,
      setFilter,
      downloadApp,
      fetchOwnedApps,
      isAppOwned,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
