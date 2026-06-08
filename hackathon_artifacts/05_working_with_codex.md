# Working Collaboratively With Codex

This guide is a practical operating model for teams using Codex on a shared project. It is written for mixed teams where some people may be driving strategy, data, creative, product thinking, or code.

The goal is not to make Codex "do the project." The goal is to use Codex as a capable teammate that can explore, build, test, document, and review while humans keep ownership of judgment, direction, and final decisions.

Starter templates are also included in `templates/AGENTS.example.md`, `templates/adr-template.md`, and `templates/architecture-template.md`.

## The Basic Working Model

Use Codex in short collaboration loops:

1. Frame the work.
2. Give Codex the right context.
3. Let Codex inspect the project before changing files.
4. Ask for a plan when the work is ambiguous.
5. Let Codex implement a small slice.
6. Review the diff.
7. Run checks.
8. Commit the work.
9. Ask Codex to update project memory: `AGENTS.md`, ADRs, and architecture notes.

The best teams do not treat Codex like a magic prompt box. They treat it like a teammate who needs context, boundaries, feedback, and a shared source of truth.

## How To Prompt Codex

A strong prompt usually includes four things:

- `Goal`: what you want changed or created.
- `Context`: files, folders, examples, data, designs, errors, or constraints that matter.
- `Constraints`: what Codex should preserve, avoid, or follow.
- `Done when`: how the team will know the work is complete.

Example:

```text
Goal: Build a first-pass lifecycle dashboard using the provided Juniper Loop data.

Context: Use the CSV files in data/. Keep the experience lightweight enough to demo on Monday. The audience is leadership, not engineers.

Constraints: Do not add external paid services. Keep privacy boundaries clear: no health diagnoses, medical claims, biometrics, or treatment advice.

Done when: The app runs locally, shows at least three useful lifecycle insights, and includes a short README explaining how to demo it.
```

For vague ideas, ask Codex to interview you first:

```text
Before implementing, ask me up to five questions that would help turn this idea into a focused prototype.
```

For bigger work, ask for a plan before implementation:

```text
Inspect the repository and propose a concise implementation plan. Do not edit files yet.
```

For review:

```text
Review the current diff for bugs, unclear behavior, missing tests, and places where the implementation does not match our project guidance.
```

## What Belongs In AGENTS.md

`AGENTS.md` is the project guidance file Codex reads before doing work. Use it for durable instructions that should apply across sessions, not for one-off task details.

Good content for `AGENTS.md`:

- Project purpose and audience.
- Important folders and files.
- Build, run, test, and lint commands.
- Data, privacy, brand, or domain constraints.
- Review expectations.
- Documentation that Codex should maintain.
- Things Codex should never do without permission.

Keep it short. If it grows too large, link to separate docs such as `docs/architecture.md`, `docs/code_review.md`, or `docs/adr/`.

## Example AGENTS.md

```md
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
```

## Why Git Matters When Working With Codex

Git is the collaboration safety net. It lets the team move quickly without losing track of what changed, why it changed, and whether a change can be safely backed out.

With Codex, Git becomes even more important because the agent can make many edits quickly. A clean Git workflow lets humans review each change, compare alternatives, and preserve decisions.

Use Git to:

- Protect working code before experiments.
- Separate unrelated ideas into different branches or commits.
- Review Codex changes before accepting them.
- Revert a specific commit if a path does not work.
- Preserve the story of the project for presentation and handoff.

## Recommended Git Flow

1. Start clean.

```bash
git status
```

2. Create a branch for the team idea.

```bash
git switch -c codex/team-lifecycle-dashboard
```

3. Ask Codex to work in small slices.

```text
Implement the first slice only: load the member profile CSV and show one summary view. Stop after verification.
```

4. Review changes.

```bash
git diff
git status
```

5. Commit a focused unit of work.

```bash
git add path/to/files
git commit -m "Add lifecycle dashboard data loader"
```

6. Repeat with the next slice.

## Git Cheatsheet

Inspect state:

```bash
git status
git diff
git diff --staged
git log --oneline --decorate --graph -10
```

Create and move between branches:

```bash
git branch
git switch -c codex/my-feature
git switch main
git switch codex/my-feature
```

