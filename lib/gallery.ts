import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { requireEnv } from "@/lib/env";

export type Photo = {
  name: string;
  url: string;
};

const R2_FRC_PUBLIC = "https://pub-ac9f5d9fc73d402ca8032993e2b2761c.r2.dev";
const PAGE_SIZE = 24;

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
  },
});

export async function getGalleryPhotos(opts?: {
  all?: boolean;
  after?: string;
}): Promise<{ photos: Photo[]; hasMore: boolean }> {
  const allMode = opts?.all === true;
  const limit = allMode ? 1000 : PAGE_SIZE;

  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: "frc",
      Prefix: "photos/",
      MaxKeys: limit + 1,
      StartAfter: opts?.after,
    })
  );

  const allKeys = (res.Contents ?? [])
    .map((obj) => obj.Key!)
    .filter((key) => /\.(jpe?g|png|webp|gif|avif)$/i.test(key));

  const hasMore = !allMode && allKeys.length > PAGE_SIZE;
  const keys = allMode ? allKeys : allKeys.slice(0, PAGE_SIZE);

  const photos = keys.map((key) => ({
    name: key,
    url: `${R2_FRC_PUBLIC}/${key.split("/").map(encodeURIComponent).join("/")}`,
  }));

  return { photos, hasMore };
}
