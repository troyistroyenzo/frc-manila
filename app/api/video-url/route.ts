import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Vercel caches for 6 hours. Token is valid 24 hours — safe margin.
export const revalidate = 21600;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.storage
    .from("video")
    .createSignedUrl("test frc.mp4", 86400); // 24-hour token

  if (error || !data?.signedUrl) {
    return NextResponse.json({ url: null }, { status: 200 });
  }

  return NextResponse.json(
    { url: data.signedUrl },
    {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
      },
    }
  );
}
