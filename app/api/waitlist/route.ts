import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/d1";
import { sendTelegram, escapeMd } from "@/lib/telegram";
import { postLimiter } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const { success } = postLimiter.check(req);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: { name: unknown; email: unknown };
  try {
    body = await req.json() as { name: unknown; email: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { name, email } = body;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (name.length > 100) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }
  if (email.length > 254) {
    return NextResponse.json({ error: "Email is too long" }, { status: 400 });
  }

  try {
    await queryD1(
      "INSERT INTO waitlist (name, email) VALUES (?, ?)",
      [name.trim(), email.toLowerCase().trim()]
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("UNIQUE") || msg.includes("unique")) {
      return NextResponse.json({ error: "already_on_list" }, { status: 409 });
    }
    console.error("D1 waitlist insert error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }

  try {
    await sendTelegram(
      `👟 *New merch waitlist signup*\n*Name:* ${escapeMd(name.trim())}\n*Email:* ${escapeMd(email.toLowerCase().trim())}`
    );
  } catch (err) {
    console.error("Telegram notify failed:", err);
  }

  return NextResponse.json({ success: true });
}
