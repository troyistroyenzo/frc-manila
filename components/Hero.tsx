"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Fetch fresh signed video URL from server-side cached route
  useEffect(() => {
    fetch("/api/video-url")
      .then((r) => r.json())
      .then(({ url }) => { if (url) setVideoUrl(url); })
      .catch(() => {}); // silent fail — video is decorative
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      line1Ref.current,
      { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
      { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 1, ease: "power3.out" }
    )
      .fromTo(
        line2Ref.current,
        { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        line3Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.3"
      )
      .fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Video — URL fetched server-side, auto-refreshed every 6h */}
      {videoUrl && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <div
          ref={line1Ref}
          className="overflow-hidden"
          style={{ opacity: 0 }}
        >
          <h1
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(4rem, 15vw, 14rem)",
              lineHeight: 0.82,
              letterSpacing: "0.04em",
            }}
          >
            FRC
          </h1>
        </div>

        <div
          ref={line2Ref}
          className="overflow-hidden"
          style={{ opacity: 0 }}
        >
          <h1
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(4rem, 15vw, 14rem)",
              lineHeight: 0.82,
              letterSpacing: "0.04em",
            }}
          >
            MANILA
          </h1>
        </div>

        <div
          ref={line3Ref}
          className="mt-8"
          style={{ opacity: 0 }}
        >
          <p
            className="text-white/60 uppercase tracking-widest text-sm md:text-base"
            style={{
              fontFamily: "Barlow Condensed, sans-serif",
              letterSpacing: "0.3em",
            }}
          >
            A Movement for Movement · Est. 2025
          </p>
        </div>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <a
            href="https://chat.whatsapp.com/JGoiuAqL7xg5RsLps8j5Ul"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-3 bg-white text-black hover:bg-white/90 transition-colors duration-300"
          >
            <WhatsAppIcon />
            <span
              className="uppercase text-sm font-semibold"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              FRC Chat
            </span>
          </a>

          <a
            href="https://t.me/frcmanila"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-7 py-3 border border-white/40 text-white hover:border-white hover:bg-white/5 transition-colors duration-300"
          >
            <TelegramIcon />
            <span
              className="uppercase text-sm"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              FRC Burn
            </span>
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span
          className="text-white/40 text-xs uppercase tracking-widest"
          style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.25em" }}
        >
          Scroll
        </span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div
            className="absolute top-0 w-full bg-white/60"
            style={{
              height: "40%",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
