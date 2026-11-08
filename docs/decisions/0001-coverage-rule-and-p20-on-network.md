# 0001: A layer counts as covered when any listed project is at v1.0, and P20 is listed on network

Date: 2026-11-05 (recorded 2026-11-08). Status: accepted. Decided by: Jesun Ahmad Ushno.

## Context

SPEC.md names one primary project per chain layer; network is P23. On
2026-11-05 P23 was at Learn only, so a primary-only rule fails the
network layer. P20 ml-platform-lab (v1.0) also does network work.

## Decision

CHAIN_LAYERS in src/capstone_learn.py lists P20 on network beside P23,
and a layer is covered when any listed project is at v1.0. P23 is named
partial wherever the network layer appears. Since 2026-11-07 the strict
primary-only rule runs beside it (results/sensitivity.json: 5 of 6).

## Consequences

The headline reports both rules, never the lenient one alone. Without
P20 on network the two rules agree (network fails). Changing the mapping
changes results/learn.json and its quoted hash, so it needs a new dated
records file and a decision record.
