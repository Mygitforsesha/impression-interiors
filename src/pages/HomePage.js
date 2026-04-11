import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProjects } from "../context/ProjectsContext";
import ImageCard from "../components/ImageCard";

export default function HomePage() {
  const { projects, error } = useProjects();

  const featured = useMemo(() => projects.slice(0, 6), [projects]);
  const showcaseImages = useMemo(
    () => [
      "/image1-unsplash.jpg",
      "/image2-unsplash.jpg",
      "/image3-unsplash.jpg",
      "/image4-unsplash.jpg",
      "/image5-unsplash.jpg",
      "/image6-unsplash.jpg",
    ],
    [],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 md:grid-cols-2 md:gap-10 md:p-10"
      >
        <div>
          <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
            Premium interiors • Thoughtful execution
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Elevate everyday living with interiors that feel exceptional.
          </h1>
          <p className="mt-4 max-w-prose text-sm text-slate-600 md:text-lg">
            We create calm, elegant, and highly functional spaces that instantly communicate quality,
            comfort, and refined taste.
          </p>
          <div className="mt-4 grid max-w-md grid-cols-2 gap-3 text-sm text-slate-700">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-lg font-semibold text-slate-900">70+</div>
              <div className="text-xs text-slate-500">Design concepts delivered</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="text-lg font-semibold text-slate-900">98%</div>
              <div className="text-xs text-slate-500">Client satisfaction focus</div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/projects"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Projects
            </Link>
            <Link
              to="/free-quote"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <div className="aspect-[16/9] w-full">
            <img
              src={showcaseImages[0]}
              alt="Luxury interior living room"
              loading="eager"
              className="block h-full w-full object-cover object-center"
            />
            </div>
          </div>
          {showcaseImages.slice(1, 5).map((src, idx) => (
            <div key={src} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <div className="aspect-[4/3] w-full">
                <img
                  src={src}
                  alt={`Interior inspiration ${idx + 2}`}
                  loading="lazy"
                  className="block h-full w-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
        {[
          {
            title: "Tailored Concepts",
            text: "We design around your lifestyle with clean, elegant interiors that feel personal.",
          },
          {
            title: "Material Harmony",
            text: "Balanced textures, warm lighting, and thoughtful finishes that age beautifully.",
          },
          {
            title: "On-time Delivery",
            text: "Structured execution with clear milestones for a smooth design-to-handover journey.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 md:text-base">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 md:mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-2xl">Design inspiration gallery</h2>
            <p className="mt-1 text-sm text-slate-600">
              Curated visual references to reflect the finish, mood, and detailing we aim for.
            </p>
          </div>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {showcaseImages.map((src, idx) => (
            <div key={src} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <img
                src={src}
                alt={`Impression interiors inspiration ${idx + 1}`}
                loading="lazy"
                className="block h-auto w-full"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white md:mt-10 md:p-8">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold md:text-3xl">Create a space you love coming back to</h2>
          <p className="mt-3 text-sm text-slate-100 md:text-base">
            From compact urban homes to premium villas, we build interiors that combine comfort,
            function, and timeless aesthetics while keeping performance and clarity at every step.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/free-quote"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Start Your Project
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Talk to Designer
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 md:mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 md:text-2xl">Featured projects</h2>
            <p className="mt-1 text-sm text-slate-600">Fast, mobile-first gallery with optimized Cloudinary images.</p>
          </div>
          <Link to="/projects" className="text-sm font-semibold text-slate-900 hover:underline">
            View all
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            {error}
          </div>
        )}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.06 } },
          }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((p) => (
            <motion.div
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <ImageCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

