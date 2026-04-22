import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "default", label: "Cyber Pink", className: "bg-[linear-gradient(135deg,#ff0066,#00ccff)]" },
  { id: "cyberpunk", label: "Cyberpunk", className: "bg-[linear-gradient(135deg,#ff0066,#00ffcc)]" },
  { id: "matrix", label: "Matrix", className: "bg-[linear-gradient(135deg,#00ff41,#008f11)]" },
  { id: "retrowave", label: "Retrowave", className: "bg-[linear-gradient(135deg,#ff6b9d,#ffb347)]" },
  { id: "midnight", label: "Midnight", className: "bg-[linear-gradient(135deg,#6c63ff,#3f3d9e)]" },
] as const;

const KEY = "cpn_theme_v1";

export const ThemeSwitcher = () => {
  const [active, setActive] = useState<string>(() => localStorage.getItem(KEY) || "default");

  useEffect(() => {
    document.body.classList.remove(
      "theme-default", "theme-cyberpunk", "theme-matrix", "theme-retrowave", "theme-midnight"
    );
    document.body.classList.add(`theme-${active}`);
    localStorage.setItem(KEY, active);
  }, [active]);

  return (
    <div className="fixed right-4 top-24 z-30 flex flex-col gap-2 rounded-full border border-primary bg-card/80 p-2 backdrop-blur-xl shadow-card">
      {themes.map((t) => (
        <button
          key={t.id}
          aria-label={t.label}
          title={t.label}
          onClick={() => setActive(t.id)}
          className={cn(
            "h-7 w-7 rounded-full border-2 transition-smooth",
            t.className,
            active === t.id ? "border-foreground scale-110" : "border-transparent hover:scale-105"
          )}
        />
      ))}
    </div>
  );
};