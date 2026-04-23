import { useState } from "react";
import { KeyRound, Plus, Trash2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useApiKeys } from "@/hooks/useApiKeys";
import { toast } from "sonner";

export const ApiSettings = () => {
  const { keys, add, remove } = useApiKeys();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !value.trim()) return toast.error("Name and key required.");
    add(name, value);
    setName(""); setValue("");
    toast.success(`${name} key saved locally.`);
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        API <span className="text-gradient">Vault</span>
      </h1>
      <p className="mb-8 text-muted-foreground">
        Plug in any API key (TMDB, YouTube, OpenAI, custom). Stored only in your browser.
      </p>

      <div className="rounded-2xl border border-primary/40 bg-gradient-card p-6 shadow-card">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="API name (e.g. TMDB)"
            className="rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="API key / token"
            type="password"
            className="rounded-xl border border-border bg-muted/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Save
          </button>
        </form>

        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-[hsl(135_100%_50%)]" />
          Keys never leave your device — saved to localStorage only.
        </p>
      </div>

      <h2 className="mt-10 mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <KeyRound className="h-5 w-5 text-primary" /> Saved Keys ({keys.length})
      </h2>

      {keys.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No keys yet. Add one above.
        </p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {k.name}
              </span>
              <code className="flex-1 truncate font-mono text-xs text-muted-foreground">
                {reveal[k.id] ? k.value : "•".repeat(Math.min(k.value.length, 32))}
              </code>
              <button
                onClick={() => setReveal((r) => ({ ...r, [k.id]: !r[k.id] }))}
                className="rounded-lg p-2 hover:bg-muted"
                aria-label="Toggle reveal"
              >
                {reveal[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => remove(k.id)}
                className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                aria-label="Delete key"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};