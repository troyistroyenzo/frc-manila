import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");

const SOURCE_DIR = path.join(ROOT_DIR, "assets/merch/source");
const OUTPUT_DIR = path.join(ROOT_DIR, "public/assets/merch/frc-shirt");

const SIZE = 4096;

const FRONT_ZONE = {
  x: 540,
  y: 300,
  width: 3016,
  height: 1400,
};

const BACK_ZONE = {
  x: 540,
  y: 2380,
  width: 3016,
  height: 1400,
};

const SHIRT_COLOR = { r: 5, g: 5, b: 5, alpha: 1 };

function hashNoise(x, y, seed = 0) {
  let h = x * 374761393 + y * 668265263 + seed * 982451653;
  h = (h ^ (h >>> 13)) * 1274126177;
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

async function preparePrint(printPath, zone) {
  const trimmed = sharp(printPath).trim();
  const { data, info } = await trimmed.png().toBuffer({ resolveWithObject: true });

  const widthScale = zone.width / info.width;
  const heightScale = zone.height / info.height;
  const scale = Math.min(widthScale, heightScale);

  const targetWidth = Math.max(1, Math.round(info.width * scale));
  const targetHeight = Math.max(1, Math.round(info.height * scale));

  const resized = await sharp(data)
    .resize(targetWidth, targetHeight, {
      fit: "contain",
      kernel: "lanczos3",
    })
    .png()
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: resized.data,
    width: resized.info.width,
    height: resized.info.height,
  };
}

function buildRoughnessMap() {
  const data = Buffer.alloc(SIZE * SIZE);

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const i = y * SIZE + x;

      const coarse = hashNoise((x / 7) | 0, (y / 7) | 0, 11);
      const fine = hashNoise(x, y, 29);
      const grain = (coarse * 0.65 + fine * 0.35) - 0.5;

      const value = Math.max(200, Math.min(244, Math.round(226 + grain * 22)));
      data[i] = value;
    }
  }

  return data;
}

function buildNormalMap() {
  const data = Buffer.alloc(SIZE * SIZE * 3);

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      const i = (y * SIZE + x) * 3;

      const weaveX = hashNoise((x / 3) | 0, y, 3) - 0.5;
      const weaveY = hashNoise(x, (y / 3) | 0, 7) - 0.5;

      const nx = Math.max(104, Math.min(152, Math.round(128 + weaveX * 14)));
      const ny = Math.max(104, Math.min(152, Math.round(128 + weaveY * 14)));

      data[i] = nx;
      data[i + 1] = ny;
      data[i + 2] = 255;
    }
  }

  return data;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const frontSource = path.join(SOURCE_DIR, "front-print.png");
  const backSource = path.join(SOURCE_DIR, "back-print.png");

  const [frontPrint, backPrint] = await Promise.all([
    preparePrint(frontSource, FRONT_ZONE),
    preparePrint(backSource, BACK_ZONE),
  ]);

  const baseColorComposite = [
    {
      input: frontPrint.buffer,
      top: FRONT_ZONE.y + Math.floor((FRONT_ZONE.height - frontPrint.height) / 2),
      left: FRONT_ZONE.x + Math.floor((FRONT_ZONE.width - frontPrint.width) / 2),
    },
    {
      input: backPrint.buffer,
      top: BACK_ZONE.y + Math.floor((BACK_ZONE.height - backPrint.height) / 2),
      left: BACK_ZONE.x + Math.floor((BACK_ZONE.width - backPrint.width) / 2),
    },
  ];

  const baseColorPath = path.join(OUTPUT_DIR, "frc-shirt_basecolor.png");
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: SHIRT_COLOR,
    },
  })
    .composite(baseColorComposite)
    .png({ compressionLevel: 9 })
    .toFile(baseColorPath);

  const roughnessPath = path.join(OUTPUT_DIR, "frc-shirt_roughness.png");
  await sharp(buildRoughnessMap(), {
    raw: {
      width: SIZE,
      height: SIZE,
      channels: 1,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(roughnessPath);

  const normalPath = path.join(OUTPUT_DIR, "frc-shirt_normal.png");
  await sharp(buildNormalMap(), {
    raw: {
      width: SIZE,
      height: SIZE,
      channels: 3,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(normalPath);

  console.log("Generated texture maps:");
  console.log(`- ${baseColorPath}`);
  console.log(`- ${roughnessPath}`);
  console.log(`- ${normalPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
