"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{ fontFamily: "Barlow Condensed, sans-serif" }}
      className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6 text-center"
    >
      <h1
        className="text-6xl md:text-8xl mb-4 tracking-widest"
        style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif" }}
      >
        ERROR
      </h1>
      <p className="text-white/60 text-lg mb-8 uppercase tracking-widest">
        Something went wrong.
      </p>
      <button
        onClick={reset}
        className="border border-white/30 text-white px-8 py-3 uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-200"
      >
        Try Again
      </button>
    </main>
  );
}
