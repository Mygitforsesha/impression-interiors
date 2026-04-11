import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginPage() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    const ok = login(form.username, form.password);
    if (!ok) {
      setError("Invalid credentials");
      return;
    }
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-10 md:px-6 md:py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
        <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
          Admin login
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Login to upload and manage projects.
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              required
              autoComplete="username"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="mt-1 w-full min-h-[44px] rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            className="w-full min-h-[44px] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
