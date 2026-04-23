import { useEffect, useState } from "react";

export interface ApiEntry { id: string; name: string; value: string }

const KEY = "cpn-api-keys-v1";

export const useApiKeys = () => {
  const [keys, setKeys] = useState<ApiEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setKeys(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = (next: ApiEntry[]) => {
    setKeys(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = (name: string, value: string) => {
    if (!name.trim() || !value.trim()) return;
    persist([...keys, { id: crypto.randomUUID(), name: name.trim(), value: value.trim() }]);
  };

  const remove = (id: string) => persist(keys.filter((k) => k.id !== id));

  const get = (name: string) => keys.find((k) => k.name.toLowerCase() === name.toLowerCase())?.value;

  return { keys, add, remove, get };
};