import React, { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenText,
  Calculator,
  ChevronDown,
  ChefHat,
  DoorOpen,
  Grid3X3,
  HelpCircle,
  Menu,
  Shapes,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

const NavItem = React.memo(function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        classNames(
          "rounded-lg px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100",
        )
      }
    >
      {children}
    </NavLink>
  );
});

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  const items = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/projects", label: "Projects" },
      { to: "/contact", label: "Contact" },
      { to: "/free-quote", label: "Free Quote" },
    ],
    [],
  );

  const estimationLinks = useMemo(
    () => [
      { to: "/estimation/interior", label: "Home Interior", icon: <Calculator className="h-4 w-4" /> },
      { to: "/estimation/kitchen", label: "Kitchen", icon: <ChefHat className="h-4 w-4" /> },
      { to: "/estimation/wardrobe", label: "Wardrobe", icon: <DoorOpen className="h-4 w-4" /> },
    ],
    [],
  );

  const moreLinks = useMemo(
    () => [
      { to: "/about", label: "About Us", icon: <BookOpenText className="h-4 w-4" /> },
      { to: "/projects", label: "Gallery", icon: <Grid3X3 className="h-4 w-4" /> },
      { to: "/faqs", label: "FAQs", icon: <HelpCircle className="h-4 w-4" /> },
      { to: "/blog", label: "Blog", icon: <Shapes className="h-4 w-4" /> },
    ],
    [],
  );

  // Close drawer on route change
  React.useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Impression Interiors logo"
            className="h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm"
            loading="eager"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold md:text-base">
              Impression Interiors
            </div>
            <div className="text-xs text-slate-500">
              Interior Design Portfolio
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {items.map((it) => (
            <NavItem key={it.to} to={it.to}>
              {it.label}
            </NavItem>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("estimation")}
            onMouseLeave={() => setOpenDropdown((v) => (v === "estimation" ? null : v))}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((v) => (v === "estimation" ? null : "estimation"))}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              aria-label="Open estimation menu"
            >
              Estimation <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {openDropdown === "estimation" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-11 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  {estimationLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {l.icon}
                      {l.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("more")}
            onMouseLeave={() => setOpenDropdown((v) => (v === "more" ? null : v))}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((v) => (v === "more" ? null : "more"))}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              aria-label="Open more menu"
            >
              More <ChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {openDropdown === "more" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  {moreLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {l.icon}
                      {l.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAdmin ? (
            <>
              <NavItem to="/admin/dashboard">Dashboard</NavItem>
              <button
                onClick={logout}
                className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem to="/admin-login">Admin</NavItem>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden">
            <motion.button
              type="button"
              aria-label="Close mobile menu overlay"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-50 h-screen w-[84%] max-w-xs overflow-y-auto border-l border-slate-200 bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.24 }}
              aria-label="Mobile navigation menu"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div className="text-base font-semibold text-slate-900">
                  Menu
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 text-slate-700"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2 p-4">
                {items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        "min-h-[48px] rounded-xl px-4 py-3 text-base font-medium transition",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-800 hover:bg-slate-100",
                      )
                    }
                  >
                    {it.label}
                  </NavLink>
                ))}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Estimation</div>
                  <div className="space-y-1">
                    {estimationLinks.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white"
                      >
                        {l.icon}
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">More</div>
                  <div className="space-y-1">
                    {moreLinks.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white"
                      >
                        {l.icon}
                        {l.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="my-1 border-t border-slate-200" />
                {isAdmin ? (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          "min-h-[48px] rounded-xl px-4 py-3 text-base font-medium transition",
                          isActive
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-slate-800 hover:bg-slate-100",
                        )
                      }
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="min-h-[48px] rounded-xl border border-slate-200 px-4 py-3 text-left text-base font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/admin-login"
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        "min-h-[48px] rounded-xl px-4 py-3 text-base font-medium transition",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-800 hover:bg-slate-100",
                      )
                    }
                  >
                    Admin Login
                  </NavLink>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
