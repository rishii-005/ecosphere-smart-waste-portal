import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, Database, Users } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import type { AdminUserProfile, PickupRequest, RequestStatus } from "../types";
import { StatusBadge } from "../components/StatusBadge";
import { useSocket } from "../hooks/useSocket";

const statuses: RequestStatus[] = ["pending", "in-progress", "completed"];

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-500/14 text-yellow-900 ring-yellow-500/30 dark:text-yellow-100",
  "in-progress": "bg-cyan-500/14 text-cyan-900 ring-cyan-500/30 dark:text-cyan-100",
  completed: "bg-emerald-500/14 text-emerald-900 ring-emerald-500/30 dark:text-emerald-100"
};

function statusLabel(status: RequestStatus) {
  return status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
}

export function AdminPage() {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"requests" | "users">("requests");

  const load = useCallback(async () => {
    try {
      const result = await api.getRequests();
      setRequests(result.requests);
      setUsers(result.users ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load admin data.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocket(() => {
    void load();
  });

  const update = async (id: string, status: RequestStatus) => {
    try {
      const result = await api.updateStatus(id, status);
      setRequests((items) => items.map((item) => (item.id === id ? result.request : item)));
      void load();
      toast.success("Status updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status.");
    }
  };

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-display text-4xl font-bold">Admin panel</h1>
        <p className="mt-2 text-black/65 dark:text-white/65">Move requests through the collection workflow. Citizens receive live notifications.</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "requests"
                ? "bg-mint text-ink"
                : "border border-black/10 bg-white text-ink dark:border-white/10 dark:bg-[#151c1a] dark:text-white"
            }`}
          >
            <Database size={16} />
            Requests ({requests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === "users"
                ? "bg-mint text-ink"
                : "border border-black/10 bg-white text-ink dark:border-white/10 dark:bg-[#151c1a] dark:text-white"
            }`}
          >
            <Users size={16} />
            Users ({users.length})
          </button>
        </div>

        {activeTab === "users" ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {users.map((user) => (
              <article key={user.id} className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151c1a]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold">{user.name}</h2>
                    <p className="mt-1 text-sm text-black/65 dark:text-white/65">{user.email}</p>
                  </div>
                  <span className="rounded-md bg-mint/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-moss dark:text-mint">
                    {user.role}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                    <p className="text-black/55 dark:text-white/55">Joined</p>
                    <p className="mt-1 font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                    <p className="text-black/55 dark:text-white/55">Requests</p>
                    <p className="mt-1 font-semibold">{user.totalRequests}</p>
                  </div>
                  <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                    <p className="text-black/55 dark:text-white/55">Total waste</p>
                    <p className="mt-1 font-semibold">{user.totalQuantityKg} kg</p>
                  </div>
                  <div className="rounded-lg bg-black/[0.03] p-3 dark:bg-white/[0.04]">
                    <p className="text-black/55 dark:text-white/55">Latest activity</p>
                    <p className="mt-1 font-semibold">{user.latestRequestAt ? new Date(user.latestRequestAt).toLocaleDateString() : "No requests yet"}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {user.requests.length > 0 ? (
                    user.requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="rounded-lg border border-black/8 p-3 dark:border-white/10">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold capitalize">{request.wasteType} pickup</p>
                          <StatusBadge status={request.status} />
                        </div>
                        <p className="mt-2 text-sm text-black/65 dark:text-white/65">
                          {request.quantityKg} kg · {request.pickupDate}
                        </p>
                        <p className="mt-1 text-sm">{request.address}</p>
                        {request.notes && <p className="mt-1 text-sm text-black/60 dark:text-white/60">{request.notes}</p>}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-black/10 p-4 text-sm text-black/60 dark:border-white/10 dark:text-white/60">
                      No pickup requests submitted yet.
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {requests.map((request) => (
              <article key={request.id} className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151c1a] lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-xl font-bold capitalize">{request.wasteType} pickup</h2>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-2 text-sm text-black/65 dark:text-white/65">{request.userName} - {request.quantityKg} kg - {request.pickupDate}</p>
                  <p className="mt-2 text-sm">{request.address}</p>
                  {request.notes && <p className="mt-2 text-sm text-black/60 dark:text-white/60">{request.notes}</p>}
                </div>

                <div className="relative self-center">
                  <button
                    type="button"
                    onClick={() => setOpenMenu((value) => (value === request.id ? null : request.id))}
                    className={`flex min-w-52 items-center justify-between rounded-lg px-4 py-3 font-semibold ring-1 transition ${statusStyles[request.status]}`}
                  >
                    <span>{statusLabel(request.status)}</span>
                    <ChevronDown size={18} className={`transition ${openMenu === request.id ? "rotate-180" : ""}`} />
                  </button>

                  {openMenu === request.id && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-52 overflow-hidden rounded-lg border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-[#1a2220]">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setOpenMenu(null);
                            void update(request.id, status);
                          }}
                          className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-ink transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
                        >
                          <span className={`rounded-md px-2 py-1 ring-1 ${statusStyles[status]}`}>{statusLabel(status)}</span>
                          {request.status === status && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
