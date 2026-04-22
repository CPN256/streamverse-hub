import { useEffect, useState } from "react";
import type { Show } from "@/lib/tvmaze";

const KEY = "cpn_favorites_v1";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Show[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggle = (show: Show) => {
    setFavorites((prev) =>
      prev.find((p) => p.id === show.id)
        ? prev.filter((p) => p.id !== show.id)
        : [show, ...prev]
    );
  };

  const isFav = (id: number) => favorites.some((f) => f.id === id);

  return { favorites, toggle, isFav };
}