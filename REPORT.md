# Report: fleet-capstone (P25)

Status: BASELINE 2026-11-07. The chain drill (PROPOSAL.md) has not run;
its assembly is planned for 2026-12-28 to 2026-12-30 and nothing here
claims it. This report covers the baseline: a records audit that asks
whether every layer and every handoff of the chain has shipped (v1.0)
work behind it. It was built without a locked plan, so none of it is
pre-registered.

Sources folded in on 2026-11-08: level-1-learn/README.md (2026-11-05,
sensitivity added 2026-11-07), level-2-build/README.md (2026-11-06), the
README results table, docs/index.md and docs/research-review.md
(2026-11-07). Self-assigned grades that sat in those files are kept
outside the public repo.

## Current state

| Evidence | Result |
| --- | --- |
| Records validated (results/learn.json) | 29 records, 0 validation errors |
| Coverage (results/learn.json) | 26 of 29 projects at v1.0; exceptions P19 (Learn+Build), P23 (Learn only), P25 (Learn in progress) |
| H1 layer coverage, repo rule (results/learn.json) | 6 of 6 layers covered; network rests on P20, P23 named partial |
| H1 layer coverage, primary-project rule (results/sensitivity.json) | 5 of 6; network fails because P23 is Learn only |
| H2 handoffs (results/build.json) | 5 of 5 layer pairs have a v1.0 record on both sides; network to security passes only through P20 |
| Fleet architecture (results/build.json) | 6 node groups, 29 projects: BlackBox (GPU) 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1 |
| Security posture (results/build.json) | P24, P13, P20, all at v1.0, defensive only |
| Proof links re-checked (experiments/verify-links-2026-11-07.json) | 28 of 28 release links resolve; P25 has no link by design; P06's latest release is v1.2, newer than its v1.0 record |
| Tests | 34 Learn checks, 35 Build checks, the layout check; all pass in CI on Python 3.11 and 3.12 |
| Site parity | site/src/chain.check.mjs: the browser port reproduces results/learn.json, results/sensitivity.json and results/build.json exactly; runs inside npm run build |
| End-to-end chain run | Not run |

## Hypotheses (written after the results; not pre-registered)

The hypotheses were implicit until the 2026-11-07 review and were made
explicit after the numbers existed. They are reported here as
descriptive checks, not confirmatory tests.

| Hypothesis | Check | Result |
| --- | --- | --- |
| H1: every chain layer is covered by at least one v1.0 record | chain_check over the records | Pass under the repo rule (6 of 6). Miss under the primary-project rule (5 of 6, network) |
| H2: every adjacent layer pair has a v1.0 record on both sides | worked_chains over the records | Pass (5 of 5), with network partial |

Neither says anything about the question in the README: a pass means
both sides shipped a release, not that they interoperate.

## Method

The idea (from the Learn write-up): the capstone is one chain across the
fleet. The records audit is the bookkeeping layer of that chain: a
deployment record per project, holding its fleet node, its ship steps in
summary, and a proof link a reader can open. If a record cannot be
validated, or a layer has no shipped project behind it, the capstone
story has a hole, and the audit says so in numbers.

The records (experiments/records-2026-11-05.json): 29 records, one per
batch project P01 to P29. Node values come from the private batch ledger
(hidden_files/batch-state.md). Status and proof links were verified on
2026-11-05 with gh release list.

- 26 records at v1.0: P01 to P18, P20, P21, P22, P24, P26 to P29. Each
  proof link is the repo's v1.0 release URL, listed by gh before the
  record was written.
- P19 distributed-training-lab: Learn+Build. Releases v0.1 and v0.5
  verified; no v1.0. Deep is the 2-GPU Kaggle exercise set and stays
  open on the Kaggle window.
- P23 server-and-networking-lab: Learn only. Release v0.1 verified; no
  v0.5 or v1.0. Build was blocked on a fresh live R610 capture.
- P25 fleet-capstone (this project): Learn in progress. No release
  existed at record time, so its proof link is null by design; the
  validator accepts null only for non-v1.0 records.

The validator and chain checker (src/capstone_learn.py):

- validate_record: required fields project, repo, node, status, steps,
  proof_link. A v1.0 record must carry exactly its repo's v1.0 release
  URL; a non-v1.0 proof link must be a well-formed GitHub URL for that
  repo or null. validate_records also rejects duplicate ids.
- coverage: counts v1.0 records and names the exceptions.
- chain_check: the 6 layers and their projects: network (P23, P20),
  security (P24, P13), model (P01), serving (P03), scoring (P06),
  watching (P12). A layer is covered when at least one of its projects
  is at v1.0. Partial projects are named, not hidden.
- chain_check_primary (added 2026-11-07): the stricter rule, counting
  only each layer's primary SPEC project. A comparison rule, so the
  lenient repo rule is not the only one reported.

