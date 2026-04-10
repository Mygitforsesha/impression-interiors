import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { transformImage } from "../utils/imageTransform";

const ImageCard = React.memo(function ImageCard({ project }) {
  const thumb = useMemo(() => transformImage(project?.images?.[0], "grid"), [project]);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {thumb ? (
          <img
            src={thumb}
            alt={project.title || "Project"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-slate-200" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="line-clamp-1 text-sm font-semibold text-slate-900 md:text-base">
              {project.title || "Untitled project"}
            </div>
            <div className="mt-1 line-clamp-1 text-xs text-slate-500 md:text-sm">
              {project.category || "General"}
            </div>
          </div>
          <div className="hidden rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 md:block">
            View Project
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition group-hover:opacity-100" />
    </Link>
  );
});

export default ImageCard;

