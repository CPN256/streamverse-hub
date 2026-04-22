import { X, Play, Download, ExternalLink, Heart } from "lucide-react";
import type { Show } from "@/lib/tvmaze";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  show: Show | null;
  onClose: () => void;
  isFav: boolean;
  onToggleFav: (s: Show) => void;
}

export const DetailModal = ({ show, onClose, isFav, onToggleFav }: Props) => {
  if (!show) return null;

  const streamUrl = show.officialSite || show.url;
  const imdbUrl = show.imdbId ? `https://www.imdb.com/title/${show.imdbId}` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur-xl animate-float-up"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-primary bg-gradient-card shadow-glow scrollbar-cyber"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md transition-smooth hover:bg-primary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative h-64 w-full overflow-hidden md:h-80">
          <img src={show.image} alt={show.name} className="h-full w-full object-cover blur-sm opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative -mt-32 grid gap-6 p-6 md:grid-cols-[180px_1fr]">
          <img
            src={show.image}
            alt={show.name}
            className="hidden aspect-[2/3] w-full rounded-2xl object-cover shadow-card md:block"
          />
          <div>
            <h2 className="font-display text-3xl font-black tracking-wide text-gradient">
              {show.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{show.year}</span>
              <span>•</span>
              <span>{show.network}</span>
              <span>•</span>
              <span>{show.language}</span>
              {show.rating && (
                <>
                  <span>•</span>
                  <span className="font-bold text-secondary">★ {show.rating.toFixed(1)}</span>
                </>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {show.genres.map((g) => (
                <span key={g} className="rounded-full border border-secondary/40 bg-secondary/10 px-2.5 py-0.5 text-xs text-secondary">
                  {g}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {show.summary || "No synopsis available for this title."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={streamUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-105"
              >
                <Play className="h-4 w-4 fill-current" /> Stream Now
              </a>
              <button
                onClick={() => toast.info("Download links coming soon — connect a source in settings.")}
                className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-smooth hover:border-secondary"
              >
                <Download className="h-4 w-4" /> Download
              </button>
              {imdbUrl && (
                <a
                  href={imdbUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-sm font-semibold backdrop-blur-md transition-smooth hover:border-secondary"
                >
                  <ExternalLink className="h-4 w-4" /> IMDb
                </a>
              )}
              <button
                onClick={() => onToggleFav(show)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 backdrop-blur-md transition-smooth hover:border-primary",
                  isFav && "text-primary"
                )}
                aria-label="Toggle favorite"
              >
                <Heart className={cn("h-4 w-4", isFav && "fill-primary")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};