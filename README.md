# fleet-capstone

**Question.** Can the fleet's six layers (network, security, model,
serving, scoring, watching) run as one chain end to end, recorded, with
a runbook a second person can follow to repeat it?

**Headline.** No result yet: the end-to-end chain has not run, and its
assembly is planned for 2026-12-28 to 2026-12-30. The baseline records
audit (29 deployment records as of 2026-11-05, the whole population, so
no sampling interval) finds every one of the 6 layers backed by at least
one v1.0 release under the repo's coverage rule, and 5 of 6 under the
stricter primary-project rule, where network fails because P23 had no
v1.0.

**Field.** Systems and infrastructure, reliability. **Job family.**
Infrastructure and platform engineering (integration).

**Verdict.** Draft, not pre-registered. The records audit is code with
tests that pass in CI, and its results are regenerated from the
committed evidence by one command, but the system under study (the
running chain) has never run, so the repo is not Functional. No plan
with hypotheses and pass lines was committed before the first result;
PROPOSAL.md is a draft until it is locked before the assembly.

Live dashboard: https://jesunahmadushno.github.io/fleet-capstone/

## Reproduce

```text
python3 src/run_learn.py
python3 src/run_build.py
git diff --exit-code results/
python3 tests/test_smoke.py && python3 tests/test_learn_capstone.py && python3 tests/test_build_capstone.py
```

Python 3 standard library only, no dependencies. The two runners rewrite
results/ from experiments/records-2026-11-05.json; `git diff` proves the
committed results are what the evidence gives. src/verify_links.py
re-checks every release link with the gh CLI (network and a signed-in gh
needed) and writes a new dated file in experiments/.

Evidence honesty: the records are transcribed from a private batch
ledger (node, status, steps) and checked against GitHub releases with gh
on 2026-11-05 and 2026-11-07. A record proves a release exists, not that
a system is deployed or that two systems talk to each other.

## Lifecycle

- Question: DONE 2026-11-04
- Proposal: OPEN
- Baseline: DONE 2026-11-07
- Build: OPEN
- Evaluate: OPEN
- Report: OPEN
- Review: OPEN
- Release: OPEN

## Layout

| Path | What it holds |
| --- | --- |
| PROPOSAL.md | Question, scope, prior work, the draft chain-drill plan (not locked) |
| REPORT.md | Baseline records audit: method, results, misses, threats, open gaps |
| src/ | Validator and chain checker (capstone_learn.py), architecture and handoffs (capstone_build.py), the two runners, the gh link checker |
| tests/ | Layout and no-public-grade check, hand-computed tests for both modules |
| experiments/ | Dated evidence: the 2026-11-05 records and the 2026-11-07 link re-check, never edited after capture |
| results/ | learn.json, sensitivity.json, build.json, regenerated from experiments/ by the runners |
| docs/decisions/ | Records of hard-to-reverse choices |
| site/ | The live dashboard, built from results/, experiments/, README.md and REPORT.md |
| fanout/, PUBLICITY.md | Dated publicity drafts and channel log from 2026-11-06 (not posted; paths in them predate this layout) |

No runbook yet: it is the deliverable of the chain drill (PROPOSAL.md).

## License

Code: Apache-2.0 (see LICENSE). Tutorials: CC BY 4.0. Ruled in D-V3-11,
2026-11-04.
