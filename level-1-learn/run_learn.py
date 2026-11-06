"""Run the Learn validator and chain checker, write results_learn.json.

Deterministic: no timing fields, stable key order, so two runs produce
a byte-identical file.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capstone_learn import run_all  # noqa: E402

if __name__ == "__main__":
    results = run_all()
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results_learn.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2, sort_keys=True)
        fh.write("\n")
    print("valid:", results["valid"], "errors:", len(results["validation_errors"]))
    print("coverage:", results["coverage_text"], "exceptions:", results["exceptions"])
    print("chain all covered:", results["chain_all_covered"])
    print("wrote", out)
