"use client";

import { useEffect, useState } from "react";

interface Photo {
  name: string;
  url: string;
}

export default function PhotoStrip() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // Reuse the same server-cached route Gallery uses — no extra Supabase round-trip
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(({ photos: data }: { photos: Photo[] }) => {
        setPhotos((data ?? []).slice(0, 10));
      })
      .catch(() => {});
  }, []);

  if (photos.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...photos, ...photos];

  return (
    <div className="bg-black w-full overflow-hidden" style={{ height: "300px" }}>
      <div className="photo-strip-track flex h-full">
        {doubled.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${photo.name}-${i}`}
            src={photo.url}
            alt=""
            aria-hidden="true"
            className="h-full w-auto flex-shrink-0 object-cover"
            decoding="async"
            loading="lazy"
          />
        ))}
      </div>

      <style>{`
        .photo-strip-track {
          animation: stripScroll 30s linear infinite;
          width: max-content;
        }
        @keyframes stripScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .photo-strip-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
