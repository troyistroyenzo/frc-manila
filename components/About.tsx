"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);

    items.forEach((item) => {
      if (!item) return;

      const headline = item.querySelector(".about-headline");
      const body = item.querySelector(".about-body");
      const number = item.querySelector(".about-number");

      gsap.fromTo(
        number,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        headline,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        body,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-black py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {statements.map((s, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="border-t border-white/10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
          >
            {/* Number */}
            <div className="md:col-span-1">
              <span
                className="about-number text-white/20 text-sm"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                {s.number}
              </span>
            </div>

            {/* Headline + Body */}
            <div className="md:col-span-11 space-y-6">
              <h2
                className="about-headline text-white uppercase"
                style={{
                  fontFamily: "var(--font-koulen), Koulen, sans-serif",
                  fontSize: "clamp(2.5rem, 6vw, 7rem)",
                  lineHeight: 0.85,
                  letterSpacing: "0.03em",
                }}
              >
                {s.headline}
              </h2>

              <p
                className="about-body text-white/50 max-w-2xl text-lg md:text-xl"
                style={{
                  fontFamily: "Barlow Condensed, sans-serif",
                  letterSpacing: "0.01em",
                  lineHeight: 1.4,
                }}
              >
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
