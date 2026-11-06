# fleet-capstone

The whole fleet story in one chain: network to security to model to serving, in one repo, with a runbook a stranger can follow.

Status: Learn DONE 2026-11-05 (early pull; ROADMAP-V3-BATCH). Build DONE 2026-11-06 (early pull; ROADMAP-V3-BATCH). Deep not started. Capstone assembly stays scheduled 2026-12-28 to 2026-12-30 and is not claimed here.
Project: P25. Fleet node: All fleet nodes. Wave: Scaffold in Wave 0, assembly in Wave 8.

Learn summary claim: Learn built a deployment record for each of the 29 ROADMAP-V3-BATCH projects: 26 records at v1.0, each with a GitHub release proof link verified with gh release list on 2026-11-05, plus named non-v1.0 records for P19 (Learn+Build, Deep open on the Kaggle window), P23 (Learn only, Build blocked on the R610 capture) and P25 itself (Learn in progress); a standard-library validator and chain checker confirm 0 validation errors, all 6 SPEC chain layers covered by at least one v1.0 record with the network layer named partial on P23, and results_learn.json byte-identical across two runs at sha256 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a. Grade: Learn 7,900 of 10,000 (deductions named in level-1-learn/README.md). Jev claim_check on this claim: model jev-1.13.0, 1189 input tokens, 20 output tokens, question id supported, noul 0.46, route REVIEW.

Build summary claim: Build built the fleet-capstone records chain from the 29 Learn deployment records (26 at v1.0): a fleet architecture table in 6 node groups covering all 29 projects, a defensive security posture summary derived from the P24, P13 and P20 records, and 5 worked layer-pair chains (network to security, security to model, model to serving, serving to scoring, scoring to watching) that all pass the check that both sides have a v1.0 record, with the network side named partial on P23 (covered by P20 v1.0, P23 at Learn only); no live deployment was run and the full capstone assembly (Deep) stays scheduled 2026-12-28 to 2026-12-30 and is not claimed. Grade: Build 8,300 of 10,000 (deductions named in level-2-build/README.md). results_build.json byte-identical across two runs at sha256 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679.

## Start here

1. Read SPEC.md for scope and acceptance criteria.
2. Read DOSSIER.md for the past, present, and future of this problem (v1).
3. Read NOVELTY.md for the proposed novelty (DRAFT, pending the Jev claim_check gate).
4. Start at level-1-learn/README.md, then level-2-build, then level-3-deep.

## Level map

- Level 1, Learn: the core idea, built small and clean, with a teaching path.
- Level 2, Build: a real working system other people can run.
- Level 3, Deep: benchmarks, optimization, evaluation, hard cases.

## Benchmarks

| Test | Result |
| --- | --- |
| Learn records validated | 29 records, 0 validation errors (level-1-learn/capstone_learn.py, 2026-11-05) |
| Learn coverage | 26 of 29 projects at v1.0; exceptions P19, P23, P25 (gh release list verified, 2026-11-05) |
| Learn chain check | 6 of 6 SPEC layers covered by a v1.0 record; network layer partial on P23 (records chain, not a running chain) |
| Learn tests | 29 hand-computed checks plus scaffold smoke test, all passing |
| Build architecture | 6 node groups, 29 projects: BlackBox (GPU) 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1 (level-2-build/capstone_build.py, 2026-11-06) |
| Build worked chains | 5 of 5 layer pairs pass both-sides v1.0 check; network to security partial on P23, covered by P20 v1.0 |
| Build security posture | P24, P13, P20 records, all at v1.0, defensive only |
| Build tests | 32 hand-computed Build checks plus 29 Learn checks plus scaffold smoke test, all passing |

## Novelty

PROPOSED. See NOVELTY.md. The novelty text is a draft until the Jev claim_check gate passes on it.

## License

Code: Apache-2.0 (see LICENSE). Tutorials: CC BY 4.0. Ruled in D-V3-11, 2026-11-04.

## Full-spectrum map (from the decision pack, Section 7)

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
