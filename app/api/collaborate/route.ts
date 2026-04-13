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

  let body: { brand: unknown; email: unknown; message: unknown; phone: unknown };
  try {
    body = await req.json() as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { brand, email, message, phone } = body;

  if (typeof brand !== "string" || !brand.trim()) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (brand.length > 200) {
    return NextResponse.json({ error: "Brand name is too long" }, { status: 400 });
  }
  if (email.length > 254) {
    return NextResponse.json({ error: "Email is too long" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
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

  try {
    await queryD1(
      "INSERT INTO collaborations (brand, email, message, phone) VALUES (?, ?, ?, ?)",
      [brand.trim(), email.toLowerCase().trim(), message.trim(), phoneTrimmed]
    );
  } catch (err) {
    console.error("D1 collaborate insert error:", err);
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
  }

  try {
    await sendTelegram(
      `🤝 *New collaboration inquiry*\n` +
      `*Brand:* ${escapeMd(brand.trim())}\n` +
      `*Email:* ${escapeMd(email.toLowerCase().trim())}\n` +
      (phoneTrimmed ? `*Phone:* ${escapeMd(phoneTrimmed)}\n` : "") +
      `*Message:* ${escapeMd(message.trim())}`
    );
  } catch (err) {
    console.error("Telegram notify failed:", err);
  }

  return NextResponse.json({ success: true });
}