Stage intentionally:

```bash
git add path/to/file
git add path/to/folder
git restore --staged path/to/file
```

Commit:

```bash
git commit -m "Describe the change"
git commit --amend
```

Compare branches:

```bash
git diff main...HEAD
git log main..HEAD --oneline
```

Temporarily set work aside:

```bash
git stash push -m "WIP dashboard experiment"
git stash list
git stash pop
```

Undo safely:

```bash
git restore path/to/file
git revert <commit-sha>
```

Use extra care with these commands:

```bash
git reset --hard
git clean -fd
git push --force
```

Only use destructive commands when the team explicitly agrees.

## ADRs: Architecture Decision Records

An ADR is a short document that captures an important decision. It should explain the context, the decision, alternatives considered, and consequences.

ADRs are useful with Codex because they prevent the same debate from happening repeatedly. They also give Codex better context in future sessions.

Create an ADR when the team chooses:

- A framework, library, or external service.
- A data model or data transformation pattern.
- A privacy, consent, or governance boundary.
- A major UX or workflow direction.
- A deployment or demo strategy.
- A tradeoff that future teammates may question.

Suggested folder:

```text
docs/adr/
```

Suggested naming:

```text
docs/adr/0001-use-local-csv-data.md
docs/adr/0002-keep-prototype-client-only.md
```

ADR template:

```md
# ADR 0001: Short Decision Title

## Status

Proposed | Accepted | Superseded

## Date

YYYY-MM-DD

## Context

What situation, constraint, or problem led to this decision?

## Decision

What did the team decide?

## Alternatives Considered

- Option A: why it was considered.
- Option B: why it was not chosen.

## Consequences

- Positive outcomes.
- Tradeoffs.
- Follow-up work.

## Codex Notes

What should Codex remember when making future changes related to this decision?
```

Prompt Codex to maintain ADRs:

```text
Review the current changes and tell me whether any decision deserves an ADR. If yes, draft the ADR in docs/adr/ and keep it concise.
```

## Architecture Document

The architecture document is the living map of how the project works. It should be short enough to read quickly and current enough that Codex can rely on it.

Suggested file:

```text
docs/architecture.md
```

Recommended sections:

```md
# Architecture

## Purpose

What this project is for and who it serves.

## Current Shape

Brief description of the app, workflow, analysis, or prototype.

## Key Components

- Component or folder: what it does.
- Component or folder: what it does.

## Data Flow

Where data enters, how it is transformed, and where outputs are created.

## External Dependencies

Libraries, services, APIs, or tools the project relies on.

## Privacy And Safety Boundaries

Data or behavior the project must avoid.

## How To Run

Commands needed to run, test, render, or regenerate the project.

## Known Gaps

Important limitations or follow-up work.
```

Prompt Codex to maintain the architecture document:

```text
After this change, update docs/architecture.md so it reflects the current system. Keep it concise and remove stale statements.
```

## What Humans Should Own

Codex can generate options, implement prototypes, and maintain documentation, but humans should own:

- The problem being solved.
- What tradeoffs are acceptable.
- Whether outputs are true, appropriate, and useful.
- Privacy, compliance, and brand judgment.
- Final demo story and business interpretation.

## What Codex Should Own

Codex is especially useful for:

- Reading unfamiliar code or data quickly.
- Creating first drafts of artifacts.
- Generating and refactoring code.
- Writing tests and validation scripts.
- Running checks and summarizing failures.
- Reviewing diffs for regressions.
- Maintaining ADRs, architecture docs, and project instructions.

## End-Of-Session Checklist

Before stopping a work session, ask Codex to help close the loop:

```text
Please do an end-of-session pass:
1. Show current git status.
2. Summarize what changed.
3. Identify uncommitted work.
4. Confirm what checks passed or were not run.
5. Recommend any AGENTS.md, ADR, or architecture updates.
```

The habit matters. A team that keeps its Git history, ADRs, architecture notes, and `AGENTS.md` current will get better Codex output as the project evolves.

## Official Codex References

- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Codex best practices](https://developers.openai.com/codex/learn/best-practices)
- [Codex customization](https://developers.openai.com/codex/concepts/customization)
