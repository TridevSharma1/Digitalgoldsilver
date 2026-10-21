/**
 * Tiny localStorage-backed store. Every collection starts from mock JSON
 * and is persisted under "dgs:<key>" so the admin panel can edit everything.
 */
import { useEffect, useState, useCallback } from "react";
import { defaults, type Defaults } from "@/mock";

type Key = keyof Defaults;
const listeners = new Map<Key, Set<() => void>>();

export function read<K extends Key>(key: K): Defaults[K] {
  if (typeof window === "undefined") return defaults[key];
  try {
    const raw = localStorage.getItem("dgs:" + key);
    return raw ? JSON.parse(raw) : defaults[key];
  } catch {
    return defaults[key];
  }
}

export function write<K extends Key>(key: K, value: Defaults[K]) {
  localStorage.setItem("dgs:" + key, JSON.stringify(value));
  listeners.get(key)?.forEach((l) => l());
}

export function useStore<K extends Key>(key: K) {
  const [value, setValue] = useState<Defaults[K]>(defaults[key]);
  useEffect(() => {
    const sync = () => setValue(read(key));
    sync();
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(sync);
    return () => void listeners.get(key)!.delete(sync);
  }, [key]);
  const set = useCallback(
    (v: Defaults[K] | ((prev: Defaults[K]) => Defaults[K])) => {
      const next = typeof v === "function" ? (v as (p: Defaults[K]) => Defaults[K])(read(key)) : v;
      write(key, next);
    },
    [key],
  );
  return [value, set] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const GST = 0.03;
