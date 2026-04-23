import { useEffect, useState } from "react";
import { Film, Search, Loader2, Download, ExternalLink, Calendar, Star } from "lucide-react";
import { toast } from "sonner";
import { fzmovies, type FzMovie } from "@/lib/davidcyril";

const pickImg = (m: FzMovie) => m.image || m.thumbnail || m.cover || "";
const pickLink = (m: FzMovie) => m.url || m.link || m.download_url || "";

export const MoviesHub = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<FzMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FzMovie | null>(null);
  const [detail, setDetail] = useState<FzMovie | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadLatest = async () => {
    setLoading(true);
    try {
      const r = await fzmovies.latest();
      setItems(r.results || []);
    } catch {
      toast.error("Could not reach FZMovies grid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLatest(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return loadLatest();
    setLoading(true);
    try {
      const r = await fzmovies.search(query.trim());
      setItems(r.results || []);
      if (!r.results?.length) toast.info("No movies match that title.");
    } catch {
      toast.error("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (m: FzMovie) => {
    setSelected(m);
    setDetail(null);
    const link = pickLink(m);
    if (!link) return;
    setDetailLoading(true);
    try {
      const r: any = await fzmovies.info(link);
      setDetail(r.result || r);
    } catch {
      toast.error("Could not load movie info.");
    } finally {
      setDetailLoading(false);
    }
  };

  const grabDownload = async (m: FzMovie) => {
    const link = pickLink(m);
    if (!link) return toast.error("No source link.");
    toast.loading("Fetching direct download…", { id: "fz-dl" });
    try {
      const r: any = await fzmovies.download(link);
      const dlUrl = r?.result?.download_url || r?.result?.url || r?.download_url || r?.url;
      toast.dismiss("fz-dl");
      if (!dlUrl) return toast.error("No download link returned.");
      window.open(dlUrl, "_blank", "noopener,noreferrer");
      toast.success("Download opened in a new tab.");
    } catch {
      toast.dismiss("fz-dl");
      toast.error("Download fetch failed.");
    }
  };

  return (
    <section className="animate-float-up">
      <h1 className="mb-2 font-display text-4xl font-black tracking-wide">
        FZ <span className="text-gradient">Movies</span>
      </h1>
      <p className="mb-6 text-muted-foreground">
        Search & download full movies via the FZMovies grid.
      </p>

      <form onSubmit={submit} className="mb-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies… (leave empty for latest)"
            className="w-full rounded-full border border-border bg-muted/60 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary focus:shadow-glow"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m, i) => {
            const img = pickImg(m);
            return (
              <button
                key={(m.id || pickLink(m) || m.title) + i}
                onClick={() => openDetail(m)}
                className="group overflow-hidden rounded-2xl border border-border bg-gradient-card text-left shadow-card transition-smooth hover:-translate-y-1 hover:border-primary hover:shadow-glow"
              >
                <div className="aspect-[2/3] overflow-hidden bg-muted">
                  {img ? (
                    <img
                      src={img}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Film className="h-10 w-10 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold">{m.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    {m.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{m.year}</span>}
                    {m.quality && <span>{m.quality}</span>}
                    {m.size && <span>{m.size}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/50 bg-gradient-card p-6 shadow-glow scrollbar-cyber"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              {pickImg(selected) && (
                <img src={pickImg(selected)} alt={selected.title} className="aspect-[2/3] w-full rounded-xl object-cover sm:w-48" />
              )}
              <div className="flex-1">
                <h2 className="font-display text-2xl font-black">{selected.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  {selected.year && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{selected.year}</span>}
                  {(detail?.rating ?? selected.rating) && (
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-secondary" />{detail?.rating ?? selected.rating}</span>
                  )}
                  {(detail?.genre ?? selected.genre) && <span>{detail?.genre ?? selected.genre}</span>}
                  {(detail?.quality ?? selected.quality) && <span>{detail?.quality ?? selected.quality}</span>}
                  {(detail?.size ?? selected.size) && <span>{detail?.size ?? selected.size}</span>}
                </div>
                {detailLoading && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Loading details…
                  </p>
                )}
                {(detail?.description || selected.description) && (
                  <p className="mt-4 text-sm text-muted-foreground">{detail?.description || selected.description}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => grabDownload(selected)}
                    className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
                  >
                    <Download className="h-4 w-4" /> Get Download Link
                  </button>
                  {pickLink(selected) && (
                    <a
                      href={pickLink(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-4 py-2 text-xs hover:border-primary"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Source page
                    </a>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-full border border-border bg-muted/40 px-4 py-2 text-xs hover:border-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
