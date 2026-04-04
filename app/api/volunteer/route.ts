import { NextResponse } from "next/server";
import { queryD1 } from "@/lib/d1";
import { sendTelegram } from "@/lib/telegram";

const VALID_ROLES = ["pacer", "marketing", "socials", "operations"] as const;

export async function POST(req: Request) {
  const { name, email, instagram, role, motivation } = await req.json() as {
    name: unknown;
    email: unknown;
    instagram: unknown;
    role: unknown;
    motivation: unknown;
  };

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

  const igHandle = typeof instagram === "string" && instagram.trim() ? instagram.trim() : "—";
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  try {
    await queryD1(
      "INSERT INTO volunteer_applications (name, email, instagram, role, motivation) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), igHandle === "—" ? null : igHandle, role, motivation.trim()]
    );
  } catch (err) {
    console.error("D1 volunteer insert error:", err);
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }

  await sendTelegram(
    `🙋 *New volunteer application*\n*Name:* ${name.trim()}\n*Email:* ${email.toLowerCase().trim()}\n*Role:* ${roleName}\n*Instagram:* ${igHandle}\n*Why:* ${motivation.trim()}`
  );

  return NextResponse.json({ success: true });
}
