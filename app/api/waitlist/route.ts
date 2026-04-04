import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/d1";
import { sendTelegram } from "@/lib/telegram";

export async function POST(req: Request) {
  const { name, email } = await req.json() as { name: unknown; email: unknown };

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
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

  await sendTelegram(
    `👟 *New merch waitlist signup*\n*Name:* ${name.trim()}\n*Email:* ${email.toLowerCase().trim()}`
  );

  return NextResponse.json({ success: true });
}
