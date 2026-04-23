import { motion } from "framer-motion";
import { wasteGuides } from "../lib/recycling";

export function RecyclingPage() {
  return (
    <section className="section bg-[#eaf7ee] dark:bg-[#101414]">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-display text-4xl font-bold">Recycling education hub</h1>
        <p className="mt-2 max-w-2xl text-black/65 dark:text-white/65">Simple sorting habits prevent contamination and help recycling teams recover more material.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {wasteGuides.map((guide, index) => (
            <motion.article
              key={guide.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/10 dark:bg-[#151c1a]"
            >
              <img src={guide.image} alt={`${guide.title} recycling`} className="h-44 w-full object-cover" />
              <div className="p-5">
                <guide.icon className="text-moss dark:text-mint" />
                <h2 className="mt-4 font-display text-2xl font-bold">{guide.title}</h2>
                <ul className="mt-4 grid gap-2 text-sm text-black/65 dark:text-white/65">
                  {guide.tips.map((tip) => <li key={tip}>• {tip}</li>)}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
