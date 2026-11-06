# Level 2, Build: fleet-capstone

Summary claim: Build built the fleet-capstone records chain from the 29 Learn deployment records (26 at v1.0): a fleet architecture table in 6 node groups covering all 29 projects, a defensive security posture summary derived from the P24, P13 and P20 records, and 5 worked layer-pair chains (network to security, security to model, model to serving, serving to scoring, scoring to watching) that all pass the check that both sides have a v1.0 record, with the network side named partial on P23 (covered by P20 v1.0, P23 at Learn only); no live deployment was run and the full capstone assembly (Deep) stays scheduled 2026-12-28 to 2026-12-30 and is not claimed.

## What was built

Build is the capstone repo itself in its labelled records-chain scope
(see BUILD-SPEC.md, written first). Code in capstone_build.py reuses
the Learn level by import (capstone_learn load_records and
CHAIN_LAYERS, records.json) and links into project repos through
their proof links. No content is copied from project repos, and no
live deployment is run.

- Fleet architecture: projects grouped by fleet node from the 29
  Learn records.
- Security posture: derived from the records for P24, P13 and P20.
  Defensive only, no offensive content.
- Worked chains: one record per layer pair, with interface text and
  a pass or fail check that both sides have a v1.0 record.

## Results (measured, from results_build.json)

| Measure | Value |
| --- | --- |
| Records reused | 29 |
| At v1.0 | 26 of 29; exceptions P19, P23, P25 |
| Architecture node groups | 6 |
| BlackBox (GPU) | 11 projects, 10 at v1.0 |
| BlackBoxV2 | 9 projects, 9 at v1.0 |
| Dell R610 | 4 projects, 3 at v1.0 |
| BlackBoxV3 | 3 projects, 3 at v1.0 |
| Cluster (V2, V3, R610) | 1 project, 1 at v1.0 |
| All nodes | 1 project, 0 at v1.0 (P25 itself) |
| Security posture projects | P24, P13, P20, all at v1.0 |
| Layer pairs | 5 total, 5 passed |
| Network to security | Pass, partial on P23: network side covered by P20 v1.0, P23 at Learn only |
| Live deployment run | No |
| Deep claimed | No; assembly stays 2026-12-28 to 2026-12-30 |

## Failure modes

- Records chain, not a running chain: no data moves between projects
  in this level. A pair passing means both sides shipped a v1.0
  release, not that they interoperate live.
- Network partial: P23 is the primary network project and sits at
  Learn only. The pair passes only through P20 coverage.
- Link-based interfaces: interface descriptions point to releases.
  They are not executable contracts or tested integrations.
- Record staleness: architecture and posture are only as current as
  records.json (as of 2026-11-05 in Learn). Later ships are not shown.
- No live deployment: security posture is a records summary, not a
  live audit of any node.

## Grade basis (named deductions)

Grade 8,300 of 10,000. Deductions: records chain, not a running
chain (minus 700); network layer partial on P23 (minus 400); no live
deployment run (minus 300); interfaces are link-based descriptions,
not executable or tested contracts (minus 200); Build run executed
on the Muse VM, not on All nodes (minus 100).

## Run it

    python level-2-build/run_build.py
    python tests/test_build_capstone.py
    python tests/test_learn_capstone.py
    python tests/test_smoke.py

results_build.json is deterministic: two runs are byte-identical.
sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679.
