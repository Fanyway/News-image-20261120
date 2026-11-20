import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const src = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const dest = join(outDir, "entry.png");

if (!existsSync(src)) {
  console.error(`entry.png not found at ${src}`);
  process.exit(1);
}
// Guard: entry.png must really be a PNG (8-byte signature), not a
// misnamed or corrupted file, before it is copied to the output.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const head = readFileSync(src).subarray(0, 8);
if (!head.equals(PNG_SIGNATURE)) {
  console.error(`entry.png at ${src} is not a PNG file (bad signature)`);
  process.exit(1);
}
copyFileSync(src, dest);
