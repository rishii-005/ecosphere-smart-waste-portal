import type { RequestStatus } from "../types";

const styles: Record<RequestStatus, string> = {
  pending: "border border-yellow-500/35 bg-yellow-500/18 text-yellow-900 dark:text-yellow-100",
  "in-progress": "border border-cyan-500/35 bg-cyan-500/18 text-cyan-900 dark:text-cyan-100",
  completed: "border border-emerald-500/35 bg-emerald-500/18 text-emerald-900 dark:text-emerald-100"
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const label = status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${styles[status]}`}>{label}</span>;
}
