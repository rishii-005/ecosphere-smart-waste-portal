import { motion } from "framer-motion";
import { ArrowRight, Bell, Bot, MapPinned, Recycle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { EarthScene } from "../components/EarthScene";
import { Button } from "../components/Button";
import { sustainablePractices } from "../lib/recycling";

const metrics = [
  ["12k+", "citizen pickups"],
  ["41%", "faster routing"],
  ["8.2T", "waste diverted"],
  ["24/7", "AI helpdesk"]
];

export function LandingPage() {
  return (
    <>
      <section className="relative min-h-[92vh] overflow-hidden subtle-grid">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(74,222,128,.28),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(34,211,238,.22),transparent_26%),linear-gradient(135deg,rgba(244,251,246,.92),rgba(245,200,76,.14))] dark:bg-[radial-gradient(circle_at_20%_18%,rgba(74,222,128,.18),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,.16),transparent_28%),linear-gradient(135deg,#101414,#18231f)]" />
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2">
          <EarthScene />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col justify-center px-4 pb-20 pt-24 lg:min-h-[88vh]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-bold text-moss ring-1 ring-black/10 backdrop-blur dark:bg-white/10 dark:text-mint dark:ring-white/10">
              <Sparkles size={16} /> Smart city recycling command center
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-tight text-ink dark:text-white md:text-7xl">
              Cleaner streets, smarter pickups, better recycling decisions.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-black/70 dark:text-white/72">
              Request waste pickup, track every status update live, and ask an AI guide how to recycle confusing items before they reach the bin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/request"><Button className="flex items-center gap-2">Request pickup <ArrowRight size={18} /></Button></Link>
              <Link to="/ai"><Button variant="secondary" className="flex items-center gap-2"><Bot size={18} /> Ask EcoGuide</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white dark:bg-[#121817]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([value, label]) => (
            <motion.div whileHover={{ y: -4 }} key={label} className="rounded-lg border border-black/10 p-6 dark:border-white/10">
              <div className="font-display text-4xl font-extrabold">{value}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-black/55 dark:text-white/55">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section bg-[#eaf7ee] dark:bg-[#101414]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold">One workflow from doorstep to recovery.</h2>
            <p className="mt-3 text-black/65 dark:text-white/65">Designed for citizens, municipal teams, and sustainability clubs.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: MapPinned, title: "Request", text: "Choose waste type, quantity, address, and pickup date." },
              { icon: Bell, title: "Track", text: "Receive live Socket.IO updates when admins move requests." },
              { icon: Recycle, title: "Recover", text: "Use AI and education cards to sort materials correctly." }
            ].map((item) => (
              <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }} key={item.title} className="glass rounded-lg p-6">
                <item.icon className="text-moss dark:text-mint" size={30} />
                <h3 className="mt-5 font-display text-2xl font-bold">{item.title}</h3>
                <p className="mt-2 text-black/65 dark:text-white/65">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-[#121817]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 md:grid-cols-3">
          {sustainablePractices.map((item) => (
            <div key={item.title} className="flex gap-4 rounded-lg border border-black/10 p-5 dark:border-white/10">
              <item.icon className="shrink-0 text-moss dark:text-mint" />
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-black/65 dark:text-white/65">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
