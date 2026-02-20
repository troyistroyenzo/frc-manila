import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Vercel caches this response for 55 minutes.
// Signed URLs have 1-hour expiry → always valid when served from cache.
export const revalidate = 3300;

const PAGE_SIZE = 24;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch one extra to determine whether another page exists
  const { data: files, error } = await supabase.storage
    .from("photos")
    .list("", {
      limit: PAGE_SIZE + 1,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

  if (error || !files) {
    return NextResponse.json({ photos: [], hasMore: false }, { status: 200 });
  }

  const hasMore = files.length > PAGE_SIZE;
  const imageFiles = files
    .slice(0, PAGE_SIZE)
    .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name));

  const { data: signed, error: signError } = await supabase.storage
    .from("photos")
    .createSignedUrls(
      imageFiles.map((f) => f.name),
      3600 // 1-hour token — matches revalidate window
    );

  if (signError || !signed) {
    return NextResponse.json({ photos: [], hasMore: false }, { status: 200 });
  }

  const photos = signed
    .filter((s) => s.signedUrl && s.path)
    .map((s) => ({ name: s.path!, url: s.signedUrl }));

  return NextResponse.json(
    { photos, hasMore },
    {
      headers: {
        // CDN-level cache: serve stale while revalidating in background
        "Cache-Control": "public, s-maxage=3300, stale-while-revalidate=60",
      },
    }
  );
}
