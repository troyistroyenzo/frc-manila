"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Photo } from "@/lib/gallery";

gsap.registerPlugin(ScrollTrigger);

const Lightbox = dynamic(() => import("./Lightbox"), { ssr: false });

interface GalleryProps {
  photos: Photo[];
}

export default function Gallery({ photos }: GalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (photos.length === 0) return;

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
  }, [photos]);

  if (photos.length === 0) return null;

  const [main, ...rest] = photos;
  const side = rest.slice(0, 4);
  const gridPhotos = rest.slice(4);

  const openLightbox = (url: string) => setLightbox(url);

  return (
    <section ref={sectionRef} className="bg-black pt-16 pb-24 md:pt-24 md:pb-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          {main && (
            <div
              className="highlight-item md:col-span-7 relative overflow-hidden bg-white/5 cursor-pointer group"
              style={{ opacity: 0, aspectRatio: "3/2" }}
              onClick={() => openLightbox(main.url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(main.url); }}
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

          {side.length > 0 && (
            <div className="md:col-span-5 grid grid-cols-2 gap-1">
              {side.map((photo) => (
                <div
                  key={photo.name}
                  className="highlight-item relative overflow-hidden bg-white/5 cursor-pointer group aspect-[3/2]"
                  style={{ opacity: 0 }}
                  onClick={() => openLightbox(photo.url)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(photo.url); }}
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

        {gridPhotos.length > 0 && (
          <div ref={gridRef} className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-1">
            {gridPhotos.map((photo) => (
              <div
                key={photo.name}
                className="grid-item relative overflow-hidden bg-white/5 cursor-pointer group aspect-[3/2]"
                style={{ opacity: 0 }}
                onClick={() => openLightbox(photo.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openLightbox(photo.url); }}
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

      {lightbox !== null && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}
