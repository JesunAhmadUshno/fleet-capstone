# BUILD-SPEC: fleet-capstone (P25) Build

Written first, before code, per the house engineering pipeline.

## Scope (labelled records-chain scope)

Build is the capstone repo itself, per SPEC.md:

- Fleet architecture: a table built from the Learn deployment records
  (level-1-learn/records.json, reused by import, not copied), with
  projects grouped by fleet node and counts that a reader can hand
  check against records.json.
- Security posture: a summary derived from the Learn records for the
  security-relevant projects (P24 cyber-range-lab, P13 guardrails-lab,
  and P20 ml-platform-lab). Defensive only. No offensive content, no
  scenario content, and no content copied from those project repos.
- Worked chains: one worked chain record for each layer pair in the
  SPEC chain order: network to security, security to model, model to
  serving, serving to scoring, scoring to watching (5 pairs). Each
  record names its from and to layers, its from and to projects, a
  link-based interface description, and a pass or fail check that both
  sides have at least one v1.0 record. Interfaces link into the project
  repos (their v1.0 release proof links) instead of copying content.
- The network to security pair must name P23 partial honestly: the
  network side is covered by P20 at v1.0, while P23 itself is at Learn
  only (Build blocked on the R610 capture).

## What Build is not

- No live deployment is run by this level. No chain is executed end to
  end with data moving between projects.
- The capstone assembly and the full chain demo are Deep scope, stay
  scheduled 2026-12-28 to 2026-12-30, and are not claimed here.
- This is a records chain, not a running chain. The grade names that
  as its largest deduction.

## Acceptance

- capstone_build.py is standard library only, reuses the Learn module
  and records by import and path, and produces deterministic output.
- run_build.py writes results_build.json with no timing fields, byte
  identical across two runs.
- Tests in tests/test_build_capstone.py assert hand-computed counts:
  29 records, 26 at v1.0, 6 architecture node groups with per-group
  counts 11, 9, 4, 3, 1, 1, and 5 layer pairs, all passing, with the
  network pair naming P23 partial.
- Em dash count is 0 in all touched files.
