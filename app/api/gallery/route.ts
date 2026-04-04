import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const R2_FRC_PUBLIC = "https://pub-ac9f5d9fc73d402ca8032993e2b2761c.r2.dev";
const PAGE_SIZE = 24;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startAfter = searchParams.get("after") ?? undefined;

  try {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: "frc",
        Prefix: "photos/",
        MaxKeys: PAGE_SIZE + 1,
        StartAfter: startAfter ? startAfter : undefined,
      })
    );

    const allKeys = (res.Contents ?? [])
      .map((obj) => obj.Key!)
      .filter((key) => /\.(jpe?g|png|webp|gif|avif)$/i.test(key));

    const hasMore = allKeys.length > PAGE_SIZE;
    const keys = allKeys.slice(0, PAGE_SIZE);

    const photos = keys.map((key) => ({
      name: key,
      url: `${R2_FRC_PUBLIC}/${key.split("/").map(encodeURIComponent).join("/")}`,
    }));

    return NextResponse.json(
      { photos, hasMore },
    );
  } catch {
    return NextResponse.json({ photos: [], hasMore: false }, { status: 200 });
  }
}
