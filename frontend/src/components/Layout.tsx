import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, Home, LayoutDashboard, Leaf, LogOut, Menu, PlusCircle, Recycle, Shield, UserCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/request", label: "Pickup", icon: PlusCircle },
  { to: "/ai", label: "AI Guide", icon: Bot },
  { to: "/recycling", label: "Learn", icon: Leaf }
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4fbf6] text-ink transition dark:bg-[#101414] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-ink/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint text-ink"><Recycle size={20} /></span>
            SmartWaste
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? "bg-ink text-white dark:bg-white dark:text-ink" : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`
                }
              >
                <item.icon size={17} />
                {item.label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/10">
                <Shield size={17} /> Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-left transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/14"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-mint font-bold text-ink">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-36 truncate text-sm font-bold">{user.name}</span>
                    <span className="block text-xs text-black/55 dark:text-white/55">{user.role}</span>
                  </span>
                  <ChevronDown size={16} className={`transition ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-52 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#18201e]"
                    >
                      <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-black/55 dark:text-white/55">{user.email}</div>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-3 font-semibold transition hover:bg-black/5 dark:hover:bg-white/10">
                        <UserCircle2 size={17} /> Profile
                      </Link>
                      <button type="button" onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-left font-semibold transition hover:bg-black/5 dark:hover:bg-white/10">
                        <LogOut size={17} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login"><Button>Login</Button></Link>
            )}
            <Button variant="ghost" className="lg:hidden" onClick={() => setOpen((value) => !value)}>
              {open ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b border-black/10 bg-white dark:border-white/10 dark:bg-ink lg:hidden">
            <div className="grid gap-1 px-4 py-3">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold">
                  <item.icon size={17} /> {item.label}
                </NavLink>
              ))}
              {user && (
                <>
                  <Link to="/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold">
                    <UserCircle2 size={17} /> {user.name}
                  </Link>
                  <button type="button" onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold">
                    <LogOut size={17} /> Logout
                  </button>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
