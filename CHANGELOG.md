# Changelog

All notable changes to this project. Format: Keep a Changelog 1.1.
Versions follow Semantic Versioning.

## [Unreleased]

### Changed
- 2026-11-08: Restructured to the portfolio standard v2. README is the
  abstract (question, headline, field, verdict, reproduce, lifecycle,
  layout). PROPOSAL.md (draft, not locked) replaces SPEC.md,
  DOSSIER.md, NOVELTY.md, level-2-build/BUILD-SPEC.md and the
  level-3-deep scaffold. REPORT.md replaces the Learn and Build
  write-ups, docs/research-review.md and docs/index.md. Code moved to
  src/, the records and the link re-check to experiments/ (dated), the
  results to results/; all three results files are byte-identical to
  before the move. Verdict: Draft, not pre-registered (the running
  chain has never run). Self-assigned grades removed from every public
  file, the dashboard included; the dashboard now shows the lifecycle
  and verdict from README.md. Two decision records added. CI re-runs
  both runners and fails if results/ changes; CodeQL covers the
  dashboard's JavaScript; Dependabot watches site/.

### Added
- 2026-11-07: Proof-link re-check (src/verify_links.py) and its output:
  28 of 28 release links resolve; P06's latest release is v1.2.
- 2026-11-07: Primary-project-only coverage rule as a sensitivity
  result: 5 of 6 layers, network fails.
- 2026-11-07: Live dashboard in site/ with a JavaScript port of the
  chain checker and a build-time parity check; Pages workflow.
- 2026-11-07: Research review: hypotheses made explicit, related work,
  threats, open gaps (now in PROPOSAL.md and REPORT.md).
- 2026-11-06: Fan-out drafts in fanout/ and the channel log
  PUBLICITY.md; nothing posted.
- 2026-11-06: CI on Python 3.11 and 3.12 with ruff, CodeQL, Dependabot,
  release, labeler, greetings and stale workflows.

## [0.5] - 2026-11-06

### Added
- Records-chain Build: fleet architecture in 6 node groups, a
  defensive security posture from P24, P13 and P20, and 5 worked
  layer-pair chains, all passing the both-sides v1.0 check with the
  network side partial on P23. No live deployment.

## [0.1] - 2026-11-06

### Added
- Learn: 29 deployment records (26 at v1.0), a standard-library
  validator and chain checker, 0 validation errors, 6 of 6 layers
  covered under the repo rule.

## [0.0] - 2026-11-04

### Added
- Wave 0 scaffold: SPEC.md, DOSSIER.md v1, NOVELTY.md draft, level
  folders, smoke test, CI.
