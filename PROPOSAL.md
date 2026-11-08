# Proposal: fleet-capstone (P25)

Status: DRAFT, not locked. Nothing in this file was committed with
hypotheses and pass lines before the first result, so the repo is "not
pre-registered" (portfolio standard, section 7). The chain drill below
gets its pass lines from the Owner and is locked by tag proposal-v1
before the assembly starts; until then every section may change.

Sources folded in on 2026-11-08: SPEC.md (Wave 0 scope and acceptance
criteria, 2026-11-04), DOSSIER.md (v1, 2026-11-04, Build update
2026-11-06), NOVELTY.md (draft, 2026-11-04), level-2-build/BUILD-SPEC.md
(2026-11-06), level-3-deep/README.md (scaffold), the README's
full-spectrum map, and the related-work section of
docs/research-review.md (2026-11-07).

## Question

Can the fleet's six layers run as one chain end to end, recorded, with a
runbook a second person can follow to repeat it?

The chain, from SPEC.md: network (P23), security (P24 and P13), model
(P01), serving (P03), scoring (P06), watching (P12). Fleet node: all
fleet nodes. Scaffold in Wave 0, assembly in Wave 8.

## Scope, as written in SPEC.md (2026-11-04)

Subject: the integration layer. One chain in one repo.

- Learn: a deployment record per project, written as each project ships
  (node, steps, proof link).
- Build: the capstone repo itself: fleet architecture, security posture,
  one worked chain per layer pair, links into the project repos instead
  of copied content.
- Deep: one full chain demo recorded end to end, with a runbook a
  stranger can follow to repeat it. The scaffold opens in Wave 0 and
  fills wave by wave.

Acceptance criteria at scaffold level (SPEC.md):

- Learn closes when its code runs, its write-up teaches the idea, and a
  fresh-eyes reader can follow it.
- Build closes when the system runs end to end, tests pass, and one
  result table with method is in the write-up.
- Deep closes when the Deep scope is done, the failure modes are
  written, and the dossier is updated to ship state.
- No level closes on a claim. Evidence only: code, tests, numbers, links.

Hiring evidence: scored in the fleet pass (the decision pack, sections 4
and 5, 2026-11-04). The Round 3 research (2026-11-04) put the market
centre at post-training, evals, environments and inference depth.

## Records-chain scope (BUILD-SPEC.md, 2026-11-06)

Written before the Build code, though committed with it, so not
provably first. Build is the capstone repo itself, in a labelled
records-chain scope:

- Fleet architecture: a table built from the deployment records (reused
  by import, not copied), projects grouped by fleet node, counts a
  reader can hand check against the records file.
- Security posture: a summary derived from the records for P24
  cyber-range-lab, P13 guardrails-lab and P20 ml-platform-lab.
  Defensive only. No offensive content, no scenario content, nothing
  copied from those repos.
- Worked chains: one record per layer pair in chain order (network to
  security, security to model, model to serving, serving to scoring,
  scoring to watching), each with its from and to layers and projects, a
  link-based interface description, and a pass or fail check that both
  sides have at least one v1.0 record.
- The network to security pair names P23 partial: network is covered by
  P20 at v1.0 while P23 is at Learn only.

What it is not: no live deployment, no chain executed end to end with
data moving between projects; the capstone assembly and chain demo are
Deep scope (2026-12-28 to 2026-12-30). A records chain, not a running
chain.

Acceptance (BUILD-SPEC.md): standard library only; reuses the records by
import; deterministic output, byte identical across two runs, no timing
fields; hand-computed tests (29 records, 26 at v1.0, 6 node groups of
11, 9, 4, 3, 1, 1, and 5 layer pairs, all passing, network pair naming
P23 partial); no em dashes in touched files.

## Prior work

These public efforts prove where software came from and that a release
is what it claims to be. This repo's records are a much weaker,
informal kind of release evidence.

