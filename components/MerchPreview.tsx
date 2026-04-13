"use client";

import { useState } from "react";

export default function MerchPreview() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.status === 409) {
        setError("You're already on the list.");
        return;
      }
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

  return (
    <section id="merch-preview" className="bg-black px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
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
            MERCH WAITLIST
          </h2>
          <p
            className="text-white/55 mt-3 text-base md:text-lg"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Be the first to know when FRC Manila merch drops. Join the waitlist.
          </p>
        </div>

        {submitted ? (
          <div className="border border-white/12 bg-[#111111] px-10 py-12 w-full max-w-xl text-center">
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
              We&apos;ll notify you when FRC Manila merch is ready to drop.
            </p>
          </div>
        ) : (
          <>
          {error && (
            <p
              className="text-red-400 text-sm mb-2"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl"
          >
            <input
              name="name"
              type="text"
              required
              maxLength={100}
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
              maxLength={254}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider
                         placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-8 py-3.5 uppercase text-sm font-semibold tracking-wider
                         hover:bg-white/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              {loading ? "..." : "Join Waitlist"}
            </button>
          </form>
          </>
        )}
      </div>
    </section>
  );
}
