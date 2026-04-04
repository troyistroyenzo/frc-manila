import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "public/assets/merch/frc-shirt");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "frc-shirt.glb");

const FRONT_UV = { u0: 0.132, u1: 0.868, v0: 0.56, v1: 0.94 };
const BACK_UV = { u0: 0.132, u1: 0.868, v0: 0.06, v1: 0.44 };
const LEFT_SIDE_UV = { u0: 0.02, u1: 0.07, v0: 0.04, v1: 0.96 };
const RIGHT_SIDE_UV = { u0: 0.93, u1: 0.98, v0: 0.04, v1: 0.96 };

class NodeFileReader {
  constructor() {
    this.result = null;
    this.onload = null;
    this.onloadend = null;
    this.onerror = null;
    this.listeners = new Map();
  }

  addEventListener(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);
  }

  removeEventListener(type, callback) {
    this.listeners.get(type)?.delete(callback);
  }

  emit(type, payload) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      for (const callback of callbacks) {
        callback(payload);
      }
    }
  }

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer();
      const event = { target: this };
      if (this.onload) {
        this.onload(event);
      }
      if (this.onloadend) {
        this.onloadend(event);
      }
      this.emit("load", event);
      this.emit("loadend", event);
    } catch (error) {
      const event = { target: this, error };
      if (this.onerror) {
        this.onerror(event);
      }
      this.emit("error", event);
    }
  }

  async readAsDataURL(blob) {
    try {
      const buffer = Buffer.from(await blob.arrayBuffer());
      const mime = blob.type || "application/octet-stream";
      this.result = `data:${mime};base64,${buffer.toString("base64")}`;
      const event = { target: this };
      if (this.onload) {
        this.onload(event);
      }
      if (this.onloadend) {
        this.onloadend(event);
      }
      this.emit("load", event);
      this.emit("loadend", event);
    } catch (error) {
      const event = { target: this, error };
      if (this.onerror) {
        this.onerror(event);
      }
      this.emit("error", event);
    }
  }
}

if (typeof globalThis.FileReader === "undefined") {
  // GLTFExporter expects FileReader when serializing GLB.
  globalThis.FileReader = NodeFileReader;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (Math.abs(inMax - inMin) < Number.EPSILON) {
    return outMin;
  }

  const t = THREE.MathUtils.clamp((value - inMin) / (inMax - inMin), 0, 1);
  return THREE.MathUtils.lerp(outMin, outMax, t);
}

function buildShirtShape() {
  const shape = new THREE.Shape();

  shape.moveTo(-0.8, -1.08);
  shape.lineTo(-0.8, 0.16);
  shape.lineTo(-1.34, 0.48);
  shape.lineTo(-1.13, 0.79);
  shape.lineTo(-0.69, 1.03);
  shape.lineTo(-0.34, 1.03);
  shape.bezierCurveTo(-0.19, 0.95, -0.08, 0.89, 0, 0.88);
  shape.bezierCurveTo(0.08, 0.89, 0.19, 0.95, 0.34, 1.03);
  shape.lineTo(0.69, 1.03);
  shape.lineTo(1.13, 0.79);
  shape.lineTo(1.34, 0.48);
  shape.lineTo(0.8, 0.16);
  shape.lineTo(0.8, -1.08);
  shape.lineTo(-0.8, -1.08);

  const neckHole = new THREE.Path();
  neckHole.absellipse(0, 0.82, 0.23, 0.13, 0, Math.PI * 2, false, 0);
  shape.holes.push(neckHole);

  return shape;
}

function deformShirtGeometry(geometry) {
  const positions = geometry.getAttribute("position");

  for (let i = 0; i < positions.count; i += 1) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);

    const absX = Math.abs(x);

    const sleeveWeight = THREE.MathUtils.clamp((absX - 0.82) / 0.52, 0, 1) * THREE.MathUtils.clamp((y - 0.05) / 0.95, 0, 1);
    const shoulderWeight = THREE.MathUtils.clamp((y - 0.58) / 0.5, 0, 1);
    const chestWeight = THREE.MathUtils.clamp((y + 0.06) / 1.2, 0, 1) * (1 - THREE.MathUtils.clamp(absX / 1.1, 0, 1));
    const hemWeight = THREE.MathUtils.clamp((-0.88 - y) / 0.24, 0, 1);

    y -= sleeveWeight * 0.1;
    y += hemWeight * absX * 0.05;

    const taper = 1 - THREE.MathUtils.clamp((0.18 - y) / 1.4, 0, 1) * 0.08;
    x *= taper;

    const zSign = z >= 0 ? 1 : -1;
    z += zSign * (chestWeight * 0.03 + shoulderWeight * 0.015);

    positions.setXYZ(i, x, y, z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
}

function applyUvLayout(geometry) {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;

  const minX = bounds.min.x;
  const maxX = bounds.max.x;
  const minY = bounds.min.y;
  const maxY = bounds.max.y;
  const minZ = bounds.min.z;
  const maxZ = bounds.max.z;

  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  const uv = new Float32Array(positions.count * 2);

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);

    const nx = normals.getX(i);
    const nz = normals.getZ(i);

    let u;
    let v;

    if (Math.abs(nz) > 0.58) {
      const zone = nz >= 0 ? FRONT_UV : BACK_UV;
      u = mapRange(x, minX, maxX, zone.u0, zone.u1);
      v = mapRange(y, minY, maxY, zone.v0, zone.v1);
    } else {
      const sideZone = nx < 0 ? LEFT_SIDE_UV : RIGHT_SIDE_UV;
      u = mapRange(z, minZ, maxZ, sideZone.u0, sideZone.u1);
      v = mapRange(y, minY, maxY, sideZone.v0, sideZone.v1);
    }

    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }

  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

function createShirtMesh() {
  const shape = buildShirtShape();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.32,
    steps: 1,
    curveSegments: 40,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  geometry.translate(0, 0, -0.16);
  deformShirtGeometry(geometry);
  applyUvLayout(geometry);

  const material = new THREE.MeshStandardMaterial({
    color: 0x050505,
    roughness: 0.88,
    metalness: 0.02,
    side: THREE.DoubleSide,
    name: "FRCShirtMaterial",
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "FRCShirtMesh";
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

async function exportGlb(object3D) {
  const exporter = new GLTFExporter();

  const glb = await new Promise((resolve, reject) => {
    exporter.parse(
      object3D,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(result);
          return;
        }

        reject(new Error("GLTFExporter did not return binary output"));
      },
      (error) => reject(error),
      {
        binary: true,
        onlyVisible: true,
        trs: false,
      },
    );
  });

  return Buffer.from(glb);
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const root = new THREE.Group();
  root.name = "FRCShirtRoot";

  const shirt = createShirtMesh();
  root.add(shirt);

  const glbBuffer = await exportGlb(root);
  await fs.writeFile(OUTPUT_FILE, glbBuffer);

  console.log("Generated model:");
  console.log(`- ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
