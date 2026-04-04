import { NextResponse } from "next/server";
import { galleryLimiter } from "@/lib/rate-limit";
import { getGalleryPhotos } from "@/lib/gallery";

export async function GET(request: Request) {
  const { success } = galleryLimiter.check(request);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { searchParams } = new URL(request.url);
  const startAfter = searchParams.get("after") ?? undefined;
  const allMode = searchParams.get("all") === "true";

  try {
    const { photos, hasMore } = await getGalleryPhotos({ all: allMode, after: startAfter });

    return NextResponse.json(
      { photos, hasMore },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
