import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const revalidate = 3300;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: files, error } = await supabase.storage
    .from("team")
    .list("", { limit: 50, sortBy: { column: "name", order: "asc" } });

  if (error || !files) {
    return NextResponse.json({ members: [] }, { status: 200 });
  }

  const imageFiles = files.filter((f) =>
    /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name)
  );

  const { data: signed, error: signError } = await supabase.storage
    .from("team")
    .createSignedUrls(
      imageFiles.map((f) => f.name),
      3600
    );

  if (signError || !signed) {
    return NextResponse.json({ members: [] }, { status: 200 });
  }

  const members = signed
    .filter((s) => s.signedUrl && s.path)
    .map((s) => ({ name: s.path!, url: s.signedUrl }));

  return NextResponse.json(
    { members },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3300, stale-while-revalidate=60",
      },
    }
  );
}
