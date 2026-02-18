"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function InstagramDMIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function JoinCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-divider",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8, ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        ".collab-block",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-16">

        {/* Divider */}
        <div
          className="cta-divider w-full h-px bg-white/10 origin-left"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Collaboration block */}
        <div className="collab-block flex flex-col items-center gap-6 text-center max-w-xl" style={{ opacity: 0 }}>
          <span
            className="text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            Collaborate
          </span>

          <p
            className="text-white/60 text-base leading-relaxed"
            style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "1.1rem" }}
          >
            We encourage new collaborators to join at least 1–2 runs to get a real feel of the community — because the best partnerships start from genuine connection. We value long-term, intentional relationships with brands who want to grow with us.
          </p>

          <a
            href="https://ig.me/m/frcmanila"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group mt-2"
          >
            <InstagramDMIcon />
            <span
              className="uppercase text-sm tracking-widest group-hover:text-white transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              Message us on Instagram
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
