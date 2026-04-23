import { useState } from "react";
import { Download, Link2, Youtube, Music2, Video, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PLATFORMS = [
  "YouTube", "TikTok", "Instagram", "Twitter / X", "Facebook",
  "Reddit", "SoundCloud", "Vimeo", "Twitch", "Pinterest", "Tumblr", "Bilibili",
];

export const Downloader = () => {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"auto" | "mp4" | "mp3">("auto");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return toast.error("Paste a video URL first.");
    try { new URL(url); } catch { return toast.error("That doesn't look like a valid URL."); }

    const params = new URLSearchParams({ u: url.trim() });
    if (format === "mp3") params.set("dm", "audio");
    const target = `https://cobalt.tools/?${params.toString()}`;
    window.open(target, "_blank", "noopener");
    toast.success("Downloader opened in new tab.");
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        Universal <span className="text-gradient">Downloader</span>
      </h1>
      <p className="mb-8 text-muted-foreground">
        Paste any video link — YouTube, TikTok, Instagram, Twitter, and more. Powered by cobalt.tools.
      </p>

      <form
        onSubmit={submit}
        className="rounded-2xl border border-primary/40 bg-gradient-card p-6 shadow-card"
      >
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" /> Video URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          className="w-full rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-glow"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {([
            { id: "auto" as const, label: "Auto", icon: Sparkles },
            { id: "mp4" as const, label: "Video (MP4)", icon: Video },
            { id: "mp3" as const, label: "Audio only", icon: Music2 },
          ]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFormat(id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium transition-smooth ${
                format === id
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-muted/40 hover:border-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}

          <button
            type="submit"
            className="ml-auto flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Download className="h-4 w-4" /> Download
          </button>
        </div>
      </form>

      <h2 className="mt-10 mb-4 flex items-center gap-2 font-display text-xl font-bold">
        <Youtube className="h-5 w-5 text-primary" /> Supported Platforms
      </h2>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => (
          <span key={p} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs">
            {p}
          </span>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
        ⚖ Only download content you have the rights to. Respect each platform's Terms of Service.
      </p>
    </section>
  );
};