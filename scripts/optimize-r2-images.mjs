import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;

if (!ACCOUNT_ID || !ACCESS_KEY || !SECRET_KEY) {
  console.error("Missing R2 env vars. Run with:\n  R2_ACCOUNT_ID=x R2_ACCESS_KEY_ID=x R2_SECRET_ACCESS_KEY=x node scripts/optimize-r2-images.mjs");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

const BUCKET = "frc";
const PREFIXES = ["photos/", "city leads/"];
const MAX_WIDTH_GALLERY = 2000;
const MAX_WIDTH_TEAM = 800;
const QUALITY = 80;

async function listAll(prefix) {
  const keys = [];
  let token;
  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: token,
    }));
    for (const obj of res.Contents ?? []) {
      if (/\.(jpe?g|png|webp|gif|avif)$/i.test(obj.Key)) {
        keys.push({ key: obj.Key, size: obj.Size });
      }
    }
    token = res.NextContinuationToken;
  } while (token);
  return keys;
}

async function optimize(key, originalSize, maxWidth) {
  // Download
  const { Body, ContentType } = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const buffer = Buffer.from(await Body.transformToByteArray());

  // Compress
  const compressed = await sharp(buffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();

  // Skip if compression didn't help
  if (compressed.length >= originalSize) {
    console.log(`  SKIP ${key} — already optimal (${fmt(originalSize)})`);
    return { saved: 0 };
  }

  // Upload (overwrite)
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: compressed,
    ContentType: "image/jpeg",
  }));

  const saved = originalSize - compressed.length;
  console.log(`  ✓ ${key}  ${fmt(originalSize)} → ${fmt(compressed.length)}  (saved ${fmt(saved)})`);
  return { saved };
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

async function main() {
  let totalSaved = 0;
  let count = 0;

  for (const prefix of PREFIXES) {
    const maxWidth = prefix.startsWith("city") ? MAX_WIDTH_TEAM : MAX_WIDTH_GALLERY;
    console.log(`\n📁 ${prefix} (max ${maxWidth}px)`);

    const objects = await listAll(prefix);
    console.log(`  Found ${objects.length} images\n`);

    for (const { key, size } of objects) {
      try {
        const { saved } = await optimize(key, size, maxWidth);
        totalSaved += saved;
        count++;
      } catch (err) {
        console.error(`  ✗ ${key} — ${err.message}`);
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Done. ${count} images processed. Total saved: ${fmt(totalSaved)}`);
}

main();
