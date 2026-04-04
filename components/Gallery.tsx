"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface Photo {
  name: string;
  url: string;
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery?all=true")
      .then((r) => r.json())
      .then(({ photos: data }: { photos: Photo[] }) => {
        setPhotos(data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || photos.length === 0) return;

    gsap.fromTo(
      ".highlight-item",
      { opacity: 0, scale: 0.97 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );

    if (gridRef.current) {
      gsap.fromTo(
        ".grid-item",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [loading, photos]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <section className="bg-black pt-16 pb-24 md:pt-24 md:pb-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-1 h-[500px] md:h-[640px]">
            <div className="col-span-12 md:col-span-7 bg-white/5 animate-pulse" />
            <div className="col-span-6 md:col-span-5 grid grid-rows-2 gap-1">
              <div className="bg-white/5 animate-pulse" />
              <div className="bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) return null;

  const [main, ...rest] = photos;
  const side = rest.slice(0, 4);
  const gridPhotos = rest.slice(4); // everything after the editorial 5

  return (
    <section ref={sectionRef} className="bg-black pt-16 pb-24 md:pt-24 md:pb-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Editorial highlight layout:
            Left: 1 large photo (7/12 cols)
            Right: 2×2 grid (5/12 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">

          {/* Large featured photo */}
          {main && (
            <div
              className="highlight-item md:col-span-7 relative overflow-hidden bg-white/5 cursor-pointer group"
              style={{ opacity: 0, aspectRatio: "3/2" }}
              onClick={() => setLightbox(main.url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={main.url}
                alt={main.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          )}

          {/* 2×2 side grid */}
          {side.length > 0 && (
            <div className="md:col-span-5 grid grid-cols-2 gap-1">
              {side.map((photo) => (
                <div
                  key={photo.name}
                  className="highlight-item relative overflow-hidden bg-white/5 cursor-pointer group aspect-[3/2]"
                  style={{ opacity: 0 }}
                  onClick={() => setLightbox(photo.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full photo grid — remaining photos */}
        {gridPhotos.length > 0 && (
          <div ref={gridRef} className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-1">
            {gridPhotos.map((photo) => (
              <div
                key={photo.name}
                className="grid-item relative overflow-hidden bg-white/5 cursor-pointer group aspect-[3/2]"
                style={{ opacity: 0 }}
                onClick={() => setLightbox(photo.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="https://instagram.com/frcmanila"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-white/20 text-white/60 hover:text-white hover:border-white/50
                       px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
          >
            <span>See More on Instagram</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt="Gallery photo"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              className="absolute -top-10 right-0 text-white/40 hover:text-white text-sm uppercase tracking-widest transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              onClick={() => setLightbox(null)}
            >
              Close ×
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
