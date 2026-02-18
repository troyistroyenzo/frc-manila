"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2000, suffix: "+", label: "Cumulative Runners" },
  { value: 72, suffix: "+", label: "Runs Hosted" },
  { value: 20, suffix: "+", label: "Major Events" },
  { value: null, suffix: "", label: "Weekly Runs", display: "Every\nWeekend" },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

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

    // Fade in all stat cards
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
      className="bg-[#111111] py-24 md:py-40"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
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
              className="stat-card bg-[#111111] p-8 md:p-12 flex flex-col justify-between"
              style={{ opacity: 0 }}
            >
              <div
                className="text-white mb-4"
                style={{
                  fontFamily: "var(--font-koulen), Koulen, sans-serif",
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  lineHeight: 0.85,
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
