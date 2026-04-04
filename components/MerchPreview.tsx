"use client";

import { useState } from "react";

export default function MerchPreview() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to D1-backed API when ready
    setSubmitted(true);
  }

  return (
    <section id="merch-preview" className="bg-black px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-10">
          <p
            className="text-white/35 uppercase text-xs tracking-[0.2em]"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            FRC Merch
          </p>
          <h2
            className="text-white uppercase mt-2"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(2.4rem, 7vw, 6rem)",
              lineHeight: 0.85,
              letterSpacing: "0.03em",
            }}
          >
            MNL TEE
          </h2>
          <p
            className="text-white/55 mt-3 max-w-2xl text-base md:text-lg"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Be the first to know when FRC Manila merch drops. Join the waitlist.
          </p>
        </div>

        {submitted ? (
          <div
            className="border border-white/12 bg-[#111111] px-8 py-12 max-w-xl"
          >
            <p
              className="text-white uppercase text-lg"
              style={{
                fontFamily: "var(--font-koulen), Koulen, sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              You&apos;re In
            </p>
            <p
              className="text-white/50 mt-2 text-sm"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              We&apos;ll notify you when the MNL Tee is ready to drop.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl"
          >
            <input
              name="name"
              type="text"
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                         placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                         placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
            />
            <button
              type="submit"
              className="bg-white text-black px-8 py-3.5 uppercase text-sm font-semibold tracking-wider
                         hover:bg-white/90 transition-colors whitespace-nowrap"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
