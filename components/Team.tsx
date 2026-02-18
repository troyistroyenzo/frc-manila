"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const team = [
  {
    name: "PLACEHOLDER NAME",
    title: "Co-Founder & Pacesetter",
    bio: "Serial entrepreneur and early-morning runner. Believes the best deals are closed before 7AM.",
    photoAspect: "aspect-square",
  },
  {
    name: "PLACEHOLDER NAME",
    title: "Community Director",
    bio: "Investor, connector, and the one who makes sure nobody gets left behind on the road.",
    photoAspect: "aspect-square",
  },
  {
    name: "PLACEHOLDER NAME",
    title: "Operations Lead",
    bio: "Keeps the run smooth. From route planning to post-run coffee — every detail matters.",
    photoAspect: "aspect-square",
  },
  {
    name: "PLACEHOLDER NAME",
    title: "Brand & Creative",
    bio: "Shapes how FRC Manila shows up to the world. Content, design, and creative direction.",
    photoAspect: "aspect-square",
  },
  {
    name: "PLACEHOLDER NAME",
    title: "Partnerships Lead",
    bio: "Builds the relationships that make our community stronger. From brands to ecosystems.",
    photoAspect: "aspect-square",
  },
  {
    name: "PLACEHOLDER NAME",
    title: "Athlete Ambassador",
    bio: "Sets the pace, both literally and figuratively. Elite runner and community inspiration.",
    photoAspect: "aspect-square",
  },
];

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);

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

        {/* Grid */}
        <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {team.map((member, i) => (
            <div
              key={i}
              className="team-card bg-[#111111] group cursor-default overflow-hidden"
              style={{ opacity: 0 }}
            >
              {/* Photo Placeholder */}
              <div
                className={`w-full ${member.photoAspect} bg-white/5 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                {/* Replace with <img> when photos are ready */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-white/10"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              </div>

              {/* Info */}
              <div className="p-6 md:p-8">
                <h3
                  className="text-white uppercase mb-1"
                  style={{
                    fontFamily: "var(--font-koulen), Koulen, sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    lineHeight: 0.9,
                    letterSpacing: "0.03em",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-white/50 uppercase text-sm mb-3"
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  {member.title}
                </p>
                <p
                  className="text-white/30 text-sm leading-relaxed"
                  style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                >
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
