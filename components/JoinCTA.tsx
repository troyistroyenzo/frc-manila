"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function InstagramDMIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function JoinCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [brand, setBrand] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePartnerSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/collaborate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, email: partnerEmail, message }),
      });

      if (!res.ok) {
        setError("Something went wrong. Try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

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
        ".cta-block",
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black py-28 md:py-36 px-6 md:px-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-20">

        {/* Divider */}
        <div className="cta-divider w-full h-px bg-white/10 origin-left" style={{ transform: "scaleX(0)" }} />

        {/* Collaboration block */}
        <div className="cta-block w-full flex flex-col items-center gap-8 text-center" style={{ opacity: 0 }}>
          <span
            className="text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            Collaborate
          </span>

          <h2
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 0.88,
              letterSpacing: "0.03em",
            }}
          >
            LOOKING TO COLLABORATE?
          </h2>

          <p
            className="text-white/60 max-w-2xl"
            style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.55 }}
          >
            We encourage new collaborators to join at least 1–2 runs to get a real feel of the community — because the best partnerships start from genuine connection. We value long-term, intentional relationships with brands who want to grow with us.
          </p>

          {/* Partnership form */}
          {error && (
            <p className="text-red-400 text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
              {error}
            </p>
          )}
          {submitted ? (
            <div className="border border-white/12 bg-[#111111] px-8 py-10 w-full max-w-xl text-center">
              <p className="text-white uppercase" style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif", letterSpacing: "0.05em", fontSize: "1.2rem" }}>
                Message Received
              </p>
              <p className="text-white/50 mt-2 text-sm" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                We&apos;ll be in touch, partner.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePartnerSubmit} className="w-full max-w-xl flex flex-col gap-3">
              <input
                name="brand"
                type="text"
                required
                placeholder="Brand / Company"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                           placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                           placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
              />
              <textarea
                name="message"
                required
                placeholder="Tell us about your brand and how you'd like to collaborate"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                           placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors resize-none"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.08em" }}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black px-8 py-3.5 uppercase text-sm font-semibold tracking-wider
                           hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
              >
                {loading ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}

          {/* Contact links */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
            <a
              href="mailto:foundersrcmanila@gmail.com"
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <EmailIcon />
              <span className="uppercase text-sm tracking-widest group-hover:text-white transition-colors" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                foundersrcmanila@gmail.com
              </span>
            </a>
            <span className="text-white/20 hidden sm:block">·</span>
            <a
              href="https://ig.me/m/frcmanila"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              <InstagramDMIcon />
              <span className="uppercase text-sm tracking-widest group-hover:text-white transition-colors" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Message on Instagram
              </span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="cta-divider w-full h-px bg-white/10 origin-left" style={{ transform: "scaleX(0)" }} />

        {/* Support Us block */}
        <div className="cta-block w-full flex flex-col items-center gap-8 text-center" style={{ opacity: 0 }}>
          <span
            className="text-white/30 text-xs uppercase tracking-widest"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            Support Us
          </span>

          <h2
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 0.88,
              letterSpacing: "0.03em",
            }}
          >
            JOIN THE CREW
          </h2>

          <p
            className="text-white/60 max-w-2xl"
            style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "clamp(1rem, 2vw, 1.25rem)", lineHeight: 1.55 }}
          >
            We&apos;re looking for pacers, marketers, content creators, and operations people who want to build FRC Manila from the ground up. All voluntary — but deeply rewarding.
          </p>

          <a
            href="/volunteer"
            className="flex items-center gap-3 border border-white/30 text-white/70 hover:text-white hover:border-white px-8 py-4 uppercase text-sm tracking-widest transition-all duration-300"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
          >
            <span>Apply to Volunteer</span>
            <ArrowIcon />
          </a>
        </div>

      </div>
    </section>
  );
}
