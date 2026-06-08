# Juniper Loop AI/Codex Hackathon Pack

This repository contains a ready-to-share artifact pack for a same-week AI/Codex hackathon. The fictional client is **Juniper Loop**, an everyday-habits membership app and commerce brand focused on onboarding, engagement, habit formation, content discovery, commerce, community, and retention.

The challenge is intentionally open-ended: teams can create an app, workflow, agent, data exploration, campaign concept, creative system, strategy prototype, measurement approach, or what else they come up with that helps Juniper Loop build more meaningful, sustained customer relationships.

## Challenge Prompt

Use AI/Codex to create something that helps Juniper Loop build more meaningful, sustained customer relationships across the wellness lifecycle.

## What Is Included

| Path | Purpose |
| --- | --- |
| `hackathon_artifacts/01_challenge_brief.md` | Participant-facing challenge and demo expectations. |
| `hackathon_artifacts/02_client_brief.md` | Fictional client context, audience, business situation, and boundaries. |
| `hackathon_artifacts/03_brand_kit.md` | Lightweight brand voice, sample copy, and creative guardrails. |
| `hackathon_artifacts/04_data_dictionary.md` | Schema definitions for the synthetic data pack. |
| `hackathon_artifacts/05_working_with_codex.md` | Guide for collaborating with Codex, using Git, and maintaining ADRs/architecture notes. |
| `hackathon_artifacts/templates/` | Starter `AGENTS.md`, ADR, and architecture templates. |
| `hackathon_artifacts/juniper_loop_team_submission_scaffold.pptx` | Simple team presentation scaffold for Monday demos. |
| `data/` | Canonical synthetic CSV data for all teams. |
| `outputs/juniper_loop_data_pack.xlsx` | Workbook version of the synthetic data. |
| `brand_assets/` | Optional Juniper Loop logos, CSS tokens, editable templates, and image assets. |
| `scripts/` | Regeneration and verification scripts for data, brand assets, and presentation scaffold. |
| `hackathon-plan-and-artifacts.zip` | Shareable bundle containing the participant artifacts. |

## Recommended Team Flow

1. Read the challenge brief and client brief.
2. Pick an opportunity area across the Juniper Loop lifecycle.
3. Use the shared data, brand assets, and Codex collaboration guide as optional starting points.
4. Build a working demo, prototype, analysis, workflow, or concept.
5. Use the PowerPoint scaffold to tell the story: what the team created, what opportunity it addresses, how AI/Codex shaped the work, and what would come next.

## Privacy And Safety Boundary

Juniper Loop is an everyday wellness scenario, not a healthcare or clinical scenario. Teams should avoid:

- Sensitive health data.
- Diagnoses.
- Biometrics.
- Medical claims.
- Treatment recommendations.
- Real customer data.

All provided data is synthetic.

## Using Codex Effectively

Teams should review `hackathon_artifacts/05_working_with_codex.md` before building. It includes:

- Prompting patterns for collaborative work.
- An example `AGENTS.md`.
- A Git workflow and cheatsheet.
- ADR and architecture documentation templates.
- End-of-session practices for keeping work reviewable.

The companion templates in `hackathon_artifacts/templates/` can be copied into a team prototype repo.

## Regenerating Artifacts

This project uses local Node scripts. The scripts assume dependencies are available in the workspace environment.

Regenerate synthetic data:

```bash
node scripts/generate_juniper_loop_data.mjs
```

Regenerate brand imagery:

```bash
node scripts/generate_brand_asset_images.mjs
```

Verify brand assets:

```bash
node scripts/verify_brand_assets.mjs
```

Regenerate the presentation scaffold:

```bash
node scripts/generate_submission_scaffold.mjs
```

Rebuild the shareable ZIP:

```bash
zip -r -X hackathon-plan-and-artifacts.zip hackathon_artifacts data outputs brand_assets scripts README.md .gitignore -x '*/.DS_Store' -x 'outputs/submission_scaffold_preview/*' -x 'outputs/submission_scaffold_contact_sheet.png'
```

## Suggested Git Practice

Use Git as the safety rail for fast AI-assisted work:

```bash
git status
git switch -c codex/team-idea
git diff
git add path/to/files
git commit -m "Describe the focused change"
```

Review Codex-generated changes before committing. Keep commits focused so the project history tells a useful story.

## Notes For Organizers

- The pack intentionally avoids a scoring rubric. Leadership judging can remain subjective and discussion-led.
- The brand kit is optional, not a required design system.
- The data pack is designed to create a shared client world without forcing teams into the same solution.
- The presentation scaffold is intentionally simple so different kinds of teams can tell their story in their own way.
