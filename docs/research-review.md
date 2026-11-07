# Research review: fleet-capstone (P25)

Reviewed 2026-11-07 against a doctoral-level research rubric. fleet-capstone is an integration capstone, not an experiment: it holds 29 deployment records and checks them as a chain. Some rubric rows are therefore graded on what a records audit can show, and each row says why.

Rule for this review: every gap that could be closed without GPU time, paid APIs or long runs was closed in this change (listed under "Fixed in this change"). Each gap still open names the exact compute, hardware, data or decision it needs.

## Verdict

The repo is honest and reproducible about a narrow claim: as of 2026-11-05, every one of the six SPEC chain layers has at least one project with a v1.0 release, and all five layer handoffs have a v1.0 release on both sides. It does not show a running chain, and it says so. The main weaknesses are the evidence type (release tags from a ledger, not observed deployments), a lenient coverage rule, and missing related work. The lenient rule now has a computed sensitivity result, the proof links now have a committed re-check, and related work is summarised below.

## Rubric

| Criterion | Grade | Evidence and reasoning |
| --- | --- | --- |
| Research question | Adequate | SPEC.md: "one chain in one repo" across network, security, model, serving, scoring, watching. Learn and Build answer a narrower question, stated plainly in both level READMEs: does every layer and every handoff have shipped (v1.0) work behind it? |
| Hypotheses | Adequate (made explicit here) | Implicit until now. H1: every chain layer is covered by at least one v1.0 record. H2: every adjacent layer pair has a v1.0 record on both sides. Both are falsifiable by records.json and both pass under the repo rule. H1 fails under the stricter primary-project rule (network: P23 is Learn only). |
| Method | Adequate | Standard-library validator (required fields, exact v1.0 release URL, URL pattern for non-v1.0 links, duplicate ids), coverage count, layer check and pair check. Deterministic, 69 hand-computed checks across the two test files plus a smoke test. Weakness: the layer-to-project mapping (CHAIN_LAYERS) is a hand-written constant taken from SPEC.md, with P20 added to network. |
| Baselines | Fixed in this change | There was no comparison rule. The primary-project-only rule now runs next to the repo rule (capstone_learn.chain_check_primary, results_sensitivity.json): 6 of 6 layers under the repo rule against 5 of 6 under the strict rule. The dashboard lets a reader switch between them. |
| Statistics and uncertainty | Not applicable, with reason | The counts cover the whole population (29 of 29 batch projects), with no sampling, so there is no sampling error to report. The real uncertainty is whether each record is correct and still current. That is now measured by verify_links.py (28 of 28 release links resolve on 2026-11-07) and shown on the site, rather than given a confidence interval. |
| Reproducibility | Strong | Two runners, byte-identical outputs with the sha256 quoted in each level README. CI on Python 3.11 and 3.12. Added in this change: the site build re-hashes both results files and fails if they differ from the README values, and a JS port is checked equal to the Python results before every deploy. |
| Threats to validity | Adequate | Both level READMEs list failure modes (ledger drift, link rot, partial layer, uniform steps, records chain not a running chain, link-based interfaces, staleness). The dashboard renders them from the README text. Additional threats are named below. |
| Related work | Weak, partly fixed | NOVELTY.md is a placeholder ("NO MEASUREMENT YET") and DOSSIER.md Past has no dated sources. A short positioning against established supply-chain and release-evidence work is added below; a full prior-art pass stays with the Deep wave. |
| Limitations | Strong | Stated in the README summaries, both level READMEs and in results_build.json (live_deployment_run false, deep_claimed false). The dashboard leads with "records chain, not a running chain". |
| Engineering (tests, CI, security) | Strong | ruff lint, CI matrix, CodeQL, Dependabot; stdlib only. Site dependencies are exact-pinned and npm audit is clean. Security posture content stays defensive only. |

## Fixed in this change (2026-11-07)

