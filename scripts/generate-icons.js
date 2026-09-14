const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public");

function notesSvg({ scale }) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="scribble" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FF6B9D"/>
      <stop offset="35%" stop-color="#FFB347"/>
      <stop offset="65%" stop-color="#4FD182"/>
      <stop offset="100%" stop-color="#4FB4EE"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="#FBF3E3"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <g transform="rotate(-8 230 250)">
      <rect x="120" y="140" width="220" height="220" rx="28" fill="#AEE3FF"/>
      <rect x="180" y="118" width="70" height="26" rx="6" fill="#8AD3FF" transform="rotate(-4 215 131)"/>
    </g>
    <g transform="rotate(6 320 250)">
      <rect x="200" y="150" width="220" height="220" rx="28" fill="#FFC1D9"/>
      <rect x="260" y="128" width="70" height="26" rx="6" fill="#FF9CC0" transform="rotate(3 295 141)"/>
    </g>
    <g transform="rotate(-3 256 280)">
      <rect x="160" y="180" width="230" height="230" rx="28" fill="#FFE988"/>
      <rect x="220" y="158" width="70" height="26" rx="6" fill="#FFD65C" transform="rotate(-2 255 171)"/>
      <path d="M195 300 C 225 260, 255 340, 285 300 S 345 260, 365 300" fill="none" stroke="url(#scribble)" stroke-width="14" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;
}

const targets = [
  { file: "icon-192.png", size: 192, scale: 1.15 },
  { file: "icon-512.png", size: 512, scale: 1.15 },
  { file: "apple-touch-icon.png", size: 180, scale: 1.15 },
  { file: "favicon-32.png", size: 32, scale: 1.15 },
  { file: "favicon-16.png", size: 16, scale: 1.15 },
  { file: "icon-maskable-512.png", size: 512, scale: 0.72 },
];

async function run() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const t of targets) {
    const svg = notesSvg({ scale: t.scale });
    await sharp(Buffer.from(svg))
      .resize(t.size, t.size)
      .png()
      .toFile(path.join(outDir, t.file));
    console.log("generated", t.file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
