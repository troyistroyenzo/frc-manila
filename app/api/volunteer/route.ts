import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/d1";
import { sendTelegram, escapeMd } from "@/lib/telegram";
import { postLimiter } from "@/lib/rate-limit";

const VALID_ROLES = ["pacer", "marketing", "socials", "operations"] as const;

export async function POST(req: Request) {
  const { success } = postLimiter.check(req);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: { name: unknown; email: unknown; instagram: unknown; role: unknown; motivation: unknown; phone: unknown };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { name, email, instagram, role, motivation, phone } = body;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (typeof role !== "string" || !(VALID_ROLES as readonly string[]).includes(role)) {
    return NextResponse.json({ error: "Valid role is required" }, { status: 400 });
  }
  if (typeof motivation !== "string" || !motivation.trim()) {
    return NextResponse.json({ error: "Motivation is required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }
  if (email.length > 254) {
    return NextResponse.json({ error: "Email is too long" }, { status: 400 });
  }
  if (motivation.length > 2000) {
    return NextResponse.json({ error: "Motivation is too long" }, { status: 400 });
  }
  if (typeof instagram === "string" && instagram.length > 100) {
    return NextResponse.json({ error: "Instagram handle is too long" }, { status: 400 });
  }

  if (phone != null && phone !== "") {
    if (typeof phone !== "string" || phone.length > 20) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!/^\+\d{1,4} \d{4,14}$/.test(phone.trim())) {
      return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
    }
  }
  const phoneTrimmed = typeof phone === "string" && phone.trim() ? phone.trim() : null;

  const igHandle = typeof instagram === "string" && instagram.trim() ? instagram.trim() : "—";
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  try {
    await queryD1(
      "INSERT INTO volunteer_applications (name, email, instagram, role, motivation, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), igHandle === "—" ? null : igHandle, role, motivation.trim(), phoneTrimmed]
    );
  } catch (err) {
    console.error("D1 volunteer insert error:", err);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }

  try {
    await sendTelegram(
      `🙋 *New volunteer application*\n` +
      `*Name:* ${escapeMd(name.trim())}\n` +
      `*Email:* ${escapeMd(email.toLowerCase().trim())}\n` +
      `*Role:* ${escapeMd(roleName)}\n` +
      (phoneTrimmed ? `*Phone:* ${escapeMd(phoneTrimmed)}\n` : "") +
      `*Instagram:* ${escapeMd(igHandle)}\n` +
      `*Why:* ${escapeMd(motivation.trim())}`
    );
  } catch (err) {
    console.error("Telegram notify failed:", err);
  }

  return NextResponse.json({ success: true });
}
