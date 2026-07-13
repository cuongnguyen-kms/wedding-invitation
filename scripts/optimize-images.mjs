import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_DIR = path.join(__dirname, "..", "assets", "photos-source");
const THUMB_DIR = path.join(__dirname, "..", "public", "images", "gallery", "thumb");
const FULL_DIR = path.join(__dirname, "..", "public", "images", "gallery", "full");

const THUMB_WIDTH = 700;
const FULL_WIDTH = 1920;

async function optimizeImages() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(THUMB_DIR, { recursive: true });
  fs.mkdirSync(FULL_DIR, { recursive: true });

  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((file) => /\.(jpe?g|png)$/i.test(file));

  if (files.length === 0) {
    console.log("No source images found.");
    return;
  }

  for (const file of files) {
    const inputPath = path.join(SOURCE_DIR, file);
    const outputName = `${path.parse(file).name}.jpg`;

    await sharp(inputPath)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(path.join(THUMB_DIR, outputName));

    await sharp(inputPath)
      .rotate()
      .resize({ width: FULL_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(FULL_DIR, outputName));

    console.log(`Optimized ${file}`);
  }

  console.log(`Done. Optimized ${files.length} image(s).`);
}

optimizeImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
