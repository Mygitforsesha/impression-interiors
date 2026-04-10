import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useProjects } from "../context/ProjectsContext";
import ImageCard from "../components/ImageCard";

const PAGE_SIZE = 6;

export default function ProjectsPage() {
  const { projects, loading, error, reload } = useProjects();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    if (category === "All") return projects;
    return projects.filter((p) => p.category === category);
  }, [category, projects]);

  const shown = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Projects</h1>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            Browse projects with bandwidth-optimized Cloudinary images and lazy loading.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block text-sm font-medium text-slate-700">
            Category
            <select
              className="mt-1 block min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none sm:w-56"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setVisible(PAGE_SIZE);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => reload()}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:mb-0.5"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          GitHub API error: {error}
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
          No projects found for this category.
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.04 } },
            }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((p) => (
              <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                <ImageCard project={p} />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 flex items-center justify-center">
            {visible < filtered.length && (
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="min-h-[44px] w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                Load more (6)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

