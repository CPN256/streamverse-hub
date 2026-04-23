import { useEffect, useState } from "react";
import { Sparkles, Film } from "lucide-react";

export const Splash = ({ onDone }: { onDone: () => void }) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2600);
    const t2 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${leaving ? "opacity-0" : "opacity-100"}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 30%, hsl(var(--primary)/0.35) 0%, transparent 55%), radial-gradient(circle at 50% 80%, hsl(var(--secondary)/0.3) 0%, transparent 55%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary animate-pulse-dot"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 8) * 0.15}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center px-6 text-center animate-float-up">
        <div className="mb-6 flex items-center gap-3 rounded-full border border-primary/50 bg-background/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> A Neon Production
        </div>

        <h1 className="font-display text-5xl font-black leading-none tracking-widest md:text-7xl">
          <span className="text-gradient">CPN MOVIES</span>
        </h1>
        <p className="mt-2 font-display text-2xl font-black tracking-[0.4em] text-secondary md:text-3xl">
          2030
        </p>

        <div className="my-8 h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Created by
        </p>
        <p className="mt-2 font-display text-2xl font-black tracking-wide md:text-3xl">
          <span className="text-gradient">CAT PHOENIX</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          a.k.a <span className="font-semibold text-foreground">OUNDO NELSON</span>
        </p>

        <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Film className="h-3 w-3 animate-spin" style={{ animationDuration: "2s" }} />
          Booting Stream-X grid…
        </div>
      </div>
    </div>
  );
};