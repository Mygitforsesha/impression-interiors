import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectsContext";
import ProjectGallery from "../components/ProjectGallery";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { projects, loading, error } = useProjects();

  const project = useMemo(() => {
    const num = Number(id);
    return projects.find((p) => p.id === num) || null;
  }, [id, projects]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between">
        <Link to="/projects" className="text-sm font-semibold text-slate-900 hover:underline">
          ← Back to Projects
        </Link>
        {project?.insta_url ? (
          <a
            href={project.insta_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-slate-900 hover:underline"
          >
            Instagram ↗
          </a>
        ) : null}
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {loading && !project ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ) : !project ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
          Project not found.
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <ProjectGallery images={project.images} instaUrl={project.insta_url} />

          <div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">{project.title || "Untitled"}</h1>
            <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {project.category || "General"}
            </div>

            <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700 md:text-base">
              {project.description || "No description provided."}
            </p>

            {project.insta_url ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Tip</div>
                <div className="mt-1 text-sm text-slate-600">
                  This project has an Instagram link. Clicking the main image opens it in a new tab.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

