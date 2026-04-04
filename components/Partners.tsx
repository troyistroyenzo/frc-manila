"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const brandPartners = [
  { name: "Single Origin", descriptor: "Coffee Partner", logo: "/logos/single-origin.png" },
  { name: "The Westin Manila", descriptor: "Hospitality Partner", logo: "/logos/the-westin-manila.svg" },
  { name: "Kultura Filipino", descriptor: "Brand Partner", logo: "/logos/kultura-filipino.svg" },
];

const communityPartners = [
  { name: "startup.ph", descriptor: "50K+ Members", logo: "/logos/startup-ph.svg" },
  { name: "Kaskasan Buddies", descriptor: "1M+ Members", logo: "/logos/kaskasan-buddies.svg" },
  { name: "FHMoms", descriptor: "500K+ Members", logo: "/logos/fhmoms.svg" },
];

function LogoCard({ name, descriptor, logo }: { name: string; descriptor: string; logo: string }) {
  return (
    <div className="flex-shrink-0 mx-8 md:mx-12 group cursor-default">
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-32 h-12 md:w-48 md:h-16 flex items-center justify-center
                     group-hover:opacity-100 transition-opacity duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={name}
            className="h-8 md:h-12 w-auto object-contain brightness-0 invert opacity-60 group-hover:opacity-90 transition-opacity duration-300"
          />
        </div>
        <span
          className="text-white/20 text-xs uppercase tracking-widest"
          style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
        >
          {descriptor}
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({ partners, direction = 1 }: { partners: typeof brandPartners; direction?: number }) {
  const doubled = [...partners, ...partners, ...partners, ...partners];

  return (
    <div className="overflow-hidden">
      <div
        className="flex items-center py-6"
        style={{
          animation: `marquee ${direction > 0 ? "25s" : "30s"} linear infinite ${direction < 0 ? "reverse" : ""}`,
          width: "max-content",
        }}
      >
        {doubled.map((p, i) => (
          <LogoCard key={i} name={p.name} descriptor={p.descriptor} logo={p.logo} />
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      ".partners-header",
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
      ".partners-label",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-24 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <div className="partners-header" style={{ opacity: 0 }}>
          <p
            className="text-white/30 uppercase text-sm tracking-widest mb-4"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            Our Partners
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
            BUILT WITH THE BEST
          </h2>
        </div>
      </div>

      {/* Brand Partners Marquee */}
      <div className="mb-2">
        <p
          className="partners-label text-white/20 uppercase text-xs tracking-widest px-6 md:px-12 mb-4"
          style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em", opacity: 0 }}
        >
          Brand Partners
        </p>
        <MarqueeRow partners={brandPartners} direction={1} />
      </div>

      {/* Community Partners Marquee */}
      <div>
        <p
          className="partners-label text-white/20 uppercase text-xs tracking-widest px-6 md:px-12 mb-4"
          style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em", opacity: 0 }}
        >
          Community Partners
        </p>
        <MarqueeRow partners={communityPartners} direction={-1} />
      </div>
    </section>
  );
}
