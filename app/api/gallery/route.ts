import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Vercel caches this response for 55 minutes.
// Signed URLs have 1-hour expiry → always valid when served from cache.
export const revalidate = 3300;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: files, error } = await supabase.storage
    .from("photos")
    .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

  if (error || !files) {
    return NextResponse.json({ photos: [] }, { status: 200 });
  }

  const imageFiles = files.filter((f) =>
    /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name)
  );

  const { data: signed, error: signError } = await supabase.storage
    .from("photos")
    .createSignedUrls(
      imageFiles.map((f) => f.name),
      3600 // 1-hour token — matches revalidate window
    );

  if (signError || !signed) {
    return NextResponse.json({ photos: [] }, { status: 200 });
  }

  const photos = signed
    .filter((s) => s.signedUrl && s.path)
    .map((s) => ({ name: s.path!, url: s.signedUrl }));

  return NextResponse.json(
    { photos },
    {
      headers: {
        // CDN-level cache: serve stale while revalidating in background
        "Cache-Control": "public, s-maxage=3300, stale-while-revalidate=60",
      },
    }
  );
}
