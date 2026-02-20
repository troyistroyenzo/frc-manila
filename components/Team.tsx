"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MEMBERS = [
  { key: "aileen", display: "Aileen", bio: "" },
  { key: "chris",  display: "Chris",  bio: "Anxiously building communities for organic encounters." },
  { key: "mark",   display: "Mark",   bio: "" },
  { key: "nicki",  display: "Nicki",  bio: "" },
  { key: "taty",   display: "Taty",   bio: "Connecting, protecting, and educating people. Loves numbers, walking, and coffee." },
  { key: "troy",   display: "Troy",   bio: "Hyrox athlete and AI bot framer." },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  // stem → signed URL, populated asynchronously
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  // Fetch photos in the background — cards are always rendered regardless
  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then(({ members }: { members: { name: string; url: string }[] }) => {
        const map: Record<string, string> = {};
        for (const m of members ?? []) {
          const stem = m.name.replace(/\.[^.]+$/, "").toLowerCase();
          map[stem] = m.url;
        }
        setPhotoUrls(map);
      })
      .catch(() => {});
  }, []);

  // GSAP runs on mount — section is always visible
  useEffect(() => {
    gsap.fromTo(
      ".team-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".team-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ".team-grid",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#111111] py-24 md:py-40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="team-header mb-16 md:mb-24" style={{ opacity: 0 }}>
          <p
            className="text-white/30 uppercase text-sm tracking-widest mb-4"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            The People
          </p>
          <h2
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 0.85,
              letterSpacing: "0.03em",
            }}
          >
            HALL OF FAME
          </h2>
        </div>

        {/* Grid — always rendered from static data */}
        <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {MEMBERS.map((member) => {
            const photoUrl = photoUrls[member.key];
            return (
              <div
                key={member.key}
                className="team-card bg-[#111111] group cursor-default overflow-hidden"
                style={{ opacity: 0 }}
              >
                {/* Photo */}
                <div className="w-full aspect-square bg-white/5 relative overflow-hidden">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={member.display}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-6 md:p-8">
                  <h3
                    className="text-white uppercase"
                    style={{
                      fontFamily: "var(--font-koulen), Koulen, sans-serif",
                      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                      lineHeight: 0.9,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {member.display}
                  </h3>
                  {member.bio && (
                    <p
                      className="text-white/40 text-sm leading-relaxed mt-2"
                      style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                    >
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
