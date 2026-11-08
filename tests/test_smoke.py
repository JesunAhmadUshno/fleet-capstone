"""Portfolio standard checks: required files exist and no public file carries a grade.

No lock test: no proposal is locked yet (README, verdict "not pre-registered").
When PROPOSAL.md is tagged proposal-v1, pin its SHA-256 here.
Run: python tests/test_smoke.py
"""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
need = ["README.md", "PROPOSAL.md", "REPORT.md", "CHANGELOG.md", "CITATION.cff", "SECURITY.md", "LICENSE",
        "src/capstone_learn.py", "src/capstone_build.py", "src/run_learn.py", "src/run_build.py",
        "src/verify_links.py", "experiments/records-2026-11-05.json", "experiments/verify-links-2026-11-07.json",
        "results/learn.json", "results/sensitivity.json", "results/build.json",
        "docs/decisions/0001-coverage-rule-and-p20-on-network.md", "docs/decisions/0002-frozen-records-snapshot.md"]
missing = [p for p in need if not os.path.exists(os.path.join(ROOT, p))]
assert not missing, "missing files: " + ", ".join(missing)

readme = open(os.path.join(ROOT, "README.md"), encoding="utf-8").read()
for field in ("**Question.**", "**Headline.**", "**Field.**", "**Job family.**", "**Verdict.**", "## Lifecycle"):
    assert field in readme, "README abstract lacks " + field

GRADE = re.compile(r"of 10,000|/ ?10,?000|Grade:|Grade \d|grade \d|self-grade|/1000\b|\d+-point", re.I)
public = ["README.md", "PROPOSAL.md", "REPORT.md", "CHANGELOG.md", "PUBLICITY.md"]
public += glob.glob("docs/**/*.md", root_dir=ROOT, recursive=True) + glob.glob("fanout/*.md", root_dir=ROOT)
public += [p for p in glob.glob("site/src/*", root_dir=ROOT) if not p.endswith(".css")]
hits = [p for p in public if GRADE.search(open(os.path.join(ROOT, p), encoding="utf-8").read())]
assert not hits, "public grade found in: " + ", ".join(hits)
print("layout check: PASS,", len(need), "files present,", len(public), "public files free of grades")
