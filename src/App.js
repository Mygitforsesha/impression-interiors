import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingContactFab from "./components/FloatingContactFab";
import Footer from "./components/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetailPage = lazy(() => import("./pages/ProjectDetailPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const EstimationInteriorPage = lazy(() => import("./pages/EstimationInteriorPage"));
const EstimationKitchenPage = lazy(() => import("./pages/EstimationKitchenPage"));
const EstimationWardrobePage = lazy(() => import("./pages/EstimationWardrobePage"));
const FreeQuotePage = lazy(() => import("./pages/FreeQuotePage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {

  return (
    <div className="min-h-full">
      <Navbar />
      <FloatingContactFab />
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 md:px-6">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faqs" element={<FaqPage />} />
          <Route path="/estimation/interior" element={<EstimationInteriorPage />} />
          <Route path="/estimation/kitchen" element={<EstimationKitchenPage />} />
          <Route path="/estimation/wardrobe" element={<EstimationWardrobePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/free-quote" element={<FreeQuotePage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
