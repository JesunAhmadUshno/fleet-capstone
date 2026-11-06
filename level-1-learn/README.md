# Level 1, Learn: fleet-capstone

Summary claim: Learn built a deployment record for each of the 29 ROADMAP-V3-BATCH projects: 26 records at v1.0, each with a GitHub release proof link verified with gh release list on 2026-11-05, plus named non-v1.0 records for P19 (Learn+Build, Deep open on the Kaggle window), P23 (Learn only, Build blocked on the R610 capture) and P25 itself (Learn in progress); a standard-library validator and chain checker confirm 0 validation errors, all 6 SPEC chain layers covered by at least one v1.0 record with the network layer named partial on P23, and results_learn.json byte-identical across two runs at sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a.

## The idea

SPEC.md defines the capstone as one chain across the fleet: network,
security, model, serving, scoring, watching. Learn is the bookkeeping
layer of that chain: a deployment record per project, written as each
project ships, holding its fleet node, its ship steps in summary, and
a proof link a reader can open. If a record cannot be validated, or a
chain layer has no shipped project behind it, the capstone story has
a hole, and this level is built to say so in numbers.

This level does not assemble the capstone. Assembly stays scheduled
2026-12-28 to 2026-12-30 (Build and Deep scope). Learn only records
what has shipped and checks the chain on paper, honestly labelled as
a records chain, not a running chain.

## The records (records.json)

29 records, one per batch project P01 to P29. Node values come from
the batch ledger table (hidden_files/batch-state.md). Status and
proof links were verified on 2026-11-05 with gh release list:

- 26 records at v1.0: P01, P02, P03, P04, P05, P06, P07, P08, P09,
  P10, P11, P12, P13, P14, P15, P16, P17, P18, P20, P21, P22, P24,
  P26, P27, P28, P29. Each proof link is the repo v1.0 release URL
  and each release was listed by gh before the record was written.
- P19 distributed-training-lab: Learn+Build. Releases v0.1 and v0.5
  verified; no v1.0 exists. Deep is the 2-GPU Kaggle exercise set
  (December Compression Protocol Addendum B) and stays open on the
  Kaggle window.
- P23 server-and-networking-lab: Learn only. Release v0.1 verified;
  no v0.5 or v1.0 exists. Build is blocked on a fresh live R610
  evidence capture in a planned power-on window.
- P25 fleet-capstone (this project): Learn in progress. No release
  existed at record write time, so its proof link is null by design;
  the validator accepts null only for non-v1.0 records.

## The validator and chain checker (capstone_learn.py)

- validate_record: required fields project, repo, node, status,
  steps, proof_link. A v1.0 record must carry exactly its repo v1.0
  release URL; a non-v1.0 proof link must be a well-formed GitHub URL
  for that repo or null. validate_records also rejects duplicate
  project ids.
- coverage: counts v1.0 records and names the exceptions.
- chain_check: the 6 SPEC layers and their projects: network (P23,
  P20), security (P24, P13), model (P01), serving (P03), scoring
  (P06), watching (P12). A layer is covered when at least one of its
  projects is at v1.0. Partial projects are named, not hidden.

## Results (measured, from results_learn.json)

| Measure | Value |
| --- | --- |
| Records | 29 of 29 projects |
| Validation errors | 0 |
| At v1.0 | 26 of 29 |
| Exceptions | P19 (Learn+Build), P23 (Learn only), P25 (Learn in progress) |
| Chain layers covered | 6 of 6 |
| Network layer v1.0 projects | P20 only; P23 named partial |
| Tests | 29 hand-computed Learn checks plus the scaffold smoke test, all passing |
| Determinism | results_learn.json byte-identical across two runs, sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a |

Chain verdict, verbatim from the checker: All 6 chain layers are
covered by at least one v1.0 record. Honest limit: the network layer
rests on P23 Learn only until its Build lands; P20 (ml-platform-lab,
v1.0) covers the layer in the records chain, but no P23 Build or Deep
record exists. This is a records chain, not a running chain: no live
end to end deployment was run by this level.

## Failure modes

- Ledger drift: a record is only as current as the ledger and the
  release check behind it. A project that ships or slips after
  2026-11-05 makes its record stale until the next cycle rewrites it.
  The as_of date is in the data for that reason.
- Proof link rot: a release URL proves a release existed at check
  time. It does not prove the deployed system still runs, and this
  level ran no deployment itself.
- Partial layer risk: network coverage leans on P20 while P23, the
  primary network project, sits at Learn only. If the standard were
  primary project only, the layer would fail; the checker names this
  instead of smoothing it over.
- Uniform steps summaries: ship steps are recorded as a ledger
  summary per project, not as a step log captured at ship time. The
  detail lives in each project repo and its own ledger entries.
- Records chain, not a running chain: nothing here shows data moving
  network to security to model to serving to scoring to watching.
  That demonstration is Deep scope, at assembly time.

## Grade basis (named deductions)

Grade 7,900 of 10,000. Deductions: records are ledger-derived and
this level ran no live deployment itself (minus 700); the chain is a
records chain, not a running end to end chain (minus 600); the
network layer is partial, resting on P23 Learn only (minus 400);
steps summaries are uniform ledger summaries, not per-project step
logs captured at ship time (minus 250); the run executed on the Muse
VM while the capstone node is All nodes (minus 150).

## Run it

    python level-1-learn/run_learn.py
    python tests/test_learn_capstone.py
    python tests/test_smoke.py

results_learn.json is deterministic: two runs are byte-identical,
sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a.
Assigned node for this project is All nodes; this Learn run executed
on the Muse VM, which is named as a grade deduction above.
