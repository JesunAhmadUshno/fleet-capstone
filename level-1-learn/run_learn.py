"""Run the Learn validator and chain checker, write results_learn.json.

Also writes results_sensitivity.json (primary-project-only rule).
Deterministic: no timing fields, stable key order, so two runs produce
a byte-identical file.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capstone_learn import chain_check_primary, load_records, run_all  # noqa: E402

if __name__ == "__main__":
    results = run_all()
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results_learn.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2, sort_keys=True)
        fh.write("\n")
    sens = {"as_of": results["as_of"], "repo_rule": "any listed project at v1.0",
            "repo_rule_covered_count": sum(1 for v in results["chain_layers"].values() if v["covered"]),
            "primary_only": chain_check_primary(load_records())}
    out_sens = os.path.join(os.path.dirname(out), "results_sensitivity.json")
    with open(out_sens, "w", encoding="utf-8") as fh:
        json.dump(sens, fh, indent=2, sort_keys=True)
        fh.write("\n")
    print("valid:", results["valid"], "errors:", len(results["validation_errors"]))
    print("coverage:", results["coverage_text"], "exceptions:", results["exceptions"])
    print("chain all covered:", results["chain_all_covered"])
    print("primary-only rule:", sens["primary_only"]["covered_count"], "of", sens["primary_only"]["layer_count"],
          "layers, failing:", sens["primary_only"]["failing_layers"])
    print("wrote", out, "and", out_sens)
