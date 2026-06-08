import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { chromium } from "playwright";

const root = process.cwd();
const templates = [
  "brand_assets/templates/lifecycle-email.html",
  "brand_assets/templates/app-moment-card.html",
  "brand_assets/templates/web-experience.html"
];
const images = [
  "brand_assets/images/morning-routine-setup.png",
  "brand_assets/images/mindful-content-moment.png",
  "brand_assets/images/community-prompt-moment.png",
  "brand_assets/images/commerce-routine-kit.png"
];

for (const image of images) {
  const fullPath = path.join(root, image);
  const metadata = await sharp(fullPath).metadata();
  if (metadata.width !== 1600 || metadata.height !== 1000 || metadata.format !== "png") {
    throw new Error(`Unexpected image metadata for ${image}`);
  }
}

for (const template of templates) {
  const fullPath = path.join(root, template);
  const html = await fs.readFile(fullPath, "utf8");
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:)/.test(ref)) continue;
    const target = path.normalize(path.join(path.dirname(fullPath), ref));
    await fs.access(target);
  }
}

const screenshotDir = "/private/tmp/project-signal-brand-assets";
await fs.mkdir(screenshotDir, { recursive: true });

try {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

  for (const template of templates) {
    const url = pathToFileURL(path.join(root, template)).href;
    await page.goto(url, { waitUntil: "networkidle" });
    const failedImages = await page.evaluate(() =>
      Array.from(document.images)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.getAttribute("src"))
    );
    if (failedImages.length > 0) {
      throw new Error(`Broken images in ${template}: ${failedImages.join(", ")}`);
    }
    const out = path.join(screenshotDir, `${path.basename(template, ".html")}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`rendered ${template} -> ${out}`);
  }

  await browser.close();
} catch (error) {
  console.warn(`Skipped browser screenshots: ${error.message.split("\n")[0]}`);
}

console.log("Brand asset verification complete.");
