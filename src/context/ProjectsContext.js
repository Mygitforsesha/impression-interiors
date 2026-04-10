import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { fetchProjects, updateProjects } from "../services/github";

function normalizeProject(p) {
  if (!p || typeof p !== "object") return null;

  const images = Array.isArray(p.images)
    ? p.images.filter(Boolean)
    : p.image
      ? [p.image]
      : [];

  return {
    id: typeof p.id === "number" ? p.id : Date.now(),
    title: typeof p.title === "string" ? p.title : "",
    description: typeof p.description === "string" ? p.description : "",
    category: typeof p.category === "string" ? p.category : "General",
    images,
    insta_url: typeof p.insta_url === "string" ? p.insta_url : "",
  };
}

function normalizeProjects(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const p of list) {
    const n = normalizeProject(p);
    if (n) out.push(n);
  }
  return out;
}

const ProjectsContext = createContext(null);

const initialState = {
  items: [],
  loading: false,
  error: null,
  fileMeta: null, // GitHub content API response (contains sha)
  lastLoadedAt: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        items: normalizeProjects(action.projects),
        fileMeta: action.fileMeta || null,
        lastLoadedAt: Date.now(),
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error || "Failed to load projects" };
    case "SET_ITEMS":
      return { ...state, items: normalizeProjects(action.items) };
    default:
      return state;
  }
}

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reload = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const { projects, fileMeta } = await fetchProjects();
      dispatch({ type: "FETCH_SUCCESS", projects, fileMeta });
    } catch (e) {
      dispatch({ type: "FETCH_ERROR", error: e?.message || String(e) });
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveAll = useCallback(
    async (items, { message } = {}) => {
      const normalized = normalizeProjects(items);
      const sha = state.fileMeta?.sha;
      const res = await updateProjects(normalized, { sha, message });
      // GitHub returns new content metadata; reload to refresh sha consistently.
      await reload();
      return res;
    },
    [reload, state.fileMeta?.sha],
  );

  const createProject = useCallback(
    async (project) => {
      const n = normalizeProject(project);
      if (!n) throw new Error("Invalid project");
      const next = [n, ...state.items];
      dispatch({ type: "SET_ITEMS", items: next });
      await saveAll(next, { message: `add project ${n.id}` });
      return n;
    },
    [saveAll, state.items],
  );

  const deleteProject = useCallback(
    async (id) => {
      const next = state.items.filter((p) => p.id !== id);
      dispatch({ type: "SET_ITEMS", items: next });
      await saveAll(next, { message: `delete project ${id}` });
    },
    [saveAll, state.items],
  );

  const value = useMemo(
    () => ({
      projects: state.items,
      loading: state.loading,
      error: state.error,
      reload,
      createProject,
      deleteProject,
    }),
    [createProject, deleteProject, reload, state.error, state.items, state.loading],
  );

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}

