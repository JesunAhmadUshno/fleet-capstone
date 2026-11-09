# 0002: The records stay frozen at 2026-11-05

Date: 2026-11-07 (recorded 2026-11-08). Status: accepted until the Owner rules otherwise. Decided by: Jesun Ahmad Ushno.

## Context

experiments/records-2026-11-05.json is a snapshot. Since then P25 has
releases (its record still says "Learn in progress" with a null link),
P23 has moved on, and P06's latest release is v1.2.

## Decision

The file is never edited. A refresh is a new dated records file in
experiments/, with results regenerated and the change logged in
CHANGELOG.md. The dashboard labels the P25 record stale by design.

## Consequences

The quoted results and hashes stay valid and checkable. The baseline
lags reality until a refresh; whether and when to refresh is an Owner
decision (REPORT.md, open gaps).
