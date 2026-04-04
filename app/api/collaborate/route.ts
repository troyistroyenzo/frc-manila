import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/d1";
import { sendTelegram } from "@/lib/telegram";

export async function POST(req: Request) {
  const { brand, email, message } = await req.json() as {
    brand: unknown;
    email: unknown;
    message: unknown;
  };

  if (typeof brand !== "string" || !brand.trim()) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    await queryD1(
      "INSERT INTO collaborations (brand, email, message) VALUES (?, ?, ?)",
      [brand.trim(), email.toLowerCase().trim(), message.trim()]
    );
  } catch (err) {
    console.error("D1 collaborate insert error:", err);
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
  }

  await sendTelegram(
    `🤝 *New collaboration inquiry*\n*Brand:* ${brand.trim()}\n*Email:* ${email.toLowerCase().trim()}\n*Message:* ${message.trim()}`
  );

  return NextResponse.json({ success: true });
}
