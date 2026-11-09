"""Run the Build assembly, write results/build.json deterministically."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capstone_build import run_all  # noqa: E402

if __name__ == "__main__":
    results = run_all()
    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "results", "build.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2, sort_keys=True)
        fh.write("\n")
    print("records:", results["records_reused"], "v1.0:", results["v1_0_count"])
    print("architecture groups:", results["architecture_group_count"])
    print("pairs passed:", results["layer_pairs_passed"], "of", results["layer_pairs_total"])
    print("wrote", out)