- SLSA (Supply-chain Levels for Software Artifacts, OpenSSF, slsa.dev):
  graded levels of build provenance. A record here is roughly "a
  release tag exists", well below basic signed provenance.
- in-toto (Torres-Arias et al., USENIX Security 2019): signed,
  verifiable metadata for each supply-chain step. Its layout-and-step
  model is the upgrade path for the uniform `steps` strings.
- Sigstore (Newman, Meyers and Torres-Arias, ACM CCS 2022): keyless
  signing and a transparency log. Signed releases would let
  verify_links.py check signatures, not only that tags exist.
- Software bills of materials (SPDX, ISO/IEC; CycloneDX):
  machine-readable component inventories that would turn the prose
  interfaces into checkable dependency facts.
- Reproducible Builds (reproducible-builds.org): independent rebuilds
  with byte-identical output. This repo applies the idea to its own
  results files, not to the linked projects.
- Portfolio sites and architecture case studies (NOVELTY.md's named
  prior art): no measured comparison yet.

Novelty (NOVELTY.md, draft, never gated): "this project aims to differ
in the way its SPEC.md section text defines (a from-zero or self-hosted
build, measured in public, on a named home fleet, with the failure modes
written down)". Honest size: none established yet. If it proves small,
this file says so and names the real value instead.

## The chain in the portfolio (full-spectrum map, decision pack section 7)

| Domain | Proof project |
| --- | --- |
| Computer networking | P23 server-and-networking-lab, P20 ml-platform-lab |
| Own rack and server | P23 (the Dell R610 build, documented) |
| Own NAS and storage | P23 storage track |
| Virtualization | P23 (KVM/libvirt), P24 (range VMs, snapshots) |
| Cyber security | P24 cyber-range-lab, P13 guardrails-lab |
| Ethical hacking and red team | P24 (sign-off scenarios inside labnet only) |
| Attacker methods | P24 adversary emulation inside the isolated range only, never real targets |
| Data | P28 post-training-data-lab, P02 tokenizer-lab, P17 signal-ml-lab |
| Machine learning | P17, P01 llm-from-scratch |
| Applied ML | P16 document-intelligence, P05 rag-foundation |
| LLM, his own | P01 |
| Post-training, his own models | P10 finetune-lab, P26 rl-environments-and-verifiers |
| vLLM and serving | P03 vllm-serving-lab (inference optimisation lab) |
| His own agents | P07 agent-from-scratch |
| Agentic system and orchestration | P08 orchestrator-lab, with P07 and P09 as the coding-agent flagship |
| His own harness | P06 rag-eval-harness, P27 agent-evals-and-harness |
| Platform infrastructure | P20 |
| Everything in one chain | P25 fleet-capstone (this repo) |

## Draft plan for the chain drill (to be locked before 2026-12-28)

System under study: a request entering at the network layer (P23 host,
P20 platform), passing the security layer (P24 range rules, P13
guardrails), answered by a P01 model served through P03 (vLLM), scored
by P06, and observed by P12. Field profile: systems and infrastructure,
reliability (standard section 4).

Candidate hypotheses. Pass lines are left for the Owner; none is set
here.

- H1, end to end: one recorded run moves a request through all six
  layers and the record shows each layer's output. Pass line: OWNER.
- H2, repeatable: a second person repeats the run from the runbook
  alone. Pass line: OWNER (who, how many attempts count).
- H3, recovery: a planned failure of one component is detected by the
  watching layer and the chain recovers. Targets for availability, RTO
  and RPO: OWNER.
- H4, contracts: each adjacent pair has an executable contract test
  (for example the P03 response schema against the P06 input) that
  passes on the live chain. Pass line: OWNER.

Design: every trial reported, only registered trials count, no retry
until it passes (standard section 8). Evidence goes in experiments/ as
dated files; results/ is regenerated from it by one command. Needs the
Dell R610 powered on, the GPU node serving, and a planned window; it
cannot run on a CI runner.

Analysis plan: each hypothesis scored pass or miss against its locked
line in REPORT.md, misses shown.
