# One Chain, Checked on Paper First: Building fleet-capstone in the Open

By Jesun Ahmad Ushno
Date: 2026-11-06
Status: DRAFT, written fan-out for P25 fleet-capstone at its Build scope (Learn and Build). Not posted. Deep is not claimed anywhere in this set.

## The problem

Twenty-nine projects on four kinds of machines can still be a pile, not a fleet. Each project can ship its own release and still leave the obvious question unanswered: does the whole set form one chain, from network to security to model to serving to scoring to watching, and can a reader check that claim without trusting a summary? fleet-capstone is the bookkeeping answer to that question. It records every project, validates the records, and checks the chain on paper, honestly labelled as a records chain, not a running chain.

This project, P25 in Roadmap v3, is the capstone record, not the capstone assembly. The full assembly stays scheduled 2026-12-28 to 2026-12-30 and is not claimed here. No live deployment was run by either finished level.

Repository: https://github.com/JesunAhmadUshno/fleet-capstone

## Past, present, future (the dossier, condensed)

Past: portfolio indexes and architecture diagrams already exist, and most of them are pictures: they show intent, not verified state. The prior art and the problem history are recorded in DOSSIER.md and NOVELTY.md in the repo. The novelty claim there stays marked PROPOSED. This post makes no novelty claim beyond the measured work below.

Present: at Build scope, two levels are closed. Learn built a deployment record for each of the 29 batch projects, each v1.0 record carrying a GitHub release proof link verified with gh release list on 2026-11-05, plus named non-v1.0 records for the three exceptions. Build reused those records by import and built the fleet architecture, the defensive security posture summary, and 5 worked layer-pair chains.

Future: the capstone assembly (Deep) runs 2026-12-28 to 2026-12-30 on top of the finished set. The open exceptions it depends on are named, not hidden: P19 Deep waits on a verified Kaggle T4 x2 session, and P23 Build waits on a fresh live Dell R610 evidence capture in a planned power-on window. Until those windows open, the records say so.

## Main results claim

At its Build scope, on records verified with gh release list on 2026-11-05: Learn built 29 deployment records, 26 at v1.0 with named exceptions P19, P23, and P25, validated with 0 errors, all 6 SPEC chain layers covered by at least one v1.0 record with the network layer named partial on P23, results_learn.json byte-identical across two runs at sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a, 29 Learn checks passing; Build reused all 29 records by import, grouped them into 6 fleet architecture node groups (BlackBox GPU 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1, summing to 29), derived a defensive security posture from the P24, P13, and P20 records, all at v1.0, and passed 5 of 5 worked layer-pair chains on the both-sides v1.0 check, with the network to security pair named partial on P23 because its network side is covered by P20 at v1.0 while P23 sits at Learn only, results_build.json byte-identical across two runs at sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679, 32 Build checks passing; no live deployment was run and the capstone Deep assembly stays scheduled 2026-12-28 to 2026-12-30 and is not claimed.

Every number in that claim comes from a run recorded in the level READMEs and results files in the repo. Read the limits section below before quoting any of it.

## Results by level

### Level 1, Learn (release v0.1)

Learn is the bookkeeping layer: one deployment record per project in level-1-learn/records.json, holding its fleet node, its ship steps in summary, and a proof link a reader can open. A standard-library validator checks required fields and proof-link form, rejects duplicate project ids, and accepts a null proof link only for a non-v1.0 record. A chain checker then tests the 6 SPEC layers: network (P23, P20), security (P24, P13), model (P01), serving (P03), scoring (P06), watching (P12). A layer is covered when at least one of its projects is at v1.0.

| Measure | Result |
| --- | --- |
| Records | 29 of 29 projects |
| Validation errors | 0 |
| At v1.0 | 26 of 29 |
| Exceptions | P19 (Learn+Build), P23 (Learn only), P25 (Learn in progress at record time) |
| Chain layers covered | 6 of 6 |
| Network layer | P20 at v1.0; P23 named partial |
| Tests | 29 hand-computed checks plus scaffold smoke, all passing |
| Determinism | results_learn.json identical across two runs, sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a |

### Level 2, Build (release v0.5)

Build reuses the Learn records by import (no copied content, no live deployment) and builds three things: the fleet architecture table grouped by fleet node, a defensive security posture summary derived from the P24, P13, and P20 records, and one worked chain record per layer pair, each with interface text and a pass check that both sides hold a v1.0 record.

| Measure | Result |
| --- | --- |
| Records reused | 29 |
| Architecture node groups | 6 (BlackBox GPU 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1; sum 29) |
| At v1.0 by group | BlackBox GPU 10, BlackBoxV2 9, Dell R610 3, BlackBoxV3 3, Cluster 1, All nodes 0 |
| Security posture projects | P24, P13, P20, all at v1.0, defensive only |
| Layer pairs | 5 total, 5 passed |
| Network to security | Pass, partial on P23 (covered by P20 v1.0, P23 at Learn only) |
| Live deployment run | No |
| Deep claimed | No |
| Tests | 32 hand-computed Build checks, 61 level checks in total with Learn, plus scaffold smoke, all passing |
| Determinism | results_build.json identical across two runs, sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679 |

Limits named in the write-up: a records chain rather than a running chain, the network layer partial on P23, no live deployment run, link-based interface descriptions rather than executable contracts, and running on the Muse VM instead of on all fleet nodes.

## Honest limits

- Records chain, not a running chain: no data moves between projects in these levels. A layer pair passing means both sides shipped a v1.0 release, not that they interoperate live.
- Network partial: P23 is the primary network project and sits at Learn only, blocked on a fresh live R610 capture. The network layer passes only through P20 coverage.
- Record staleness: records are as current as the 2026-11-05 release check behind them. Later ships or slips are not shown until a later cycle rewrites the records.
- Link-based interfaces: interface descriptions point to releases. They are not executable contracts or tested integrations.
- Security posture is a records summary, defensive only. It is not a live audit of any node, and it carries no offensive content.
- Deep is not built and not claimed. The assembly window is 2026-12-28 to 2026-12-30.
- The runs executed on the Muse VM, not on all fleet nodes. That limit is named in each level write-up.

## Where to go next

- Tutorial: fanout/tutorial.md in the repo, a step-by-step module that runs both finished levels and their test suites.
- Releases: v0.1 (Learn) and v0.5 (Build) on the GitHub repo linked above. There is no v1.0 release for this project yet, because Deep is not done.
- License: code Apache-2.0, tutorials CC BY 4.0.
