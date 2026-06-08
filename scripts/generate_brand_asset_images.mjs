import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imageDir = path.join(root, "brand_assets", "images");
await fs.mkdir(imageDir, { recursive: true });

function texture(seed, count = 70) {
  let value = seed;
  const next = () => {
    value = (value * 48271) % 0x7fffffff;
    return value / 0x7fffffff;
  };
  const marks = [];
  for (let index = 0; index < count; index += 1) {
    const x = Math.round(next() * 1600);
    const y = Math.round(next() * 1000);
    const opacity = (0.025 + next() * 0.055).toFixed(3);
    const radius = Math.round(1 + next() * 5);
    marks.push(`<circle cx="${x}" cy="${y}" r="${radius}" fill="#20231f" opacity="${opacity}"/>`);
  }
  return marks.join("\n");
}

function labelFreeSvg(title, content, background = "#f7f1e7") {
  return `
<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="${title}">
  <rect width="1600" height="1000" fill="${background}"/>
  ${texture(title.length * 97)}
  ${content}
</svg>`;
}

const assets = [
  {
    file: "morning-routine-setup.png",
    title: "Morning routine setup",
    svg: labelFreeSvg("Morning routine setup", `
      <path d="M0 774C246 688 440 734 672 672C922 605 1130 522 1600 604V1000H0V774Z" fill="#dcebe5"/>
      <circle cx="276" cy="332" r="132" fill="#fbfaf7"/>
      <circle cx="276" cy="332" r="72" fill="#d8d0c3"/>
      <path d="M380 318C492 288 530 392 438 440" stroke="#245447" stroke-width="24" stroke-linecap="round"/>
      <rect x="608" y="188" width="390" height="560" rx="42" fill="#245447"/>
      <path d="M676 302H930M676 416H930M676 530H930" stroke="#f4eadc" stroke-width="13" stroke-linecap="round" opacity="0.34"/>
      <rect x="1058" y="252" width="280" height="390" rx="36" fill="#e9b66d"/>
      <path d="M1108 346H1288M1108 440H1288M1108 534H1288" stroke="#fbfaf7" stroke-width="13" stroke-linecap="round" opacity="0.4"/>
      <path d="M1120 728C1192 660 1324 660 1388 740C1308 820 1178 812 1120 728Z" fill="#8fbf7f"/>
      <path d="M1172 778C1244 716 1372 730 1422 812C1348 876 1220 866 1172 778Z" fill="#5f4b66"/>
    `)
  },
  {
    file: "mindful-content-moment.png",
    title: "Mindful content moment",
    svg: labelFreeSvg("Mindful content moment", `
      <rect width="1600" height="1000" fill="#dcebe5"/>
      <path d="M0 694C240 612 456 678 704 610C932 548 1168 462 1600 536V1000H0V694Z" fill="#f4eadc"/>
      <rect x="230" y="196" width="430" height="610" rx="50" fill="#fbfaf7" stroke="#d8d0c3" stroke-width="8"/>
      <circle cx="445" cy="338" r="84" fill="#8fbf7f"/>
      <path d="M336 510H554M336 608H554" stroke="#245447" stroke-width="16" stroke-linecap="round" opacity="0.26"/>
      <rect x="752" y="264" width="470" height="330" rx="42" fill="#5f4b66"/>
      <path d="M820 382H1154M820 476H1110" stroke="#f4eadc" stroke-width="16" stroke-linecap="round" opacity="0.34"/>
      <circle cx="1260" cy="360" r="92" fill="#fbfaf7"/>
      <circle cx="1260" cy="360" r="48" fill="#e9b66d"/>
      <path d="M1032 756C1110 682 1246 690 1304 780C1222 850 1096 846 1032 756Z" fill="#245447"/>
      <path d="M890 790C958 720 1080 730 1130 810C1058 874 934 864 890 790Z" fill="#8fbf7f"/>
    `)
  },
  {
    file: "community-prompt-moment.png",
    title: "Community prompt moment",
    svg: labelFreeSvg("Community prompt moment", `
      <rect width="1600" height="1000" fill="#f4eadc"/>
      <path d="M0 722C260 638 452 704 680 642C924 576 1126 492 1600 570V1000H0V722Z" fill="#dcebe5"/>
      <circle cx="420" cy="360" r="150" fill="#8fbf7f"/>
      <circle cx="662" cy="426" r="112" fill="#e9b66d"/>
      <circle cx="914" cy="342" r="138" fill="#245447"/>
      <circle cx="1172" cy="460" r="118" fill="#5f4b66"/>
      <path d="M382 648C468 570 620 582 690 676C600 760 450 744 382 648Z" fill="#fbfaf7"/>
      <path d="M780 690C858 610 1012 620 1084 716C992 800 842 792 780 690Z" fill="#fbfaf7"/>
      <path d="M1104 730C1174 658 1304 664 1364 748C1288 820 1156 814 1104 730Z" fill="#fbfaf7"/>
      <path d="M250 820H1350" stroke="#d8d0c3" stroke-width="14" stroke-linecap="round"/>
    `)
  },
  {
    file: "commerce-routine-kit.png",
    title: "Commerce routine kit",
    svg: labelFreeSvg("Commerce routine kit", `
      <rect width="1600" height="1000" fill="#fbfaf7"/>
      <path d="M0 760C252 682 466 742 706 676C940 612 1162 530 1600 612V1000H0V760Z" fill="#f4eadc"/>
      <rect x="210" y="232" width="360" height="502" rx="44" fill="#245447"/>
      <path d="M278 338H502M278 452H502M278 566H502" stroke="#f4eadc" stroke-width="14" stroke-linecap="round" opacity="0.34"/>
      <rect x="678" y="182" width="242" height="612" rx="84" fill="#dcebe5" stroke="#245447" stroke-width="10"/>
      <path d="M724 346H874M724 470H874M724 594H874" stroke="#245447" stroke-width="13" stroke-linecap="round" opacity="0.28"/>
      <rect x="1014" y="320" width="320" height="282" rx="46" fill="#e9b66d"/>
      <path d="M1068 408H1282M1068 506H1282" stroke="#fbfaf7" stroke-width="15" stroke-linecap="round" opacity="0.44"/>
      <path d="M1050 756C1130 678 1276 686 1344 780C1256 858 1110 846 1050 756Z" fill="#8fbf7f"/>
      <path d="M862 800C930 724 1060 728 1128 810C1048 886 918 878 862 800Z" fill="#5f4b66"/>
    `)
  }
];

for (const asset of assets) {
  await sharp(Buffer.from(asset.svg)).png({ compressionLevel: 9 }).toFile(path.join(imageDir, asset.file));
  console.log(`created ${asset.file}`);
}
