"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".footer-logo",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );

    gsap.fromTo(
      ".footer-links",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-black border-t border-white/10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-8">
        {/* Logotype */}
        <div className="footer-logo text-center" style={{ opacity: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/frc-logo-white.svg"
            alt="FRC Manila"
            className="w-auto mx-auto"
            style={{ height: "clamp(3rem, 8vw, 7rem)" }}
          />
        </div>

        {/* Links */}
        <div className="footer-links flex flex-col items-center gap-4" style={{ opacity: 0 }}>
          <a
            href="https://instagram.com/frcmanila"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
            <span
              className="uppercase text-sm tracking-widest group-hover:text-white transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              @FRCMANILA
            </span>
          </a>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10" />

          <p
            className="text-white/20 text-xs uppercase tracking-widest text-center"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
          >
            Founders Running Club Manila · Est. 2025
          </p>

          <p
            className="text-white/10 text-xs"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            A chapter of the global Founders Running Club network.
          </p>
        </div>
      </div>
    </footer>
  );
}
