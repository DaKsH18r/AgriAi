import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join } from "path";

const INPUT_DIR = "./public/images";
const OUTPUT_DIR = "./public/images/optimized";

async function optimizeImages() {
  const files = await readdir(INPUT_DIR);

  for (const file of files) {
    const filePath = join(INPUT_DIR, file);
    const fileStat = await stat(filePath);

    if (!fileStat.isFile() || !file.match(/\.(jpg|jpeg|png)$/i)) {
      continue;
    }

    const baseName = file.replace(/\.(jpg|jpeg|png)$/i, "");

    console.log(`Optimizing ${file}...`);

    // Generate WebP
    await sharp(filePath)
      .webp({ quality: 85, effort: 6 })
      .toFile(join(OUTPUT_DIR, `${baseName}.webp`));

    // Generate responsive sizes (for hero: 1920, 1400, 768, 480)
    const sizes = [1920, 1400, 768, 480];

    for (const width of sizes) {
      await sharp(filePath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(join(OUTPUT_DIR, `${baseName}-${width}w.webp`));

      console.log(`  → ${baseName}-${width}w.webp`);
    }
  }

  console.log("✅ Image optimization complete!");
}

optimizeImages().catch(console.error);
