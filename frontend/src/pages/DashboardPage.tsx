import { useCallback, useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Clock, Loader2, Truck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import type { PickupRequest, StatsSummary } from "../types";
import { Skeleton } from "../components/Skeleton";
import { StatusBadge } from "../components/StatusBadge";
import { useSocket } from "../hooks/useSocket";

const colors = ["#4ade80", "#22d3ee", "#f5c84c", "#fb7185", "#2f6f57", "#a3e635"];

export function DashboardPage() {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [statsData, requestData] = await Promise.all([api.getStats(), api.getRequests()]);
      setStats(statsData);
      setRequests(requestData.requests);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocket((updated) => {
    setRequests((items) => [updated, ...items.filter((item) => item.id !== updated.id)]);
    void load();
  });

  const wasteData = Object.entries(stats?.byWasteType || {}).map(([name, value]) => ({ name, value }));
  const statusData = Object.entries(stats?.byStatus || {}).map(([name, value]) => ({ name, value }));

  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-display text-4xl font-bold">Operations dashboard</h1>
        <p className="mt-2 text-black/60 dark:text-white/60">Live request tracking, impact totals, and material trends.</p>

        {loading ? (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-32" />)}
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              {[
                { label: "Total requests", value: stats?.total || 0, icon: BarChart3 },
                { label: "Pending", value: stats?.byStatus.pending || 0, icon: Clock },
                { label: "In progress", value: stats?.byStatus["in-progress"] || 0, icon: Truck },
                { label: "Completed", value: stats?.byStatus.completed || 0, icon: CheckCircle2 }
              ].map((card) => (
                <div key={card.label} className="glass rounded-lg p-5">
                  <card.icon className="text-moss dark:text-mint" />
                  <div className="mt-5 font-display text-3xl font-bold">{card.value}</div>
                  <div className="text-sm text-black/60 dark:text-white/60">{card.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151c1a]">
                <h2 className="font-display text-xl font-bold">Waste quantity by type</h2>
                <div className="mt-4 h-72">
                  <ResponsiveContainer>
                    <BarChart data={wasteData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {wasteData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#151c1a]">
                <h2 className="font-display text-xl font-bold">Status distribution</h2>
                <div className="mt-4 h-72">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={95} label>
                        {statusData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#151c1a]">
              <div className="border-b border-black/10 p-5 dark:border-white/10">
                <h2 className="font-display text-xl font-bold">Recent requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-black/5 dark:bg-white/5">
                    <tr>
                      <th className="p-4">Waste</th>
                      <th className="p-4">Quantity</th>
                      <th className="p-4">Pickup date</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-t border-black/10 dark:border-white/10">
                        <td className="p-4 capitalize">{request.wasteType}</td>
                        <td className="p-4">{request.quantityKg} kg</td>
                        <td className="p-4">{request.pickupDate}</td>
                        <td className="p-4">{request.address}</td>
                        <td className="p-4"><StatusBadge status={request.status} /></td>
                      </tr>
                    ))}
                    {!requests.length && (
                      <tr><td className="p-6 text-center text-black/60 dark:text-white/60" colSpan={5}><Loader2 className="mx-auto mb-2 animate-spin" />No requests yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
