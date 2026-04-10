import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../context/ProjectsContext";
import { uploadImages } from "../services/cloudinary";
import { transformImage } from "../utils/imageTransform";
import { fetchLeads } from "../services/leads";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const { projects, loading, error, createProject, deleteProject, reload } = useProjects();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    insta_url: "",
  });
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // {index,total,pct}
  const [message, setMessage] = useState("");
  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const previews = useMemo(() => {
    return files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => b.id - a.id);
  }, [projects]);
  const totalImages = useMemo(
    () => sorted.reduce((acc, item) => acc + (Array.isArray(item.images) ? item.images.length : 0), 0),
    [sorted],
  );
  const sortedLeads = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [leads],
  );

  const onUpload = async () => {
    setMessage("");
    if (!form.title.trim()) {
      setMessage("Title is required.");
      return;
    }
    if (files.length === 0) {
      setMessage("Select at least one image.");
      return;
    }

    setBusy(true);
    setUploadProgress({ index: 0, total: files.length, pct: 0 });
    try {
      const urls = await uploadImages(files, {
        onProgress: (p) => setUploadProgress(p),
      });

      const project = {
        id: Date.now(),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || "General",
        images: urls,
        insta_url: form.insta_url.trim(),
      };

      await createProject(project);

      setForm({ title: "", description: "", category: "General", insta_url: "" });
      setFiles([]);
      setMessage("Uploaded successfully.");
    } catch (e) {
      setMessage(e?.message || String(e));
    } finally {
      setBusy(false);
      setUploadProgress(null);
    }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    setLeadsError("");
    try {
      const { leads: list } = await fetchLeads();
      setLeads(Array.isArray(list) ? list : []);
    } catch (e) {
      setLeadsError(e?.message || "Failed to load leads");
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-4xl">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 md:text-base">
            Craft a premium portfolio experience: upload to Cloudinary, publish to GitHub, and showcase your best interior designs in real time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => reload()}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="min-h-[44px] rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg md:p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-slate-100">
              Premium Interior Showcase
            </p>
            <h2 className="mt-3 text-xl font-semibold md:text-3xl">
              Every upload builds trust in your design quality.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
              Use this dashboard to present elegant, high-impact interiors. Keep project titles sharp,
              descriptions aspirational, and image sets curated to leave a lasting impression.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs text-slate-200">Projects Live</div>
              <div className="mt-1 text-2xl font-semibold">{sorted.length}</div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs text-slate-200">Images Hosted</div>
              <div className="mt-1 text-2xl font-semibold">{totalImages}</div>
            </div>
            <div className="col-span-2 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs text-slate-200">Total Leads</div>
              <div className="mt-1 text-2xl font-semibold">{sortedLeads.length}</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="text-sm font-semibold text-slate-900 md:text-base">Upload a project</div>
          <div className="mt-1 text-sm text-slate-600">
            Multiple images supported with previews and progress.
          </div>

          {message ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              {message}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            <Field label="Title">
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="e.g. Modern living room"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                placeholder="Short summary of the project..."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  placeholder="e.g. Kitchen"
                />
              </Field>
              <Field label="Instagram URL (optional)">
                <input
                  value={form.insta_url}
                  onChange={(e) => setForm((f) => ({ ...f, insta_url: e.target.value }))}
                  className="w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  placeholder="https://instagram.com/..."
                />
              </Field>
            </div>

            <Field label="Images (multiple)">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="block w-full text-sm"
              />
            </Field>

            {previews.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-medium text-slate-600">Preview</div>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previews.map((p) => (
                    <div key={p.url} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      <div className="aspect-[4/3]">
                        <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadProgress ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div>
                    Uploading {uploadProgress.index + 1}/{uploadProgress.total}
                  </div>
                  <div>{uploadProgress.pct}%</div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-slate-900 transition-all"
                    style={{ width: `${uploadProgress.pct}%` }}
                  />
                </div>
              </div>
            ) : null}

            <button
              type="button"
              disabled={busy}
              onClick={onUpload}
              className="w-full min-h-[44px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900 md:text-base">Uploaded projects</div>
              <div className="mt-1 text-sm text-slate-600">
                {loading ? "Loading..." : `${sorted.length} total`}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sorted.map((p) => {
              const thumb = transformImage(p.images?.[0], "grid");
              return (
                <motion.div
                  key={p.id}
                  layout
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.title || "Project"}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full animate-pulse bg-slate-200" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="line-clamp-1 text-sm font-semibold text-slate-900">{p.title || "Untitled"}</div>
                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">{p.category || "General"}</div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        if (!window.confirm("Delete this project?")) return;
                        setBusy(true);
                        try {
                          await deleteProject(p.id);
                        } catch (e) {
                          setMessage(e?.message || String(e));
                        } finally {
                          setBusy(false);
                        }
                      }}
                      className="mt-3 w-full min-h-[44px] rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {!loading && sorted.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
                No projects yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900 md:text-base">Leads inbox</div>
            <div className="mt-1 text-sm text-slate-600">Total Leads: {sortedLeads.length}</div>
          </div>
          <button
            type="button"
            onClick={loadLeads}
            className="min-h-[44px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Refresh Leads
          </button>
        </div>

        {leadsError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {leadsError}
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <div className="col-span-4 md:col-span-3">Name</div>
            <div className="col-span-4 md:col-span-3">Phone</div>
            <div className="col-span-2 hidden md:block">Budget</div>
            <div className="col-span-4 md:col-span-3">Date</div>
            <div className="col-span-4 text-right md:col-span-1">View</div>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {leadsLoading ? (
              <div className="p-6 text-sm text-slate-600">Loading leads...</div>
            ) : sortedLeads.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No leads yet</div>
            ) : (
              sortedLeads.slice(0, 200).map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedLead(lead)}
                  className={`grid w-full grid-cols-12 items-center border-b border-slate-100 px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${
                    selectedLead?.id === lead.id ? "bg-slate-50" : "bg-white"
                  }`}
                >
                  <div className="col-span-4 line-clamp-1 font-medium text-slate-800 md:col-span-3">{lead.name || "-"}</div>
                  <div className="col-span-4 line-clamp-1 text-slate-700 md:col-span-3">{lead.phone || "-"}</div>
                  <div className="col-span-2 hidden line-clamp-1 text-slate-600 md:block">{lead.budget || "-"}</div>
                  <div className="col-span-4 line-clamp-1 text-slate-600 md:col-span-3">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "-"}
                  </div>
                  <div className="col-span-4 text-right text-slate-800 md:col-span-1">Open</div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center" onClick={() => setSelectedLead(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">{selectedLead.name || "Lead details"}</div>
                <div className="text-xs text-slate-500">
                  Submitted {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : "-"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="min-h-[36px] rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Phone</div>
                <div className="mt-1 font-medium text-slate-800">{selectedLead.phone || "-"}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Budget</div>
                <div className="mt-1 font-medium text-slate-800">{selectedLead.budget || "-"}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Property Type</div>
                <div className="mt-1 font-medium text-slate-800">{selectedLead.propertyType || "-"}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <div className="text-xs text-slate-500">Message</div>
                <div className="mt-1 whitespace-pre-wrap text-slate-800">{selectedLead.message || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

