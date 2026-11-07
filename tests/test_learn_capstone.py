"""Hand-computed unit tests for the P25 Learn validator and chain checker.

Counts are hand-computed from the batch ledger at 2026-11-05: 29 batch
projects, 26 at v1.0, exceptions P19, P23, P25. The SPEC chain has 6
layers. Run: python tests/test_learn_capstone.py
"""
import copy
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "level-1-learn"))
from capstone_learn import (  # noqa: E402
    CHAIN_LAYERS,
    chain_check,
    chain_check_primary,
    coverage,
    load_records,
    run_all,
    validate_record,
    validate_records,
)

PASS = 0


def check(cond, label):
    global PASS
    assert cond, label
    PASS += 1
    print("ok:", label)


records = load_records()
by_id = {r["project"]: r for r in records}

# Record set shape (hand-computed from the ledger)
check(len(records) == 29, "29 records, one per batch project")
check(len(by_id) == 29, "29 unique project ids")

# Validator: the real records pass
check(validate_records(records) == [], "real records validate clean")

# Validator: missing field is caught
bad = copy.deepcopy(by_id["P01"])
del bad["node"]
errs = validate_record(bad)
check(any("missing field node" in e for e in errs), "missing field caught")

# Validator: bad v1.0 proof link is caught
bad2 = copy.deepcopy(by_id["P01"])
bad2["proof_link"] = "https://example.com/not-a-release"
errs2 = validate_record(bad2)
check(any("bad v1.0 proof link" in e for e in errs2), "bad link caught")

# Validator: duplicate id is caught
dup = records + [copy.deepcopy(by_id["P06"])]
errs3 = validate_records(dup)
check(any("duplicate project id" in e for e in errs3), "duplicate id caught")

# Validator: a non-v1.0 record may carry a null proof link (P25)
check(by_id["P25"]["proof_link"] is None, "P25 proof link is null at Learn")
check(validate_record(by_id["P25"]) == [], "P25 record validates")

# Coverage (hand-computed)
cov = coverage(records)
check(cov["v1_0_count"] == 26, "26 projects at v1.0")
check(cov["exceptions"] == ["P19", "P23", "P25"], "exceptions are P19, P23, P25")
check(cov["coverage_text"] == "26 of 29 projects at v1.0", "coverage text exact")
check(by_id["P19"]["status"] == "Learn+Build", "P19 status Learn+Build")
check(by_id["P23"]["status"] == "Learn only", "P23 status Learn only")
check(by_id["P06"]["node"] == "BlackBoxV2", "P06 node from ledger")
check(by_id["P16"]["node"] == "Dell R610", "P16 node from ledger")
check(by_id["P20"]["node"] == "Cluster (V2, V3, R610)", "P20 node from ledger")

# Chain layers (hand-computed mapping from SPEC.md)
check(len(CHAIN_LAYERS) == 6, "6 chain layers")
check(CHAIN_LAYERS["network"] == ["P23", "P20"], "network layer mapping")
check(CHAIN_LAYERS["security"] == ["P24", "P13"], "security layer mapping")
check(CHAIN_LAYERS["model"] == ["P01"], "model layer mapping")
check(CHAIN_LAYERS["serving"] == ["P03"], "serving layer mapping")
check(CHAIN_LAYERS["scoring"] == ["P06"], "scoring layer mapping")
check(CHAIN_LAYERS["watching"] == ["P12"], "watching layer mapping")
chain = chain_check(records)
check(chain["all_covered"] is True, "all 6 layers covered by a v1.0 record")
check(chain["layers"]["network"]["v1_0_projects"] == ["P20"], "network v1.0 is P20 only")
check(chain["layers"]["network"]["partial_projects"] == ["P23"], "network names P23 partial")
check("P23 Learn only" in chain["verdict"], "verdict names the P23 limit")
check("not a running chain" in chain["verdict"], "verdict states records chain limit")

# Sensitivity: primary project only (hand-computed: P23 is Learn only,
# every other primary P24, P01, P03, P06, P12 is at v1.0)
prim = chain_check_primary(records)
check(prim["rule"] == "primary project only", "sensitivity rule named")
check(prim["primaries"]["network"] == "P23", "network primary is P23")
check(prim["layers"]["network"]["covered"] is False, "network fails under primary-only rule")
check(prim["covered_count"] == 5 and prim["layer_count"] == 6, "primary-only rule covers 5 of 6 layers")
check(prim["all_covered"] is False, "primary-only rule does not cover all layers")

# Full run
res = run_all()
check(res["valid"] is True and res["v1_0_count"] == 26, "run_all agrees")

print(f"test_learn_capstone: PASS, {PASS} checks")
