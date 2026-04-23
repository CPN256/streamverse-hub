import { useState } from "react";
import {
  Download, Link2, Youtube, Music2, Video, Sparkles, Loader2,
  Instagram, Facebook, Twitter, Globe, Package, HardDrive, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { dl } from "@/lib/davidcyril";

type Platform =
  | "auto" | "ytmp4" | "ytmp3" | "facebook" | "instagram"
  | "tiktok" | "twitter" | "spotify" | "website" | "drive" | "mediafire" | "apk";

const PLATFORMS: { id: Platform; label: string; icon: any; hint: string }[] = [
  { id: "auto",      label: "Auto Detect",  icon: Sparkles,  hint: "Paste any link" },
  { id: "ytmp4",     label: "YouTube MP4",  icon: Youtube,   hint: "Video" },
  { id: "ytmp3",     label: "YouTube MP3",  icon: Music2,    hint: "Audio only" },
  { id: "facebook",  label: "Facebook",     icon: Facebook,  hint: "Video" },
  { id: "instagram", label: "Instagram",    icon: Instagram, hint: "Reel / Post" },
  { id: "tiktok",    label: "TikTok",       icon: Video,     hint: "No watermark" },
  { id: "twitter",   label: "Twitter / X",  icon: Twitter,   hint: "Video" },
  { id: "spotify",   label: "Spotify",      icon: Music2,    hint: "MP3 download" },
  { id: "website",   label: "Website",      icon: Globe,     hint: "Full archive" },
  { id: "drive",     label: "Google Drive", icon: HardDrive, hint: "Direct link" },
  { id: "mediafire", label: "MediaFire",    icon: HardDrive, hint: "File link" },
  { id: "apk",       label: "APK",          icon: Package,   hint: "App name" },
];

const detect = (u: string): Platform => {
  const s = u.toLowerCase();
  if (s.includes("youtu"))      return "ytmp4";
  if (s.includes("facebook") || s.includes("fb.watch")) return "facebook";
  if (s.includes("instagram"))  return "instagram";
  if (s.includes("tiktok"))     return "tiktok";
  if (s.includes("twitter") || s.includes("x.com")) return "twitter";
  if (s.includes("spotify"))    return "spotify";
  if (s.includes("drive.google")) return "drive";
  if (s.includes("mediafire"))  return "mediafire";
  return "website";
};

interface ResultCard {
  title: string;
  thumbnail?: string;
  downloadUrl: string;
  meta?: string;
}

export const Downloader = () => {
  const [input, setInput] = useState("");
  const [platform, setPlatform] = useState<Platform>("auto");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultCard | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return toast.error("Paste a link (or app name for APK).");

    const target = platform === "auto" ? detect(value) : platform;
    if (target !== "apk") {
      try { new URL(value); } catch { return toast.error("That doesn't look like a valid URL."); }
    }

    setLoading(true);
    setResult(null);
    try {
      const res: any = await dl[target](value);
      const card = parseResult(target, res);
      if (!card?.downloadUrl) {
        toast.error(res?.message || res?.error || "No download link returned. Try a different link.");
      } else {
        setResult(card);
        toast.success("Download ready!");
      }
    } catch {
      toast.error("Downloader unreachable. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        Universal <span className="text-gradient">Downloader</span>
      </h1>
      <p className="mb-8 text-muted-foreground">
        Direct downloads from 12+ platforms — powered by the David Cyril API grid.
      </p>

      <form onSubmit={submit} className="rounded-2xl border border-primary/40 bg-gradient-card p-6 shadow-card">
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link2 className="h-3.5 w-3.5" />
          {platform === "apk" ? "App name" : "Media URL"}
        </label>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={platform === "apk" ? "WhatsApp, Telegram…" : "https://youtube.com/watch?v=…"}
          className="w-full rounded-xl border border-border bg-muted/60 px-4 py-3 text-sm outline-none focus:border-primary focus:shadow-glow"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {PLATFORMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPlatform(id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
                platform === id
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border bg-muted/40 hover:border-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {loading ? "Fetching…" : "Get Download"}
        </button>
      </form>

      {result && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-primary bg-gradient-card shadow-glow">
          <div className="flex flex-col gap-4 p-5 sm:flex-row">
            {result.thumbnail && (
              <img src={result.thumbnail} alt={result.title} className="aspect-video w-full rounded-xl object-cover sm:w-56" />
            )}
            <div className="flex flex-1 flex-col">
              <h3 className="font-display text-lg font-bold">{result.title}</h3>
              {result.meta && <p className="mt-1 text-xs text-muted-foreground">{result.meta}</p>}
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <a
                  href={result.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  <Download className="h-4 w-4" /> Download Now
                </a>
                <a
                  href={result.downloadUrl}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs hover:border-primary"
                  target="_blank" rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-8 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
        ⚖ Only download content you have the rights to. Respect each platform's Terms of Service.
      </p>
    </section>
  );
};

/** Normalise the very inconsistent David Cyril response shapes. */
function parseResult(p: Platform, res: any): ResultCard | null {
  if (!res) return null;
  const r = res.result || res.data || res.response || res;

  // pick first plausible URL field
  const url: string | undefined =
    r?.download_url || r?.downloadUrl || r?.url || r?.video || r?.audio ||
    r?.DownloadLink || r?.download || r?.video_hd || r?.video_sd ||
    res?.DownloadLink || res?.downloadUrl || res?.download || res?.url ||
    (Array.isArray(r?.medias) && r.medias[0]?.url);

  return {
    title: r?.title || res?.title || res?.channel || `${p.toUpperCase()} download`,
    thumbnail: r?.thumbnail || r?.thumb || r?.image || r?.cover || res?.thumbnail,
    downloadUrl: url || "",
    meta: [r?.quality, r?.format, r?.duration, res?.channel].filter(Boolean).join(" • "),
  };
}