"use client";

import { useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/country-codes";

const ROLES = [
  {
    id: "pacer",
    label: "Pacer",
    description: "Lead a pace group and help runners hit their target times. You run with us every week.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Help grow FRC Manila's brand, strategy, and campaigns across channels.",
  },
  {
    id: "socials",
    label: "Socials",
    description: "Capture content, write copy, manage Instagram and community posts.",
  },
  {
    id: "operations",
    label: "Operations",
    description: "Coordinate events, logistics, routes, and everything that makes runs happen.",
  },
] as const;

type RoleId = (typeof ROLES)[number]["id"];

export default function VolunteerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [role, setRole] = useState<RoleId | "">("");
  const [motivation, setMotivation] = useState("");
  const [dialCode, setDialCode] = useState(
    COUNTRIES.find(c => c.code === DEFAULT_COUNTRY)?.dial ?? "+63"
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          instagram,
          role,
          motivation,
          phone: phoneNumber.trim() ? `${dialCode} ${phoneNumber.trim()}` : null,
        }),
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

  return (
    <main className="bg-black min-h-screen pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-16">
          <p
            className="text-white/30 uppercase text-xs tracking-widest mb-4"
            style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.2em" }}
          >
            Volunteer Application
          </p>
          <h1
            className="text-white uppercase"
            style={{
              fontFamily: "var(--font-koulen), Koulen, sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.85,
              letterSpacing: "0.03em",
            }}
          >
            JOIN THE CREW
          </h1>
          <p
            className="text-white/50 mt-6 text-lg"
            style={{ fontFamily: "Barlow Condensed, sans-serif", lineHeight: 1.5 }}
          >
            FRC Manila is built by people who run and give back. These are voluntary roles — no pay, but a front-row seat to building something real.
          </p>
        </div>

        {submitted ? (
          <div className="border border-white/12 bg-[#111111] px-8 py-16 text-center">
            <p
              className="text-white uppercase text-2xl"
              style={{ fontFamily: "var(--font-koulen), Koulen, sans-serif", letterSpacing: "0.05em" }}
            >
              Application Received
            </p>
            <p className="text-white/50 mt-3" style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: "1rem" }}>
              We&apos;ll reach out if you&apos;re a fit. Keep running.
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Name */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Instagram Handle
              </label>
              <input
                name="instagram"
                type="text"
                maxLength={100}
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourhandle"
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Phone (Optional)
              </label>
              <div className="w-full flex border border-white/20 focus-within:border-white/50 transition-colors">
                <select
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="bg-[#111] text-white/70 text-sm px-3 py-3.5 appearance-none cursor-pointer border-r border-white/20 focus:outline-none hover:text-white transition-colors"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.dial} style={{ background: "#111", color: "#fff" }}>
                      {c.dial}
                    </option>
                  ))}
                </select>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="Phone number (optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))}
                  className="flex-1 bg-transparent text-white px-5 py-3.5 text-sm uppercase tracking-wider placeholder:text-white/30 focus:outline-none transition-colors"
                  style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.1em" }}
                />
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`text-left px-5 py-4 border transition-all duration-200 ${
                      role === r.id
                        ? "border-white bg-white/10 text-white"
                        : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
                    }`}
                  >
                    <p
                      className="uppercase font-semibold text-sm"
                      style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.12em" }}
                    >
                      {r.label}
                    </p>
                    <p
                      className="mt-1 text-xs opacity-70"
                      style={{ fontFamily: "Barlow Condensed, sans-serif", lineHeight: 1.4 }}
                    >
                      {r.description}
                    </p>
                  </button>
                ))}
              </div>
              {/* Hidden required input to enforce role selection */}
              <input
                type="text"
                required
                value={role}
                onChange={() => {}}
                style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
                tabIndex={-1}
              />
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-white/30 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}>
                Why do you want to join the crew?
              </label>
              <textarea
                name="motivation"
                required
                rows={5}
                maxLength={2000}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us about yourself and why you want to contribute"
                className="w-full bg-transparent border border-white/20 text-white px-5 py-3.5 text-sm uppercase tracking-wider placeholder:text-white/30 focus:border-white/50 focus:outline-none transition-colors resize-none"
                style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.08em" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-8 py-4 uppercase text-sm font-semibold tracking-wider hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Barlow Condensed, sans-serif", letterSpacing: "0.15em" }}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <p
              className="text-white/20 text-xs text-center"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Voluntary role. No compensation. We&apos;ll reach out if you&apos;re a fit.
            </p>
          </form>
          </>
        )}

      </div>
    </main>
  );
}
