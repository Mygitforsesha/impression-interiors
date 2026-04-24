import React, { useMemo, useState, useEffect } from "react";
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
          "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.97]",
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
  const [scrolled, setScrolled] = useState(false);

  const { isAdmin, logout } = useAuth(); // ✅ NOW USED
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

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
      {
        to: "/estimation/interior",
        label: "Home Interior",
        icon: <Calculator className="h-4 w-4" />,
      },
      {
        to: "/estimation/kitchen",
        label: "Kitchen",
        icon: <ChefHat className="h-4 w-4" />,
      },
      {
        to: "/estimation/wardrobe",
        label: "Wardrobe",
        icon: <DoorOpen className="h-4 w-4" />,
      },
    ],
    [],
  );

  const moreLinks = useMemo(
    () => [
      {
        to: "/about",
        label: "About Us",
        icon: <BookOpenText className="h-4 w-4" />,
      },
      {
        to: "/projects",
        label: "Gallery",
        icon: <Grid3X3 className="h-4 w-4" />,
      },
      { to: "/faqs", label: "FAQs", icon: <HelpCircle className="h-4 w-4" /> },
      { to: "/blog", label: "Blog", icon: <Shapes className="h-4 w-4" /> },
    ],
    [],
  );

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur transition-all duration-300 ${
        scrolled ? "shadow-md py-2" : "py-3"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97]"
        >
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
              Creating spaces that inspire and impress
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-2 md:flex">
          {items.map((it) => (
            <NavItem key={it.to} to={it.to}>
              {it.label}
            </NavItem>
          ))}

          {/* Estimation */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("estimation")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 active:scale-[0.97]">
              Estimation <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {openDropdown === "estimation" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-11 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  {estimationLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:translate-x-1"
                    >
                      {l.icon}
                      {l.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown("more")}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 active:scale-[0.97]">
              More <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {openDropdown === "more" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                >
                  {moreLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:translate-x-1"
                    >
                      {l.icon}
                      {l.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ✅ ADMIN SECTION (fixes error) */}
          {isAdmin ? (
            <>
              <NavItem to="/admin/dashboard">Dashboard</NavItem>
              <button
                onClick={logout}
                className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200 active:scale-[0.97]"
              >
                Logout
              </button>
            </>
          ) : (
            <NavItem to="/admin-login">Admin</NavItem>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden rounded-xl border border-slate-200 p-2 transition-all duration-200 hover:bg-slate-50 active:scale-[0.95]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Side Menu */}
            <motion.aside
              className="fixed top-0 right-0 z-50 h-screen w-[82%] max-w-xs bg-white border-l border-slate-200 shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22 }}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                <div className="text-lg font-semibold text-slate-900">Menu</div>

                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-slate-200 p-2"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex flex-col gap-2 overflow-y-auto p-4">
                {items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      classNames(
                        "rounded-xl px-4 py-3 text-base font-medium transition",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-50 text-slate-800 hover:bg-slate-100",
                      )
                    }
                  >
                    {it.label}
                  </NavLink>
                ))}

                <div className="my-2 border-t border-slate-200" />

                {isAdmin ? (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-4 py-3 text-base font-medium bg-slate-50 text-slate-800 hover:bg-slate-100"
                    >
                      Dashboard
                    </NavLink>

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-left text-base font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/admin-login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-medium bg-slate-50 text-slate-800 hover:bg-slate-100"
                  >
                    Admin Login
                  </NavLink>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
