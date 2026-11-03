import { AnalysisResult } from "@/types";

const memoryCache = new Map<string, string>();

/**
 * Hash string sederhana untuk kunci cache deterministik di browser.
 */
export function generateCacheKey(
  anonymizedChat: string,
  serviceMode: string,
  catalogVersion: string = "v1",
  promptVersion: string = "v1"
): string {
  const raw = `${anonymizedChat.trim()}___${serviceMode}___${catalogVersion}___${promptVersion}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `karyaflow_cache_${Math.abs(hash)}`;
}

export function getCachedAnalysis(key: string): AnalysisResult | null {
  try {
    const serialized =
      typeof window !== "undefined"
        ? window.localStorage.getItem(key)
        : memoryCache.get(key);

    if (!serialized) return null;
    return JSON.parse(serialized) as AnalysisResult;
  } catch (err) {
    console.warn("Gagal membaca cache:", err);
    const inMem = memoryCache.get(key);
    return inMem ? JSON.parse(inMem) : null;
  }
}

export function setCachedAnalysis(key: string, result: AnalysisResult): void {
  const serialized = JSON.stringify(result);
  memoryCache.set(key, serialized);
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, serialized);
    }
  } catch (err) {
    console.warn("Gagal menyimpan cache ke localStorage:", err);
  }
}

export function clearAllLocalData(): void {
  memoryCache.clear();
  try {
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith("karyaflow_")) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn("Gagal menghapus data lokal:", err);
  }
}

