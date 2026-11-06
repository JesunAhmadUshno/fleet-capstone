# Paper candidate brief: verified records chains for multi-project fleets

Project: P25 fleet-capstone
Status: CANDIDATE, brief written 2026-11-06
Submission note: submission is Jesun's tap. Nothing is submitted by
this brief, and no venue has been contacted. The publications
tracker is updated by the coordinator, not by this file.

## Working title

Records before runtime: a verified deployment-records chain for checking that a 29-project fleet still forms its designed architecture

## Abstract draft

Based only on the measured Learn and Build results recorded in the repo. Deep is not built, and no live deployment was run; both limits are stated in the brief and must stay in any paper drafted from it.

A portfolio of small projects drifts: projects ship, slip, or stall, while the architecture diagram that describes them stays frozen at design time. This work presents a records-chain method for keeping the claim honest. Each of 29 projects carries one deployment record (fleet node, ship steps, and a release proof link verified against the hosting platform on 2026-11-05). A validator enforces record shape and proof-link form (0 errors across 29 records), and a chain checker tests whether each of 6 designed layers (network, security, model, serving, scoring, watching) is covered by at least one project at v1.0: 26 of 29 projects were at v1.0, with named exceptions P19, P23, and P25, and all 6 layers covered, the network layer resting on one v1.0 project while its primary project sits at Learn only. A second level grouped the records into 6 fleet node groups summing to 29 and tested 5 layer-pair chains on a both-sides v1.0 rule: 5 of 5 passed, with the network pair explicitly marked partial. Both levels are deterministic (results files byte-identical across two runs) and covered by 61 hand-computed checks. The method claims bookkeeping truth, not runtime truth: a passing pair proves both sides shipped, not that they interoperate.

## Method outline

1. Record schema: required fields project, repo, node, status, steps, proof_link. A v1.0 record must carry exactly its repo v1.0 release URL; a null proof link is accepted only for non-v1.0 records; duplicate project ids are rejected.
2. Verification at write time: every v1.0 proof link was listed by the hosting platform CLI before the record was written. Records carry an as-of date.
3. Coverage accounting: v1.0 count and named exceptions, never a bare percentage.
4. Chain check: 6 layers with named member projects; a layer is covered at one or more v1.0 members; partial members are named in the output.
5. Architecture grouping: records grouped by fleet node (6 groups, counts summing to the record total, checked in tests).
6. Layer-pair chains: 5 pairs in chain order, each with interface text and a both-sides v1.0 pass rule; a pair that passes through a partial member is marked partial, not clean.
7. Determinism: runners write sorted results files with no wall-clock fields, verified byte-identical across two runs at both levels (sha256 recorded in the level READMEs).

## Results table

Measured 2026-11-05 (Learn) and 2026-11-06 (Build), from the level READMEs in the repo.

| Level | Set | Headline result | Detail | Tests |
| --- | --- | --- | --- | --- |
| Learn | 29 records, 6 layers | 26 of 29 at v1.0, 0 errors, 6 of 6 layers | Exceptions P19, P23, P25; network partial on P23 | 29 |
| Build | Same 29 records by import | 6 groups summing to 29, 5 of 5 pairs pass | Security posture P24, P13, P20 all v1.0; network pair partial | 32 (61 total) |

## Venue class note

Per SPEC.md, the paper angle for P25 is the capstone chain and its evidence discipline. This brief is the records-scope form, stated as such; a runtime form would need the December assembly and live runs that do not exist yet. Venue class is a workshop or conference in ML systems operations, software engineering practice, or research software, or a journal of the AJSE class, per the publications pipeline tracker rules. One venue at a time. No venue is named as submitted, accepted, or contacted in this brief. Fees, if any, arise only after acceptance and remain Jesun's call under the free-only rule.

## Limits the paper must carry

- Records truth, not runtime truth. No deployment, integration, or interoperation was run or measured.
- Proof links prove a release existed at check time (2026-11-05), not current state at reading time.
- The fleet is one author's 29 projects on one fleet. Generality to other fleets is argued, not measured.
- The network layer, the chain's first link, is its weakest: it passes through a secondary project while the primary project is blocked on a hardware capture window.
- Deep (the live assembly) does not exist yet. Any claim about it is future work, dated 2026-12-28 to 2026-12-30.

## Submission gate

Submission is Jesun's tap and nothing is submitted. This brief is
the candidate only.
