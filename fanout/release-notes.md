# Release notes draft: fleet-capstone

Status: DRAFT notes for releases that already exist. Dated 2026-11-06.
These notes summarise the existing GitHub releases. No new release is
created by this file, and there is no v1.0 release for this project:
Deep is not done, and its assembly stays scheduled 2026-12-28 to
2026-12-30.

Releases verified with gh release list on 2026-11-06:
v0.1 and v0.5, at the URLs below.

## v0.1, Learn: deployment records, validator, chain checker

URL: https://github.com/JesunAhmadUshno/fleet-capstone/releases/tag/v0.1

- One deployment record for each of the 29 ROADMAP-V3-BATCH projects, a standard-library validator, and a 6-layer chain checker. Records chain only: no assembly and no live deployment at this level.
- Measured run: 29 records, 0 validation errors, 26 at v1.0, exceptions P19 (Learn+Build), P23 (Learn only), P25 (Learn in progress at record time); 6 of 6 chain layers covered, network layer named partial on P23.
- Tests: 29 hand-computed Learn checks plus the scaffold smoke test.
- Determinism: results_learn.json byte-identical across two runs, sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a.

## v0.5, Build: fleet architecture, security posture, worked chains

URL: https://github.com/JesunAhmadUshno/fleet-capstone/releases/tag/v0.5

- The capstone repo in its labelled records-chain scope: fleet architecture in 6 node groups, a defensive security posture summary from the P24, P13, and P20 records, and 5 worked layer-pair chains with interface text. Content is linked from project repos, never copied. No live deployment was run.
- Measured run: 29 records reused, 26 at v1.0; groups BlackBox GPU 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1; security projects all at v1.0; 5 of 5 layer pairs passed, network to security named partial on P23.
- Tests: 32 hand-computed Build checks, 61 level checks in total with Learn, plus the scaffold smoke test.
- Determinism: results_build.json byte-identical across two runs, sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679.
- Limits carried in the release: records chain, not a running chain; network partial on P23; no live deployment; link-based interfaces; Deep not claimed.
