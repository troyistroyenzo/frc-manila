"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Photo {
  name: string;
  url: string;
}

export default function PhotoStrip() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    async function fetchPhotos() {
      const { data: files, error } = await supabase.storage
        .from("photos")
        .list("", { limit: 10, sortBy: { column: "name", order: "asc" } });

      if (error || !files) return;

      const imageFiles = files.filter((f) =>
        /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name)
      );

      if (imageFiles.length === 0) return;

      const paths = imageFiles.map((f) => f.name);
      const { data: signed, error: signError } = await supabase.storage
        .from("photos")
        .createSignedUrls(paths, 3600);

      if (signError || !signed) return;

      const photoList: Photo[] = signed
        .filter((s) => s.signedUrl && s.path)
        .map((s) => ({ name: s.path ?? s.signedUrl, url: s.signedUrl }));

      setPhotos(photoList);
    }

    fetchPhotos();
  }, []);

  if (photos.length === 0) return null;

  // Duplicate for seamless loop
  const doubled = [...photos, ...photos];

  return (
    <div className="bg-black w-full overflow-hidden" style={{ height: "300px" }}>
      <div className="photo-strip-track flex h-full">
        {doubled.map((photo, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={`${photo.name}-${i}`}
            src={photo.url}
            alt=""
            aria-hidden="true"
            className="h-full w-auto flex-shrink-0 object-cover"
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
