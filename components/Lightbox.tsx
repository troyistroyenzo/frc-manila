"use client";

import { useEffect, useRef } from "react";

interface LightboxProps {
  src: string;
  onClose: () => void;
}

export default function Lightbox({ src, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Gallery photo"
          className="max-w-[90vw] max-h-[90vh] object-contain"
        />
        <button
          ref={closeRef}
          className="absolute -top-10 right-0 text-white/40 hover:text-white text-sm uppercase tracking-widest transition-colors"
          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          onClick={onClose}
        >
          Close ×
        </button>
      </div>
    </div>
  );
}
