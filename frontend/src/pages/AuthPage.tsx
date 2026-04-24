import { FormEvent, useMemo, useState } from "react";
import { Leaf, LoaderCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const loadingText = useMemo(
    () => (mode === "login" ? "Signing you in..." : "Creating your account..."),
    [mode]
  );

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(String(form.get("name")), String(form.get("email")), String(form.get("password")));
      } else {
        await login(String(form.get("email")), String(form.get("password")));
      }
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-66px)] place-items-center bg-[#eaf7ee] px-4 py-12 dark:bg-[#101414]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-black/10 bg-white shadow-glow dark:border-white/10 dark:bg-[#151c1a] md:grid-cols-2">
        <div className="relative min-h-[360px] bg-[linear-gradient(135deg,rgba(47,111,87,.95),rgba(34,211,238,.72)),url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-8 text-white">
          <Leaf size={42} />
          <h1 className="mt-8 font-display text-4xl font-bold">Turn city waste into measurable climate action.</h1>
          <p className="mt-4 max-w-md text-white/78">
            Coordinate cleaner neighborhoods with smart pickups, real-time request tracking, and AI guidance for better recycling decisions.
          </p>
        </div>
        <form onSubmit={submit} className="p-8">
          <h2 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Create account"}</h2>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">Access pickups, AI recycling guidance, and live updates.</p>
          <div className="mt-8 grid gap-4">
            {mode === "signup" && <input className="field" name="name" placeholder="Full name" minLength={2} required />}
            <input className="field" name="email" type="email" placeholder="Email" required />
            <input className="field" name="password" type="password" placeholder="Password" minLength={6} required />
            <Button disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  {loadingText}
                </>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-5 text-sm font-semibold text-moss dark:text-mint">
            {mode === "login" ? "Need an account? Sign up" : "Already registered? Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
