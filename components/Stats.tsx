"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Photo {
  name: string;
  url: string;
}

const stats = [
  { value: 2000, suffix: "+", label: "Cumulative Runners" },
  { value: 72, suffix: "+", label: "Runs Hosted" },
  { value: 20, suffix: "+", label: "Major Events" },
  { value: null, suffix: "", label: "Weekly Runs", display: "Every\nWeekend" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const indexRef = useRef(0);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(({ photos: data }: { photos: Photo[] }) => {
        setPhotos((data ?? []).slice(0, 10));
      })
      .catch(() => {});
  }, []);

  const advancePhoto = useCallback(() => {
    if (photos.length < 2 || !imgRef.current) return;
    const next = (indexRef.current + 1) % photos.length;
    const nextUrl = photos[next].url;

    const preload = new Image();
    preload.src = nextUrl;
    preload.onload = () => {
      const el = imgRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          el.src = nextUrl;
          gsap.fromTo(el, { scale: 1 }, { scale: 1.05, duration: 5, ease: "none" });
          gsap.to(el, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
        },
      });
    };
    indexRef.current = next;
  }, [photos]);

  useEffect(() => {
    if (photos.length === 0) return;
    const interval = setInterval(advancePhoto, 5000);
    return () => clearInterval(interval);
  }, [photos, advancePhoto]);

  useEffect(() => {
    stats.forEach((stat, i) => {
      const el = counterRefs.current[i];
      if (!el || stat.value === null) return;

      const target = stat.value;
      const suffix = stat.suffix;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
        onUpdate() {
          el.textContent = Math.round(obj.val) + suffix;
        },
      });
    });

    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#111111] py-24 md:py-40 overflow-hidden"
    >
      {/* Background carousel */}
      {photos.length > 0 && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={photos[0]?.url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <p
          className="text-white/30 uppercase text-sm tracking-widest mb-16"
          style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
        >
          By the Numbers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card bg-[#111111]/80 backdrop-blur-sm p-8 md:p-12 flex flex-col justify-between"
              style={{ opacity: 0 }}
            >
              <div
                className="text-white mb-4"
                style={{
                  fontFamily: "var(--font-koulen), Koulen, sans-serif",
                  fontSize: stat.value !== null
                    ? "clamp(3rem, 8vw, 7rem)"
                    : "clamp(1.6rem, 4vw, 3.5rem)",
                  lineHeight: 0.9,
                  letterSpacing: "0.02em",
                  whiteSpace: "pre-line",
                }}
              >
                {stat.value !== null ? (
                  <span ref={(el) => { counterRefs.current[i] = el; }}>
                    0{stat.suffix}
                  </span>
                ) : (
                  stat.display
                )}
              </div>

              <p
                className="text-white/40 text-sm uppercase tracking-wider mt-4"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  letterSpacing: "0.12em",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
