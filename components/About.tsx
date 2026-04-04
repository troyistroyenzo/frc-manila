"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Photo } from "@/lib/gallery";

gsap.registerPlugin(ScrollTrigger);

// Statement 01 — explicit photos (grid)
const STMT01_KEYS = [
  "photos/042625 Founders Runners Club Run 027",
  "photos/042625 Founders Runners Club Run 043",
  "photos/042625 Founders Runners Club Run 113",
  "photos/042625 Founders Runners Club Run 128",
  "photos/042625 Founders Runners Club Run 152",
];

const statements = [
  {
    number: "01",
    headline: "WE BRING TOGETHER FOUNDERS, INVESTORS, OPERATORS AND CREATORS",
    body: "FRC Manila is a chapter of the global Founders Running Club network — where the world's most ambitious builders lace up together.",
  },
  {
    number: "02",
    headline: "A MOVEMENT FOR MOVEMENT",
    body: "Built for high-value, high-achieving individuals who move with purpose. Every Saturday at 6AM, we run the city.",
  },
  {
    number: "03",
    headline: "COMMUNITY FIRST. ALWAYS.",
    body: "From startup founders to creative directors — our community spans industries, backgrounds, and ambitions. One pace group or two, we run as one.",
  },
];

interface AboutProps {
  photos: Photo[];
}

export default function About({ photos }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Derive photo selections from props
  const matched01 = STMT01_KEYS
    .map((key) => photos.find((p) => p.name.includes(key.replace("photos/", ""))))
    .filter(Boolean) as Photo[];

  const usedInStmt01 = new Set(matched01.map((p) => p.name));
  const remaining = photos.filter((p) => !usedInStmt01.has(p.name));
  const photo02Url = remaining[0]?.url ?? null;
  const photo03 = remaining[1] ?? null;

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);

    items.forEach((item) => {
      if (!item) return;

      const headline = item.querySelector(".about-headline");
      const body = item.querySelector(".about-body");
      const number = item.querySelector(".about-number");

      gsap.fromTo(number, { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none none" },
      });

      gsap.fromTo(headline, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: item, start: "top 75%", toggleActions: "play none none none" },
      });

      gsap.fromTo(body, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2,
        scrollTrigger: { trigger: item, start: "top 70%", toggleActions: "play none none none" },
      });

      const photoItems = item.querySelectorAll(".about-photo-item");
      if (photoItems.length > 0) {
        gsap.fromTo(photoItems, { opacity: 0, scale: 0.95 }, {
          opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: item, start: "top 70%", toggleActions: "play none none none" },
        });
      }

      const singlePhoto = item.querySelector(".about-single-photo");
      if (singlePhoto) {
        gsap.fromTo(singlePhoto, { opacity: 0, y: 20 }, {
          opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 70%", toggleActions: "play none none none" },
        });
      }
    });

    ScrollTrigger.refresh();
  }, [photos]);

  return (
    <section ref={sectionRef} className="bg-black py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Statement 01 — photos RIGHT */}
        <div
          ref={(el) => { itemRefs.current[0] = el; }}
          className="border-t border-white/10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
        >
          <div className="md:col-span-1">
            <span className="about-number text-white/20 text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}>
              {statements[0].number}
            </span>
          </div>
          <div className={matched01.length > 0 ? "md:col-span-6 space-y-6" : "md:col-span-11 space-y-6"}>
            <h2 className="about-headline text-white uppercase" style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif", fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.85, letterSpacing: "0.03em" }}>
              {statements[0].headline}
            </h2>
            <p className="about-body text-white/50 max-w-2xl text-lg md:text-xl" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.01em", lineHeight: 1.4 }}>
              {statements[0].body}
            </p>
          </div>
          {matched01.length > 0 && (
            <div className="md:col-span-5 grid grid-cols-2 gap-1">
              {matched01.map((photo) => (
                <div key={photo.name} className="about-photo-item relative aspect-[3/2] overflow-hidden bg-white/5" style={{ opacity: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statement 02 — photo LEFT */}
        <div
          ref={(el) => { itemRefs.current[1] = el; }}
          className="border-t border-white/10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
        >
          <div className="md:col-span-1">
            <span className="about-number text-white/20 text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}>
              {statements[1].number}
            </span>
          </div>
          {photo02Url && (
            <div className="about-single-photo md:col-span-4 relative aspect-[3/4] overflow-hidden bg-white/5 order-first md:order-none" style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo02Url} alt="A movement for movement" className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          )}
          <div className={photo02Url ? "md:col-span-7 space-y-6" : "md:col-span-11 space-y-6"}>
            <h2 className="about-headline text-white uppercase" style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif", fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.85, letterSpacing: "0.03em" }}>
              {statements[1].headline}
            </h2>
            <p className="about-body text-white/50 max-w-2xl text-lg md:text-xl" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.01em", lineHeight: 1.4 }}>
              {statements[1].body}
            </p>
          </div>
        </div>

        {/* Statement 03 — photo RIGHT */}
        <div
          ref={(el) => { itemRefs.current[2] = el; }}
          className="border-t border-white/10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
        >
          <div className="md:col-span-1">
            <span className="about-number text-white/20 text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}>
              {statements[2].number}
            </span>
          </div>
          <div className={photo03 ? "md:col-span-6 space-y-6" : "md:col-span-11 space-y-6"}>
            <h2 className="about-headline text-white uppercase" style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif", fontSize: "clamp(2.5rem, 6vw, 7rem)", lineHeight: 0.85, letterSpacing: "0.03em" }}>
              {statements[2].headline}
            </h2>
            <p className="about-body text-white/50 max-w-2xl text-lg md:text-xl" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.01em", lineHeight: 1.4 }}>
              {statements[2].body}
            </p>
          </div>
          {photo03 && (
            <div className="about-single-photo md:col-span-5 relative aspect-[4/3] overflow-hidden bg-white/5" style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo03.url} alt={photo03.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
