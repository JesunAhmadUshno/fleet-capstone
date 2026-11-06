"""Fleet capstone Learn: deployment records validator and chain checker.

Standard library only. The data is records.json: one deployment record
per ROADMAP-V3-BATCH project (29 projects), written as each project
shipped, per SPEC.md Learn scope (node, steps, proof link).

A record proves a release exists. It does not prove a live deployment
ran: this level performs no deployment itself. The chain check is a
records chain: it checks that every layer named in SPEC.md is covered
by at least one v1.0 record, and it names the one partial layer
(network, which rests on P23 Learn only until its Build lands).
"""

import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
RECORDS_PATH = os.path.join(HERE, "records.json")

REQUIRED_FIELDS = ["project", "repo", "node", "status", "steps", "proof_link"]
TOTAL_PROJECTS = 29

# SPEC.md chain: network (P23), security (P24 and P13), model (P01),
# serving (P03), scoring (P06), watching (P12). Network also lists P20
# (ml-platform-lab), which is at v1.0, so the layer is covered while
# its primary project P23 is partial.
CHAIN_LAYERS = {
    "network": ["P23", "P20"],
    "security": ["P24", "P13"],
    "model": ["P01"],
    "serving": ["P03"],
    "scoring": ["P06"],
    "watching": ["P12"],
}
PARTIAL_PROJECTS = ["P23"]

LINK_RE = re.compile(r"^https://github\.com/JesunAhmadUshno/[a-z0-9-]+(/.*)?$")


def load_records(path=RECORDS_PATH):
    with open(path, encoding="utf-8") as fh:
        data = json.load(fh)
    return data["records"]


def validate_record(record):
    """Return a list of error strings for one record (empty if valid)."""
    errors = []
    for field in REQUIRED_FIELDS:
        if field not in record:
            errors.append(f"{record.get('project', '?')}: missing field {field}")
    if errors:
        return errors
    pid = record["project"]
    if record["status"] == "v1.0":
        expected = (
            f"https://github.com/JesunAhmadUshno/{record['repo']}"
            "/releases/tag/v1.0"
        )
        if record["proof_link"] != expected:
            errors.append(f"{pid}: bad v1.0 proof link {record['proof_link']}")
    else:
        link = record["proof_link"]
        if link is not None and not LINK_RE.match(link):
            errors.append(f"{pid}: bad proof link {link}")
    if not isinstance(record["steps"], str) or not record["steps"]:
        errors.append(f"{pid}: steps must be a non-empty string")
    return errors


def validate_records(records):
    """Validate all records, including duplicate project ids."""
    errors = []
    seen = set()
    for record in records:
        errors.extend(validate_record(record))
        pid = record.get("project")
        if pid in seen:
            errors.append(f"{pid}: duplicate project id")
        seen.add(pid)
    return errors


def coverage(records):
    """Count v1.0 records and name the exceptions."""
    v10 = sorted(r["project"] for r in records if r["status"] == "v1.0")
    exceptions = sorted(
        r["project"] for r in records if r["status"] != "v1.0"
    )
    return {
        "total_projects": TOTAL_PROJECTS,
        "records_count": len(records),
        "v1_0_count": len(v10),
        "v1_0_projects": v10,
        "exceptions": exceptions,
        "coverage_text": f"{len(v10)} of {TOTAL_PROJECTS} projects at v1.0",
    }


def chain_check(records):
    """Check each SPEC chain layer has at least one v1.0 record."""
    by_id = {r["project"]: r for r in records}
    layers = {}
    for layer, projects in CHAIN_LAYERS.items():
        v10 = [p for p in projects if by_id.get(p, {}).get("status") == "v1.0"]
        layers[layer] = {
            "projects": projects,
            "v1_0_projects": v10,
            "covered": len(v10) >= 1,
            "partial_projects": [p for p in projects if p in PARTIAL_PROJECTS],
        }
    all_covered = all(v["covered"] for v in layers.values())
    verdict = (
        "All 6 chain layers are covered by at least one v1.0 record. "
        "Honest limit: the network layer rests on P23 Learn only until "
        "its Build lands; P20 (ml-platform-lab, v1.0) covers the layer "
        "in the records chain, but no P23 Build or Deep record exists. "
        "This is a records chain, not a running chain: no live end to "
        "end deployment was run by this level."
        if all_covered
        else "At least one chain layer has no v1.0 record."
    )
    return {"layers": layers, "all_covered": all_covered, "verdict": verdict}


def run_all(path=RECORDS_PATH):
    records = load_records(path)
    errors = validate_records(records)
    cov = coverage(records)
    chain = chain_check(records)
    return {
        "as_of": "2026-11-05",
        "validation_errors": errors,
        "valid": len(errors) == 0,
        "total_projects": cov["total_projects"],
        "records_count": cov["records_count"],
        "v1_0_count": cov["v1_0_count"],
        "v1_0_projects": cov["v1_0_projects"],
        "exceptions": cov["exceptions"],
        "coverage_text": cov["coverage_text"],
        "chain_layers": chain["layers"],
        "chain_all_covered": chain["all_covered"],
        "chain_verdict": chain["verdict"],
    }
