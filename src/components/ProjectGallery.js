import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { transformImage } from "../utils/imageTransform";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function ProjectGallery({ images = [], instaUrl }) {
  const list = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const listKey = useMemo(() => list.join("|"), [list]);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const touch = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setActive(0);
  }, [listKey]);

  const openTarget = useCallback(() => {
    if (instaUrl) {
      window.open(instaUrl, "_blank", "noreferrer");
      return;
    }
    setLightbox(true);
  }, [instaUrl]);

  const go = useCallback(
    (delta) => {
      if (list.length === 0) return;
      setLoaded(false);
      setActive((idx) => clamp(idx + delta, 0, list.length - 1));
    },
    [list.length],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const mainUrl = useMemo(() => transformImage(list[active], "detail"), [active, list]);
  const fullUrl = useMemo(() => transformImage(list[active], "fullscreen"), [active, list]);

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <div
          className="aspect-[4/3] w-full"
          onTouchStart={(e) => {
            const t = e.touches?.[0];
            if (!t) return;
            touch.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const t = e.changedTouches?.[0];
            if (!t) return;
            const dx = t.clientX - touch.current.x;
            const dy = t.clientY - touch.current.y;
            if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
            if (dx > 0) go(-1);
            else go(1);
          }}
        >
          {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
          {mainUrl ? (
            <button
              type="button"
              onClick={openTarget}
              className="relative h-full w-full"
              aria-label={instaUrl ? "Open Instagram" : "Open fullscreen"}
            >
              <img
                src={mainUrl}
                alt=""
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-left">
                <div className="text-xs font-medium text-white">
                  {instaUrl ? "Open Instagram" : "View fullscreen"} • Use swipe or arrows
                </div>
              </div>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-600">No images</div>
          )}
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {list.map((u, idx) => {
            const thumb = transformImage(u, "grid");
            const isActive = idx === active;
            return (
              <button
                key={`${u}-${idx}`}
                type="button"
                onClick={() => {
                  setLoaded(false);
                  setActive(idx);
                }}
                className={`shrink-0 overflow-hidden rounded-xl border ${
                  isActive ? "border-slate-900" : "border-slate-200"
                } bg-slate-100`}
                aria-label={`Select image ${idx + 1}`}
              >
                <div className="aspect-[4/3] w-24 md:w-28">
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70" onClick={() => setLightbox(false)} />
            <motion.div
              className="absolute inset-x-4 top-10 mx-auto max-w-5xl overflow-hidden rounded-2xl bg-black"
              initial={{ y: 16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center justify-between bg-black px-4 py-3">
                <div className="text-xs text-white/80">
                  {active + 1} / {list.length}
                </div>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/15"
                  onClick={() => setLightbox(false)}
                >
                  Close
                </button>
              </div>
              <div className="relative">
                <img src={fullUrl} alt="" className="max-h-[70vh] w-full object-contain" loading="lazy" />

                {list.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-900 shadow hover:bg-white"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