1. Coverage-rule sensitivity. `chain_check_primary` in level-1-learn/capstone_learn.py counts only each layer's primary SPEC project. run_learn.py writes level-1-learn/results_sensitivity.json: 5 of 6 layers, network failing. Five hand-computed checks were added to tests/test_learn_capstone.py. results_learn.json is unchanged, so its quoted sha256 still holds.
2. Reproducible link verification. level-2-build/verify_links.py asks gh (free GitHub API) for every record's release tag and each repo's latest release, and commits level-2-build/verify_links.json. On 2026-11-07, 28 of 28 links resolve, P25 has no link by design, and P06's latest release is v1.2, newer than its v1.0 record. Three offline checks cover the link parser.
3. Browser parity. site/src/chain.check.mjs proves the dashboard's JS port reproduces results_learn.json, results_build.json and results_sensitivity.json, checks validator error strings against known answers, and confirms that grade plus named deductions add up to 10,000 for each level.
4. No hand-typed numbers on the site. Grades, deductions, sha256 values and limits live only in README prose, so they are parsed at build time and checked, never typed.
5. Hypotheses and related work written down (this file).

## Related work (positioning, not a literature review)

These are established public efforts on proving where software came from and that a release is what it claims to be. fleet-capstone's records are a much weaker, informal kind of release evidence.

- SLSA (Supply-chain Levels for Software Artifacts, OpenSSF, slsa.dev): graded levels of build provenance. A fleet-capstone record is roughly "a release tag exists", well below even basic signed provenance.
- in-toto (Torres-Arias et al., USENIX Security 2019): signed, verifiable metadata for each step of a supply chain. Its layout-and-step model is the obvious upgrade path for the uniform `steps` strings here.
- Sigstore (Newman, Meyers and Torres-Arias, ACM CCS 2022): keyless signing and a transparency log for artifacts. Signed releases would let verify_links.py check signatures, not just that tags exist.
- Software bills of materials (SPDX, an ISO/IEC standard, and CycloneDX): machine-readable component inventories. A per-project SBOM would turn the prose interfaces into checkable dependency facts.
- Reproducible Builds (reproducible-builds.org): independent rebuilds that give byte-identical output. This repo applies the idea to its results files (quoted sha256) but not to the 28 linked projects.

Positioning: fleet-capstone does not compete with these. It is a personal portfolio ledger that borrows two of their ideas, deterministic outputs and re-checkable references. The honest novelty claim stays "none established yet", as NOVELTY.md already says.

## Additional threats to validity

- Mapping choice: P20 is placed on the network layer and also appears in the security posture. Without P20 on network, the repo rule gives the same result as the strict rule (network fails). The dashboard's what-if checker shows this when P20 is unticked.
- Single source: node, status and steps come from a private ledger (hidden_files/batch-state.md) that is not in the repo. Only status can be checked independently, through releases.
- Self-assessment: the grades (Learn 7,900, Build 8,300) were assigned by the author, with named deductions and no outside reviewer.
- Execution environment: runs were on the Muse VM, not on the named node ("All nodes"). Already deducted in both grades.
- Frozen snapshot: records are as of 2026-11-05. P25's own record still says "Learn in progress" with a null link, although this repo now has releases. This is kept on purpose so the quoted results stay valid, and the site labels it as stale by design.

## Open gaps and what each needs

| Gap | What closing it needs |
| --- | --- |
| No running end-to-end chain (SPEC Deep) | Fleet hardware: the Dell R610 powered on for P23/P24, the BlackBox GPU node serving a P01 model through P03 (vLLM), P06 scoring its responses and P12 observing them, plus a recorded run and a stranger-runnable runbook. Scheduled for 2026-12-28 to 2026-12-30. Needs GPU time and live servers, so it cannot run here. |
| P23 network layer partial | P23 Build: a fresh live evidence capture from the R610 in a planned power-on window (physical hardware). |
| Interfaces are prose, not contracts | Executable contract tests between adjacent projects (for example P03 response schema checked against P06 input), run on the live chain above. Needs the same hardware. |
| Uniform steps strings | Per-project ship logs. Source data: each project's release notes and ledger entries. Rewriting records.json changes results_learn.json and its quoted sha256, so it needs an Owner decision and a dated as_of bump. |
| Stale P25 self-record | Owner decision: either refresh P25 to its current release (changes results, the quoted sha256 and the test "P25 proof link is null at Learn") or keep it frozen as labelled. |
| Full prior-art pass for NOVELTY.md | A dated reading pass over the works above and portfolio or architecture case studies, then a measured comparison. Needs reading time only, and belongs with the Deep wave when NOVELTY.md is re-gated. |
| External review of grades | One outside reviewer applying the same rubric. Needs a person, not compute. |
| Staleness detection | Partly closed: verify_links.py reports each repo's latest tag (it caught P06 at v1.2). Still open: a scheduled CI run to re-check links, which needs an Owner decision on adding a scheduled workflow. |
