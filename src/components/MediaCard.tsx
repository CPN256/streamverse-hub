import { Heart, Play, Info } from "lucide-react";
import type { Show } from "@/lib/tvmaze";
import { cn } from "@/lib/utils";

interface Props {
  show: Show;
  isFav: boolean;
  onToggleFav: (s: Show) => void;
  onOpen: (s: Show) => void;
}

export const MediaCard = ({ show, isFav, onToggleFav, onOpen }: Props) => {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-smooth hover:-translate-y-2 hover:border-primary hover:shadow-glow animate-float-up"
      style={{ transition: "var(--transition-smooth)" }}
    >
      <button
        aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav(show);
        }}
        className={cn(
          "absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/70 backdrop-blur-md transition-smooth hover:scale-110",
          isFav && "text-primary"
        )}
      >
        <Heart className={cn("h-5 w-5", isFav && "fill-primary")} />
      </button>

      {show.rating && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-background/80 px-3 py-1 text-xs font-bold text-secondary backdrop-blur-md">
          ★ {show.rating.toFixed(1)}
        </div>
      )}

      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={show.image}
          alt={`${show.name} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-base font-bold leading-tight tracking-wide text-foreground line-clamp-2">
          {show.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {show.year} • {show.network}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {show.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded-full border border-secondary/40 bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={() => onOpen(show)}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
          >
            <Play className="h-3 w-3 fill-current" /> Stream
          </button>
          <button
            onClick={() => onOpen(show)}
            className="flex items-center justify-center rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-md hover:border-primary"
          >
            <Info className="h-3 w-3" />
          </button>
        </div>
      </div>
    </article>
  );
};