# Tutorial: P25 fleet-capstone, course module

Module: P25-fleet-capstone
By Jesun Ahmad Ushno
Date: 2026-11-06
License for this tutorial: CC BY 4.0. Code in the repo: Apache-2.0.

## What you will do

You will clone the fleet-capstone repo, run both finished levels (Learn and Build), run their test suites, and read your own results against the recorded numbers. Every command below exists in the repo as shipped at Build v0.5 and was run on 2026-11-06 to verify it. The project needs Python 3.11 or 3.12 and uses the standard library only. No credential is needed. No live deployment is run, and Deep is not part of this module: the capstone assembly stays scheduled 2026-12-28 to 2026-12-30.

Note on commands: the level READMEs write the runner commands with `python`. On systems where only `python3` is present, use the `python3` forms below, which run the same files.

## Step 0: Clone and enter the repo

```text
git clone https://github.com/JesunAhmadUshno/fleet-capstone.git
cd fleet-capstone
```

## Step 1: Level 1, Learn, records and chain check

Read level-1-learn/README.md first. It explains the 29 deployment records, the validator rules, and the 6-layer chain check.

Run the Learn runner:

```text
python3 level-1-learn/run_learn.py
```

Run the Learn tests:

```text
python3 tests/test_learn_capstone.py
```

Read your results:

- Expected summary: valid True, errors 0; coverage 26 of 29 projects at v1.0, exceptions P19, P23, P25; chain all covered True.
- Expected tests: test_learn_capstone: PASS, 29 checks.
- The runner writes level-1-learn/results_learn.json. Its sha256 is 26dbffbd7093915dea66f6c24a55e5cd43603f0add6bfdd2d45b96d7f0bab51a and it is byte-identical across runs.

## Step 2: Level 2, Build, architecture and worked chains

Read level-2-build/README.md and level-2-build/BUILD-SPEC.md first. Build reuses the Learn records by import; it copies no content and runs no deployment.

Run the Build runner:

```text
python3 level-2-build/run_build.py
```

Run the Build tests:

```text
python3 tests/test_build_capstone.py
```

Run the scaffold smoke test:

```text
python3 tests/test_smoke.py
```

Read your results:

- Expected summary: records 29, v1.0 26; architecture groups 6; pairs passed 5 of 5.
- Expected tests: test_build_capstone: PASS, 32 checks. With Learn, 61 level checks in total, plus the smoke test.
- The runner writes level-2-build/results_build.json. Its sha256 is 9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679 and it is byte-identical across runs.

## Step 3: Check the chain yourself

Open level-1-learn/records.json and find the three exception records (P19, P23, P25). Check that each names its reason in its own fields: P19 Deep open on the Kaggle window, P23 Build blocked on the R610 capture, P25 at Learn at record time with a null proof link. Then open level-2-build/results_build.json and find the network to security chain: its notes name P23 partial, and its v1.0 side is P20 only. That is the pattern this project teaches: a chain claim is only as good as its named weakest link.

## What this module does not do

- It does not run the fleet. No project is started, deployed, or connected.
- It does not cover Deep. There is no level-3-deep runner at this scope.
- It does not update the records. A record changes only when a later cycle re-verifies releases with gh and rewrites records.json.
