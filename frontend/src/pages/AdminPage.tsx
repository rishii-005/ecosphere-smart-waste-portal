import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import type { PickupRequest, RequestStatus } from "../types";
import { StatusBadge } from "../components/StatusBadge";

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const result = await api.getRequests();
      setRequests(result.requests);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load admin data.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const update = async (id: string, status: RequestStatus) => {
    try {
      const result = await api.updateStatus(id, status);
      setRequests((items) => items.map((item) => (item.id === id ? result.request : item)));
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
      </div>
    </section>
  );
}
