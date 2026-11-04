# fleet-capstone

The whole fleet story in one chain: network to security to model to serving, in one repo, with a runbook a stranger can follow.

Status: SCAFFOLD (Wave 0, ROADMAP-V3-BATCH, 2026-11-04). Scaffold is not built. No results exist yet.
Project: P25. Fleet node: All fleet nodes. Wave: Scaffold in Wave 0, assembly in Wave 8.

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
| NO RESULTS YET | No measurement has run. This table fills only with measured numbers, with method. |

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
