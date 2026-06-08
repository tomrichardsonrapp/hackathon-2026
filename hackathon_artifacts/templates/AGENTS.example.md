# AGENTS.md

## Project Purpose

This repository contains a short AI/Codex hackathon prototype. Optimize for clarity, demoability, and learning. Prefer small, working slices over broad unfinished systems.

## Working Agreements

- Read the relevant files before proposing changes.
- Explain material assumptions before implementing.
- Keep edits scoped to the user's request.
- Do not overwrite user work or revert unrelated changes.
- Prefer existing project patterns over new abstractions.
- Ask before adding production dependencies or using external services.

## Project Structure

- `hackathon_artifacts/`: participant-facing briefs and guides.
- `data/`: canonical synthetic data shared by all teams.
- `outputs/`: generated workbook and presentation artifacts.
- `brand_assets/`: optional visual identity and prototype assets.
- `docs/adr/`: architecture decision records.
- `docs/architecture.md`: current architecture and system overview.

## Build And Verification

- If code changes are made, run the most relevant local check before finishing.
- If data generation changes, regenerate the CSV and workbook outputs.
- If presentation or visual assets change, render or preview them before delivery.
- If a command cannot be run, explain why and what risk remains.

## Git Expectations

- Work on a branch for meaningful changes.
- Check `git status` before and after edits.
- Review `git diff` before summarizing work.
- Commit focused, reviewable changes.
- Do not use destructive git commands unless the user explicitly asks.

## Documentation Codex Should Maintain

- Update `docs/architecture.md` when the shape of the solution changes.
- Add or update an ADR in `docs/adr/` for decisions that affect architecture, data flow, dependencies, privacy boundaries, or operating model.
- Update this `AGENTS.md` when repeated feedback becomes a durable team rule.

## Domain Constraints

- Keep customer data synthetic.
- Do not introduce sensitive health data, diagnoses, biometrics, medical claims, or treatment recommendations.
- Keep copy editable in source files rather than embedded in generated images.

## Final Response Expectations

- Summarize what changed.
- Link to the most important files.
- State what verification was completed.
- State any remaining risks or checks that were not run.
