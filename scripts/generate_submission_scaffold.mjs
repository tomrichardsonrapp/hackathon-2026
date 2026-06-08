import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const previewDir = path.join(outputDir, "submission_scaffold_preview");
const outputPath = path.join(outputDir, "juniper_loop_team_submission_scaffold.pptx");
const slideSize = { width: 1280, height: 720 };

await fs.mkdir(outputDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const C = {
  juniper: "#245447",
  sprout: "#8FBF7F",
  mist: "#DCEBE5",
  oat: "#F4EADC",
  sunlit: "#E9B66D",
  plum: "#5F4B66",
  ink: "#20231F",
  cloud: "#FBFAF7",
  stone: "#D8D0C3",
  white: "#FFFFFF",
};

const deck = Presentation.create({ slideSize });

function rect(slide, x, y, w, h, fill = C.cloud, line = "transparent", geometry = "rect") {
  return slide.shapes.add({
    geometry,
    position: { left: x, top: y, width: w, height: h },
    fill: { type: "solid", color: fill },
    line: { style: "solid", fill: line, width: line === "transparent" ? 0 : 1.3 },
  });
}

function text(slide, value, x, y, w, h, opts = {}) {
  const shape = rect(slide, x, y, w, h, opts.fill ?? "transparent", opts.line ?? "transparent", "rect");
  shape.text.style = {
    typeface: opts.typeface ?? "Avenir Next",
    fontSize: opts.size ?? 22,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
  };
  shape.text = value;
  return shape;
}

function footer(slide, n) {
  text(slide, "Juniper Loop AI Hackathon", 64, 666, 360, 22, { size: 12, color: C.plum });
  text(slide, String(n).padStart(2, "0"), 1160, 662, 48, 28, { size: 13, color: C.plum, bold: true, align: "right" });
  rect(slide, 64, 646, 1090, 1.5, C.stone);
}

function brandMark(slide, x = 64, y = 48) {
  rect(slide, x, y, 42, 42, C.juniper, C.juniper, "roundRect");
  const loop = rect(slide, x + 9, y + 9, 24, 24, C.juniper, C.oat, "ellipse");
  const leaf = rect(slide, x + 17, y + 20, 18, 10, C.sprout, C.sprout, "ellipse");
  return { loop, leaf };
}

function titleSlide(title, subtitle, number, kicker = "Team results presentation") {
  const slide = deck.slides.add();
  slide.background.fill = { type: "solid", color: C.cloud };
  rect(slide, 0, 0, 1280, 720, C.cloud);
  rect(slide, 0, 0, 1280, 130, C.mist);
  rect(slide, 0, 540, 1280, 180, C.oat);
  brandMark(slide, 72, 58);
  text(slide, "Juniper Loop", 126, 58, 300, 36, { size: 22, bold: true, color: C.juniper });
  text(slide, kicker, 72, 204, 540, 26, { size: 15, bold: true, color: C.plum });
  text(slide, title, 72, 242, 760, 154, { size: 56, bold: true, color: C.juniper, typeface: "Iowan Old Style" });
  text(slide, subtitle, 76, 424, 580, 46, { size: 21, color: C.ink });
  rect(slide, 872, 196, 258, 258, C.juniper, C.juniper, "roundRect");
  rect(slide, 928, 252, 146, 146, C.mist, C.mist, "ellipse");
  rect(slide, 974, 300, 126, 68, C.sprout, C.sprout, "ellipse");
  text(slide, "10 minutes per team + Q&A", 790, 506, 366, 36, { size: 20, bold: true, color: C.ink, align: "center" });
  footer(slide, number);
  return slide;
}

function sectionSlide(number, title, prompt, boxes = []) {
  const slide = deck.slides.add();
  slide.background.fill = { type: "solid", color: C.cloud };
  rect(slide, 0, 0, 1280, 720, C.cloud);
  brandMark(slide, 64, 42);
  text(slide, `0${number}`, 1120, 48, 86, 34, { size: 15, bold: true, color: C.plum, align: "right" });
  text(slide, title, 64, 112, 728, 62, { size: 38, bold: true, color: C.juniper, typeface: "Iowan Old Style" });
  text(slide, prompt, 66, 180, 620, 48, { size: 18, color: C.ink });
  for (const box of boxes) {
    rect(slide, box.x, box.y, box.w, box.h, box.fill ?? C.white, box.line ?? C.stone, "roundRect");
    if (box.kicker) text(slide, box.kicker, box.x + 22, box.y + 18, box.w - 44, 20, { size: 11, bold: true, color: C.plum });
    text(slide, box.text, box.x + 22, box.y + (box.kicker ? 48 : 22), box.w - 44, box.h - (box.kicker ? 64 : 42), {
      size: box.size ?? 18,
      color: box.color ?? C.ink,
      bold: box.bold ?? false,
    });
  }
  footer(slide, number);
  return slide;
}

titleSlide(
  "AI Hackathon\nTeam Results",
  "Use this scaffold for your Monday demo + story.",
  1
);

sectionSlide(2, "Problem Statement", "How did you approach the challenge?", [
  { x: 64, y: 262, w: 342, h: 272, kicker: "Problem to solve", text: "What did you see as the opportunity or problem worth solving?" },
  { x: 454, y: 262, w: 342, h: 272, kicker: "Why it matters", text: "Why was it worth solving for members, employees, or the business?" },
  { x: 844, y: 262, w: 342, h: 272, kicker: "Assumptions", text: "What constraints, boundaries, or starting assumptions did you make?" },
]);

sectionSlide(3, "AI-First Approach Overview", "How did AI change your approach compared to traditional development?", [
  { x: 72, y: 260, w: 250, h: 230, kicker: "Where AI was used", text: "Ideation\nCoding\nValidation\nOrchestration", fill: C.mist },
  { x: 360, y: 260, w: 250, h: 230, kicker: "No longer manual", text: "What did AI help remove, compress, or reframe?", fill: C.oat },
  { x: 648, y: 260, w: 250, h: 230, kicker: "Agent patterns", text: "Any coordinator, reviewer, generator, or evaluator patterns?", fill: C.mist },
  { x: 936, y: 260, w: 250, h: 230, kicker: "Prompt examples", text: "Instead of X, we used AI to...\n\nThe key shift was...", fill: C.oat },
]);

sectionSlide(4, "Architecture / Workflow", "Show a high-level view. Diagram or bullets are both fine.", [
  { x: 64, y: 276, w: 220, h: 136, kicker: "Inputs", text: "Data\nContext\nPrompts\nAssets", fill: C.white },
  { x: 336, y: 276, w: 220, h: 136, kicker: "AI models/tools", text: "Codex\nAgents\nLLMs\nScripts", fill: C.white },
  { x: 608, y: 276, w: 220, h: 136, kicker: "Decision moments", text: "Where did logic, judgment, or routing happen?", fill: C.white },
  { x: 880, y: 276, w: 220, h: 136, kicker: "Validation", text: "Human review\nGuardrails\nQA", fill: C.white },
  { x: 128, y: 470, w: 916, h: 70, kicker: "Optional detail", text: "Prompt chains, agent roles, controller/coordinator logic, context files, or validation loops.", fill: C.mist },
]);

sectionSlide(5, "Hands-On Demo", "Optional but encouraged: live or recorded demo, 2-3 minutes max.", [
  { x: 72, y: 254, w: 652, h: 326, kicker: "Demo frame", text: "Show the interaction, not the polish.\n\nWhat is novel compared with conventional tooling?\n\nWhere did AI output influence decisions?", fill: C.white },
  { x: 784, y: 254, w: 342, h: 326, kicker: "Narration", text: "Explain why you did things, not just what happened.", fill: C.oat, size: 22, bold: true, color: C.juniper },
]);

{
  const slide = deck.slides.add();
  slide.background.fill = { type: "solid", color: C.cloud };
  rect(slide, 0, 0, 1280, 720, C.cloud);
  brandMark(slide, 64, 42);
  text(slide, "06", 1120, 48, 86, 34, { size: 15, bold: true, color: C.plum, align: "right" });
  text(slide, "Results & Metrics", 64, 112, 728, 62, { size: 38, bold: true, color: C.juniper, typeface: "Iowan Old Style" });
  text(slide, "Fill out what you can. Estimates and directional data are acceptable; emphasis is on learning.", 66, 180, 780, 48, { size: 18, color: C.ink });
  const values = [
    ["Dimension", "Traditional Approach (Baseline)", "AI-Assisted Approach", "Notes / Observations"],
    ["Time to First Working Output", "", "", ""],
    ["Iteration Speed", "", "", ""],
    ["Cognitive Load on Dev", "", "", ""],
    ["Quality Confidence", "", "", ""],
    ["Number of Re-writes", "", "", ""],
    ["Human Effort Focused On", "", "", ""],
    ["Unexpected Outcomes", "N/A", "", ""],
  ];
  const left = 64;
  const top = 252;
  const widths = [310, 255, 255, 290];
  const heights = [42, 36, 36, 36, 36, 36, 36, 48];
  let y = top;
  for (let row = 0; row < values.length; row += 1) {
    let x = left;
    for (let col = 0; col < values[row].length; col += 1) {
      const header = row === 0;
      rect(slide, x, y, widths[col], heights[row], header ? C.juniper : row % 2 === 0 ? C.cloud : C.white, C.stone);
      text(slide, values[row][col], x + 9, y + 8, widths[col] - 18, heights[row] - 12, {
        size: header ? 11 : 10.5,
        color: header ? C.white : C.ink,
        bold: header,
        fill: "transparent",
      });
      x += widths[col];
    }
    y += heights[row];
  }
  footer(slide, 6);
}

sectionSlide(7, "What We Learned", "Answer explicitly, then tie it back to engineering judgment and validation over blind trust.", [
  { x: 64, y: 250, w: 260, h: 248, kicker: "Surprised us", text: "What surprised the team?" },
  { x: 360, y: 250, w: 260, h: 248, kicker: "Wrong assumptions", text: "What did you assume that turned out to be wrong?" },
  { x: 656, y: 250, w: 260, h: 248, kicker: "AI was strong", text: "Where did AI perform better than expected?" },
  { x: 952, y: 250, w: 260, h: 248, kicker: "AI struggled", text: "Where did it need human judgment or correction?" },
]);

sectionSlide(8, "What We'd Do Next", "If this continued, what would you improve, productionize, guardrail, or scale?", [
  { x: 80, y: 250, w: 260, h: 260, kicker: "Improve", text: "What would you sharpen or simplify first?", fill: C.mist },
  { x: 374, y: 250, w: 260, h: 260, kicker: "Productionize", text: "What would need to become real infrastructure or process?", fill: C.oat },
  { x: 668, y: 250, w: 260, h: 260, kicker: "Guardrails", text: "What controls, review loops, or boundaries would you add?", fill: C.mist },
  { x: 962, y: 250, w: 260, h: 260, kicker: "Scale", text: "How could this work across teams or clients?", fill: C.oat },
]);

sectionSlide(9, "Key Takeaway", "End with one sentence that leadership should remember.", [
  { x: 116, y: 250, w: 1048, h: 166, kicker: "One sentence takeaway", text: "The biggest mindset shift for us was...", fill: C.juniper, color: C.white, size: 30, bold: true },
  { x: 164, y: 466, w: 280, h: 92, text: "This changed how we think about...", fill: C.mist },
  { x: 500, y: 466, w: 280, h: 92, text: "We would apply this next on...", fill: C.oat },
  { x: 836, y: 466, w: 280, h: 92, text: "The thing we would fund next is...", fill: C.mist },
]);

for (let index = 0; index < deck.slides.count; index += 1) {
  const slide = deck.slides.getItem(index);
  const preview = await deck.export({ slide, format: "png", scale: 1 });
  const buffer = Buffer.from(await preview.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `slide-${String(index + 1).padStart(2, "0")}.png`), buffer);
}

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(outputPath);

console.log(JSON.stringify({ outputPath, slideCount: deck.slides.count, previewDir }, null, 2));
