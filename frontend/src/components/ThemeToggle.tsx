import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./Button";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem("smartWasteTheme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("smartWasteTheme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <Button variant="secondary" className="px-3" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
