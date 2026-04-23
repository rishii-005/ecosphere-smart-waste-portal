import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white dark:bg-mint dark:text-ink shadow-glow",
  secondary: "bg-white/70 text-ink ring-1 ring-black/10 dark:bg-white/10 dark:text-white dark:ring-white/15",
  ghost: "bg-transparent text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
};

export function Button({ className = "", variant = "primary", ...props }: HTMLMotionProps<"button"> & { variant?: Variant }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -1 }}
      className={`rounded-lg px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
