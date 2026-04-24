import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialToken = localStorage.getItem("smartWasteToken");
  const [user, setUser] = useState<User | null>(() => {
    if (!initialToken) return null;
    const raw = localStorage.getItem("smartWasteUser");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [token, setToken] = useState<string | null>(initialToken);

  useEffect(() => {
    void api.warmup().catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!token && user) {
      setUser(null);
      localStorage.removeItem("smartWasteUser");
    }
  }, [token, user]);

  const persist = (nextUser: User, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("smartWasteUser", JSON.stringify(nextUser));
    localStorage.setItem("smartWasteToken", nextToken);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      login: async (email, password) => {
        const result = await api.login(email, password);
        persist(result.user, result.token);
        toast.success(`Welcome back, ${result.user.name}`);
      },
      signup: async (name, email, password) => {
        const result = await api.signup(name, email, password);
        persist(result.user, result.token);
        toast.success("Account created.");
      },
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("smartWasteUser");
        localStorage.removeItem("smartWasteToken");
        toast("Signed out.");
      }
    }),
    [token, user]
  );

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("smartWasteUser");
      localStorage.removeItem("smartWasteToken");
      toast.error("Session expired. Please login again.");
    };

    window.addEventListener("smartWaste:auth-expired", handleExpiredSession);
    return () => {
      window.removeEventListener("smartWaste:auth-expired", handleExpiredSession);
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