Architecture, posture and handoffs (src/capstone_build.py) reuse the
records and the layer mapping by import, link into project repos through
their proof links, copy no content, and run no deployment.

Link re-check (src/verify_links.py, 2026-11-07): asks gh (free GitHub
API) for every record's release tag and each repo's latest release.
Needs network and a signed-in gh, so it is outside the offline tests;
three offline checks cover its link parser.

Statistics: the counts cover the whole population (29 of 29 batch
projects), with no sampling, so there is no sampling error to report.
The real uncertainty is whether each record is correct and current,
which the link re-check measures instead of an interval.

Chain verdict, verbatim from the checker: All 6 chain layers are covered
by at least one v1.0 record. Honest limit: the network layer rests on
P23 Learn only until its Build lands; P20 (ml-platform-lab, v1.0) covers
the layer in the records chain, but no P23 Build or Deep record exists.
This is a records chain, not a running chain: no live end to end
deployment was run by this level.

## Results by node group (results/build.json)

| Node group | Projects | At v1.0 |
| --- | --- | --- |
| BlackBox (GPU) | 11 | 10 |
| BlackBoxV2 | 9 | 9 |
| Dell R610 | 4 | 3 |
| BlackBoxV3 | 3 | 3 |
| Cluster (V2, V3, R610) | 1 | 1 |
| All nodes | 1 | 0 (P25 itself) |

Live deployment run: no. Deep claimed: no (both recorded as false in
results/build.json).

## Determinism

Two runs of each runner are byte-identical, and CI regenerates results/
and fails on any difference.

- results/learn.json sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a
- results/build.json sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679

## Failure modes

- Records chain, not a running chain: nothing here shows data moving from network to security to model to serving to scoring to watching. A pair passing means both sides shipped a v1.0 release, not that they interoperate live.
- No live deployment: the audit ran no deployment, and the security posture is a records summary, not a live audit of any node.
- Network partial: P23 is the primary network project and sat at Learn only. The layer and the first pair pass only through P20; under the primary-project rule the layer fails.
- Ledger drift: a record is only as current as the ledger and the release check behind it. A project that shipped or slipped after 2026-11-05 has a stale record; the as_of date is in the data for that reason.
- Proof link rot: a release URL proves a release existed at check time, not that the deployed system still runs.
- Uniform steps summaries: ship steps are a ledger summary per project, not a step log captured at ship time. The detail lives in each project repo.
- Link-based interfaces: interface descriptions point to releases. They are not executable contracts or tested integrations.
- Execution environment: the runs were on the Muse VM, not on the capstone's assigned node (all fleet nodes).

## Threats to validity

- Mapping choice: P20 is placed on the network layer and also appears in
  the security posture. Without P20 on network, the repo rule gives the
  same result as the strict rule (network fails). The dashboard's
  what-if checker shows this when P20 is unticked. Recorded in
  docs/decisions/0001.
- Single source: node, status and steps come from a private ledger that
  is not in the repo. Only status can be checked independently, through
  releases.
- Self-assessment: every judgement here is the author's, with no outside
  reviewer.
- Frozen snapshot: records are as of 2026-11-05. P25's own record still
  says "Learn in progress" with a null link although the repo has
  releases, and P23 has since moved on. Kept on purpose so the quoted
  results stay valid; recorded in docs/decisions/0002.

## Claim checks (Jev, 2026-11-05 and 2026-11-06)

- Learn summary claim: model jev-1.13.0, 1189 input tokens, 20 output
  tokens, question id supported, noul 0.46, route REVIEW.
- Build summary claim: route REVIEW, noul 0.31.
- Fan-out blog claim (PUBLICITY.md): noul 0.28, route REVIEW.

REVIEW means neither cleared nor blocked; the mitigation was to keep the
full tables beside each claim.

## Open gaps and what each needs

| Gap | What closing it needs |
| --- | --- |
| No running end-to-end chain (the question) | Fleet hardware: the Dell R610 on for P23/P24, the GPU node serving a P01 model through P03, P06 scoring and P12 watching, a recorded run and a runbook. Planned 2026-12-28 to 2026-12-30, under a locked PROPOSAL.md. |
| P23 network layer partial | A refreshed records snapshot after P23's Build (decision 0002). |
| Interfaces are prose, not contracts | Executable contract tests between adjacent projects, run on the live chain. |
| Uniform steps strings | Per-project ship logs; rewriting the records changes results/learn.json and its hash, so it needs an Owner decision and a dated new records file. |
| Stale P25 self-record | Owner decision: refresh in a new dated records file, or keep frozen as labelled (decision 0002). |
| Full prior-art pass | A dated reading pass over the works in PROPOSAL.md and a measured comparison; belongs with the drill. |
| External review | One outside reader re-deriving every number from experiments/. Needs a person, not compute. |
| Staleness detection | verify_links.py reports each repo's latest tag (it caught P06 at v1.2). A scheduled re-check needs an Owner decision on a scheduled workflow. |
