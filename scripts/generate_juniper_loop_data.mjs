import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = process.cwd();
const dataDir = path.join(root, "data");
const outputDir = path.join(root, "outputs");
const workbookPath = path.join(outputDir, "juniper_loop_data_pack.xlsx");
const anchorDate = new Date("2026-06-07T00:00:00Z");

await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });

let seed = 84;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}

function pick(values) {
  return values[Math.floor(rand() * values.length)];
}

function weighted(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let threshold = rand() * total;
  for (const item of items) {
    threshold -= item.weight;
    if (threshold <= 0) return item.value;
  }
  return items.at(-1).value;
}

function daysAgo(days) {
  const date = new Date(anchorDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function money(value) {
  return Number(value.toFixed(2));
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function writeCsv(fileName, rows) {
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  await fs.writeFile(path.join(dataDir, fileName), `${lines.join("\n")}\n`, "utf8");
}

function columnName(n) {
  let name = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

const firstNames = [
  "Avery", "Jordan", "Morgan", "Taylor", "Riley", "Casey", "Quinn", "Jamie", "Drew", "Reese",
  "Cameron", "Harper", "Parker", "Rowan", "Skyler", "Emerson", "Finley", "Kendall", "Logan", "Sage"
];
const regions = ["Northeast", "Southeast", "Midwest", "Southwest", "West", "Pacific Northwest"];
const interests = ["Move", "Mindful", "Nourish", "Rest", "Organize", "Connect"];
const formats = ["Article", "Audio", "Video", "Checklist", "Live Session", "Community Prompt"];
const tones = ["Calm", "Practical", "Social", "Guided"];
const channels = ["Email", "SMS", "App Push", "In App", "Web"];
const lifecycleStages = ["Prospect", "New", "Building", "Established", "Slipping", "Dormant"];

const contentCatalog = [
  ["CNT-001", "A two-minute morning reset", "Audio", "Mindful", 2, "Calm", "New"],
  ["CNT-002", "Build a simple stretch loop", "Video", "Move", 6, "Guided", "Building"],
  ["CNT-003", "Make tomorrow easier tonight", "Checklist", "Organize", 4, "Practical", "New"],
  ["CNT-004", "Low-lift lunch ideas", "Article", "Nourish", 5, "Practical", "Building"],
  ["CNT-005", "Wind down without overplanning", "Audio", "Rest", 7, "Calm", "Slipping"],
  ["CNT-006", "Share one small win", "Community Prompt", "Connect", 3, "Social", "Established"],
  ["CNT-007", "Reset a paused routine", "Checklist", "Organize", 5, "Practical", "Dormant"],
  ["CNT-008", "Weekend walk starter", "Video", "Move", 8, "Guided", "Prospect"],
  ["CNT-009", "Tiny rituals live session", "Live Session", "Mindful", 20, "Guided", "Established"],
  ["CNT-010", "Create a calmer grocery list", "Article", "Nourish", 6, "Practical", "Building"]
].map((row) => ({
  content_id: row[0],
  title: row[1],
  format: row[2],
  habit_interest: row[3],
  estimated_minutes: row[4],
  tone: row[5],
  lifecycle_fit: row[6]
}));

const productCatalog = [
  ["PRD-001", "Morning Loop Journal", "Journal", "Organize", 18, "Starter"],
  ["PRD-002", "Desk Stretch Band", "Accessory", "Move", 16, "Support"],
  ["PRD-003", "Hydration Cue Bottle", "Accessory", "Nourish", 24, "Support"],
  ["PRD-004", "Evening Reset Kit", "Kit", "Rest", 34, "Deepen"],
  ["PRD-005", "Community Challenge Pass", "Digital", "Connect", 8, "Deepen"],
  ["PRD-006", "Mindful Minutes Audio Pack", "Digital", "Mindful", 12, "Starter"],
  ["PRD-007", "Routine Builder Bundle", "Bundle", "Organize", 42, "Gift"],
  ["PRD-008", "Travel Rhythm Kit", "Kit", "Move", 38, "Support"]
].map((row) => ({
  product_id: row[0],
  product_name: row[1],
  product_type: row[2],
  routine_context: row[3],
  price: row[4],
  commerce_role: row[5]
}));

const members = Array.from({ length: 300 }, (_, index) => {
  const memberNumber = String(index + 1).padStart(4, "0");
  const lifecycle_stage = weighted([
    { value: "Prospect", weight: 12 },
    { value: "New", weight: 18 },
    { value: "Building", weight: 28 },
    { value: "Established", weight: 18 },
    { value: "Slipping", weight: 16 },
    { value: "Dormant", weight: 8 }
  ]);
  const membership_status =
    lifecycle_stage === "Prospect" ? "Prospect" :
    lifecycle_stage === "Dormant" ? weighted([{ value: "Canceled", weight: 60 }, { value: "Paused", weight: 40 }]) :
    lifecycle_stage === "New" ? weighted([{ value: "Trial", weight: 48 }, { value: "Active", weight: 52 }]) :
    weighted([{ value: "Active", weight: 76 }, { value: "Paused", weight: 14 }, { value: "Canceled", weight: 5 }, { value: "Trial", weight: 5 }]);
  const days_since_join = Math.floor(weighted([
    { value: 7 + rand() * 24, weight: lifecycle_stage === "New" ? 50 : 10 },
    { value: 31 + rand() * 90, weight: 28 },
    { value: 121 + rand() * 180, weight: 32 },
    { value: 301 + rand() * 420, weight: lifecycle_stage === "Established" ? 38 : 22 }
  ]));
  const primary = pick(interests);
  let secondary = pick(interests);
  if (secondary === primary) secondary = pick(interests.filter((interest) => interest !== primary));
  const viewsBase = lifecycle_stage === "Established" ? 18 : lifecycle_stage === "Building" ? 12 : lifecycle_stage === "Dormant" ? 1 : 7;
  const monthly_content_views = Math.max(0, Math.round(viewsBase + rand() * 14 - (lifecycle_stage === "Slipping" ? 4 : 0)));
  const routine_starts_90d = Math.max(0, Math.round(monthly_content_views * (0.28 + rand() * 0.38)));
  const routine_completions_90d = Math.max(0, Math.round(routine_starts_90d * (0.25 + rand() * 0.55)));
  const community_actions_90d = Math.max(0, Math.round(rand() * (lifecycle_stage === "Established" ? 12 : 5)));
  const shop_orders_12m = Math.max(0, Math.round(rand() * (lifecycle_stage === "Established" ? 5 : 3)));
  const relationship_signal = Math.min(98, Math.max(4, Math.round(
    monthly_content_views * 2.2 + routine_completions_90d * 4 + community_actions_90d * 2 + shop_orders_12m * 5 + rand() * 18
  )));

  return {
    member_id: `JL-${memberNumber}`,
    first_name: pick(firstNames),
    region: pick(regions),
    membership_status,
    lifecycle_stage,
    plan_type: membership_status === "Prospect" ? "Free" : membership_status === "Canceled" ? "Free" : weighted([
      { value: "Monthly", weight: 44 },
      { value: "Annual", weight: 28 },
      { value: "Free", weight: 18 },
      { value: "Shop Only", weight: 10 }
    ]),
    join_date: daysAgo(days_since_join),
    days_since_join,
    primary_habit_interest: primary,
    secondary_habit_interest: secondary,
    preferred_content_format: pick(formats),
    preferred_channel: weighted([
      { value: "Email", weight: 32 },
      { value: "App Push", weight: 30 },
      { value: "In App", weight: 22 },
      { value: "SMS", weight: 8 },
      { value: "Web", weight: 8 }
    ]),
    monthly_content_views,
    routine_starts_90d,
    routine_completions_90d,
    community_actions_90d,
    shop_orders_12m,
    average_order_value: money(16 + rand() * 52),
    relationship_signal
  };
});

const preferencesConsent = members.map((member) => ({
  member_id: member.member_id,
  email_permission: rand() > 0.08,
  sms_permission: rand() > 0.72,
  app_push_permission: rand() > 0.36,
  quiet_hours_preference: pick(["Morning", "Afternoon", "Evening", "No Preference"]),
  message_tone_preference: weighted([
    { value: "Calm", weight: 34 },
    { value: "Practical", weight: 34 },
    { value: "Guided", weight: 18 },
    { value: "Social", weight: 14 }
  ]),
  reminder_frequency_preference: weighted([
    { value: "Low", weight: 36 },
    { value: "Medium", weight: 48 },
    { value: "High", weight: 16 }
  ]),
  commerce_interest_level: member.shop_orders_12m > 2 ? "High" : member.shop_orders_12m > 0 ? "Medium" : weighted([{ value: "Low", weight: 55 }, { value: "Medium", weight: 35 }, { value: "High", weight: 10 }]),
  community_interest_level: member.community_actions_90d > 5 ? "High" : member.community_actions_90d > 0 ? "Medium" : weighted([{ value: "Low", weight: 50 }, { value: "Medium", weight: 38 }, { value: "High", weight: 12 }])
}));

const membershipEvents = [];
let membershipCounter = 1;
for (const member of members) {
  const eventCount = Math.max(1, Math.round(1 + rand() * 5 + member.routine_starts_90d / 3));
  membershipEvents.push({
    event_id: `ME-${String(membershipCounter).padStart(6, "0")}`,
    member_id: member.member_id,
    event_date: member.join_date,
    event_type: member.membership_status === "Prospect" ? "Preference Updated" : member.membership_status === "Trial" ? "Trial Started" : "Plan Started",
    source: pick(["App", "Web", "Email"]),
    related_habit_interest: member.primary_habit_interest
  });
  membershipCounter += 1;
  for (let i = 0; i < eventCount; i += 1) {
    membershipEvents.push({
      event_id: `ME-${String(membershipCounter).padStart(6, "0")}`,
      member_id: member.member_id,
      event_date: daysAgo(Math.floor(rand() * Math.max(2, member.days_since_join))),
      event_type: weighted([
        { value: "Routine Started", weight: 34 },
        { value: "Routine Completed", weight: 24 },
        { value: "Preference Updated", weight: 14 },
        { value: "Community Joined", weight: 10 },
        { value: "Plan Renewed", weight: member.membership_status === "Active" ? 14 : 2 },
        { value: "Plan Paused", weight: member.membership_status === "Paused" ? 12 : 2 },
        { value: "Plan Canceled", weight: member.membership_status === "Canceled" ? 12 : 1 }
      ]),
      source: pick(["App", "Web", "Email", "SMS", "App Push", "Support"]),
      related_habit_interest: rand() < 0.72 ? member.primary_habit_interest : member.secondary_habit_interest
    });
    membershipCounter += 1;
  }
}

const contentInteractions = [];
let contentCounter = 1;
for (const member of members) {
  const interactions = Math.max(1, Math.round(member.monthly_content_views * (0.6 + rand() * 1.8)));
  for (let i = 0; i < interactions; i += 1) {
    const likelyContent = contentCatalog.filter((content) =>
      content.habit_interest === member.primary_habit_interest || content.habit_interest === member.secondary_habit_interest
    );
    const content = rand() < 0.75 ? pick(likelyContent) : pick(contentCatalog);
    contentInteractions.push({
      interaction_id: `CI-${String(contentCounter).padStart(6, "0")}`,
      member_id: member.member_id,
      content_id: content.content_id,
      interaction_date: daysAgo(Math.floor(rand() * 120)),
      interaction_type: weighted([
        { value: "View", weight: 42 },
        { value: "Save", weight: 16 },
        { value: "Complete", weight: 22 },
        { value: "Share", weight: 5 },
        { value: "Dismiss", weight: 7 },
        { value: "Search", weight: 8 }
      ]),
      session_context: pick(["Morning", "Midday", "Evening", "Weekend", "Unknown"]),
      engagement_depth: Math.max(1, Math.min(5, Math.round(1 + rand() * 4)))
    });
    contentCounter += 1;
  }
}

const commerceEvents = [];
let commerceCounter = 1;
for (const member of members) {
  const commerceCount = Math.max(0, Math.round(member.shop_orders_12m * 2 + rand() * 4));
  for (let i = 0; i < commerceCount; i += 1) {
    const likelyProducts = productCatalog.filter((product) =>
      product.routine_context === member.primary_habit_interest || product.routine_context === member.secondary_habit_interest
    );
    const product = rand() < 0.68 && likelyProducts.length > 0 ? pick(likelyProducts) : pick(productCatalog);
    const eventType = weighted([
      { value: "Product View", weight: 38 },
      { value: "Bundle Viewed", weight: 18 },
      { value: "Add To Cart", weight: 16 },
      { value: "Purchase", weight: 24 },
      { value: "Return", weight: 4 }
    ]);
    commerceEvents.push({
      commerce_event_id: `CE-${String(commerceCounter).padStart(6, "0")}`,
      member_id: member.member_id,
      event_date: daysAgo(Math.floor(rand() * 365)),
      event_type: eventType,
      product_id: product.product_id,
      net_revenue: eventType === "Purchase" ? money(product.price * (0.9 + rand() * 0.35)) : eventType === "Return" ? money(-product.price) : 0,
      routine_context: product.routine_context
    });
    commerceCounter += 1;
  }
}

const campaigns = [
  ["CMP-2001", "Find Your First Loop", "Onboarding"],
  ["CMP-2002", "Three-Minute Reset", "Education"],
  ["CMP-2003", "Weekend Routine Lab", "Building"],
  ["CMP-2004", "Community Small Wins", "Community"],
  ["CMP-2005", "Routine Kit Discovery", "Commerce"],
  ["CMP-2006", "A Gentle Way Back", "Reconnect"]
];

const campaignInteractions = [];
let campaignCounter = 1;
for (const member of members) {
  const touches = Math.round(3 + rand() * 9);
  for (let i = 0; i < touches; i += 1) {
    const campaign = pick(campaigns);
    const channel = member.preferred_channel === "Web" ? pick(["Email", "In App", "Web"]) : weighted([
      { value: member.preferred_channel, weight: 42 },
      { value: "Email", weight: 24 },
      { value: "App Push", weight: 22 },
      { value: "In App", weight: 12 }
    ]);
    campaignInteractions.push({
      campaign_event_id: `CA-${String(campaignCounter).padStart(6, "0")}`,
      member_id: member.member_id,
      campaign_id: campaign[0],
      event_date: daysAgo(Math.floor(rand() * 180)),
      channel,
      event_type: weighted([
        { value: "Sent", weight: 48 },
        { value: "Open", weight: 22 },
        { value: "Click", weight: 12 },
        { value: "Dismiss", weight: 8 },
        { value: "Preference Updated", weight: 5 },
        { value: "Conversion", weight: 4 },
        { value: "Unsubscribe", weight: 1 }
      ]),
      journey_stage: campaign[2]
    });
    campaignCounter += 1;
  }
}

await writeCsv("member_profile.csv", members);
await writeCsv("preferences_consent.csv", preferencesConsent);
await writeCsv("membership_events.csv", membershipEvents);
await writeCsv("content_interactions.csv", contentInteractions);
await writeCsv("commerce_events.csv", commerceEvents);
await writeCsv("campaign_interactions.csv", campaignInteractions);
await writeCsv("content_catalog.csv", contentCatalog);
await writeCsv("product_catalog.csv", productCatalog);

const workbook = Workbook.create();

function addSheet(name, rows) {
  const sheet = workbook.worksheets.add(name);
  const headers = Object.keys(rows[0]);
  const values = [headers, ...rows.map((row) => headers.map((header) => row[header]))];
  const endColumn = columnName(headers.length);
  sheet.getRange(`A1:${endColumn}${values.length}`).values = values;
  try {
    sheet.freezePanes = { rows: 1 };
  } catch {}
  return sheet;
}

const summaryRows = [
  { metric: "Scenario", value: "Juniper Loop lifecycle growth sandbox" },
  { metric: "Anchor date", value: "2026-06-07" },
  { metric: "Members", value: members.length },
  { metric: "Preference records", value: preferencesConsent.length },
  { metric: "Membership events", value: membershipEvents.length },
  { metric: "Content interactions", value: contentInteractions.length },
  { metric: "Commerce events", value: commerceEvents.length },
  { metric: "Campaign interactions", value: campaignInteractions.length },
  { metric: "Primary challenge", value: "Build more meaningful, sustained customer relationships across the wellness lifecycle." }
];

addSheet("Summary", summaryRows);
addSheet("Member Profile", members);
addSheet("Preferences Consent", preferencesConsent);
addSheet("Membership Events", membershipEvents);
addSheet("Content Interactions", contentInteractions);
addSheet("Commerce Events", commerceEvents);
addSheet("Campaign Interactions", campaignInteractions);
addSheet("Content Catalog", contentCatalog);
addSheet("Product Catalog", productCatalog);

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);

console.log(JSON.stringify({
  members: members.length,
  membership_events: membershipEvents.length,
  content_interactions: contentInteractions.length,
  commerce_events: commerceEvents.length,
  campaign_interactions: campaignInteractions.length,
  workbook: workbookPath
}, null, 2));
