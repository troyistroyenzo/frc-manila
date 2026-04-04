"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

interface Photo {
  name: string;
  url: string;
}

interface GalleryData {
  photos: Photo[];
  hasMore: boolean;
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);       // initial batch — GSAP-animated
  const [extraPhotos, setExtraPhotos] = useState<Photo[]>([]); // load-more batches
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(({ photos: data, hasMore: more }: GalleryData) => {
        setPhotos(data ?? []);
        setHasMore(more);
        if (data?.length) setLastKey(data[data.length - 1].name);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLoadMore = () => {
    if (loadingMore || !lastKey) return;
    setLoadingMore(true);
    fetch(`/api/gallery?after=${encodeURIComponent(lastKey)}`)
      .then((r) => r.json())
      .then(({ photos: data, hasMore: more }: GalleryData) => {
        setExtraPhotos((prev) => [...prev, ...(data ?? [])]);
        setHasMore(more);
        if (data?.length) setLastKey(data[data.length - 1].name);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  };

  // Trigger GSAP after initial photos load
  useEffect(() => {
    if (loading) return;

    if (photos.length > 0) {
      gsap.fromTo(
        ".gallery-item",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".masonry-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [loading, photos]);

  // Close lightbox on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  return (
    <section ref={sectionRef} className="bg-black pt-16 pb-24 md:pt-24 md:pb-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && (photos.length > 0 || extraPhotos.length > 0) && (
          <div className="masonry-grid">
            {/* Initial batch — GSAP scroll-reveal */}
            {photos.map((photo) => (
              <div
                key={photo.name}
                className="gallery-item masonry-item cursor-pointer group relative overflow-hidden aspect-[3/2] bg-white/5 shimmer"
                style={{ opacity: 0 }}
                onClick={() => setLightbox(photo.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}

            {/* Load-more batches — appear immediately */}
            {extraPhotos.map((photo) => (
              <div
                key={photo.name}
                className="masonry-item cursor-pointer group relative overflow-hidden aspect-[3/2] bg-white/5 shimmer"
                onClick={() => setLightbox(photo.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && photos.length === 0 && extraPhotos.length === 0 && (
          <p
            className="text-white/20 text-center py-16"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Photos coming soon.
          </p>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="border border-white/20 text-white/60 hover:text-white hover:border-white/50
                         px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300
                         disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              {loadingMore ? "Loading…" : "Load More"}
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
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
