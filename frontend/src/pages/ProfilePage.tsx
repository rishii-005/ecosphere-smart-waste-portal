import { Shield, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section className="section">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="font-display text-4xl font-bold">Profile</h1>
        <p className="mt-2 text-black/65 dark:text-white/65">Your account details and access role.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-lg p-6">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-mint text-3xl font-bold text-ink">
              {user.name.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold">{user.name}</h2>
            <p className="mt-2 text-black/60 dark:text-white/60">{user.email}</p>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#151c1a]">
            <div className="grid gap-4">
              <div className="rounded-lg bg-black/5 p-4 dark:bg-white/5">
                <div className="flex items-center gap-2 font-semibold"><UserCircle2 size={18} /> Full Name</div>
                <div className="mt-2 text-lg">{user.name}</div>
              </div>
              <div className="rounded-lg bg-black/5 p-4 dark:bg-white/5">
                <div className="font-semibold">Email</div>
                <div className="mt-2 text-lg">{user.email}</div>
              </div>
              <div className="rounded-lg bg-black/5 p-4 dark:bg-white/5">
                <div className="flex items-center gap-2 font-semibold"><Shield size={18} /> Role</div>
                <div className="mt-2 text-lg capitalize">{user.role}</div>
              </div>
              <div className="rounded-lg bg-black/5 p-4 dark:bg-white/5">
                <div className="font-semibold">Member Since</div>
                <div className="mt-2 text-lg">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
