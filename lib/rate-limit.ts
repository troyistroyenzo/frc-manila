type WindowEntry = {
  timestamps: number[];
};

type RateLimiter = {
  check: (request: Request) => { success: boolean; remaining: number };
};

export function rateLimit(opts: { windowMs: number; max: number }): RateLimiter {
  const store = new Map<string, WindowEntry>();

  // Purge stale entries every 60s to prevent memory leak
  const timer = setInterval(() => {
    const cutoff = Date.now() - opts.windowMs;
    for (const [key, entry] of store.entries()) {
      const fresh = entry.timestamps.filter((t) => t > cutoff);
      if (fresh.length === 0) {
        store.delete(key);
      } else {
        entry.timestamps = fresh;
      }
    }
  }, 60_000);

  // Don't block Node.js process exit
  if (typeof timer === "object" && "unref" in timer) timer.unref();

  return {
    check(request: Request) {
      const ip =
        request.headers.get("x-real-ip") ??
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        "unknown";

      const now = Date.now();
      const cutoff = now - opts.windowMs;

      const entry = store.get(ip) ?? { timestamps: [] };
      entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
      entry.timestamps.push(now);
      store.set(ip, entry);

      const count = entry.timestamps.length;
      return { success: count <= opts.max, remaining: Math.max(0, opts.max - count) };
    },
  };
}

// 60 requests/min for reads, 5 requests/min for writes
export const galleryLimiter = rateLimit({ windowMs: 60_000, max: 60 });
export const postLimiter = rateLimit({ windowMs: 60_000, max: 5 });
