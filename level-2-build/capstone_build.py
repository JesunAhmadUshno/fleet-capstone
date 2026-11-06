"""Fleet capstone Build: architecture, security posture, worked chains.

Standard library only. Reuses the Learn level by import: the records
and the chain layer mapping come from level-1-learn (capstone_learn),
not from copied content. Project repos are linked through their proof
links, never copied.

This level runs no live deployment. It builds a records chain: it
checks that each layer pair has shipped (v1.0) projects on both sides,
and it names the one partial project (P23) honestly.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LEARN_DIR = os.path.join(ROOT, "level-1-learn")
sys.path.insert(0, LEARN_DIR)
from capstone_learn import CHAIN_LAYERS, load_records  # noqa: E402

LAYER_ORDER = ["network", "security", "model", "serving", "scoring", "watching"]
LAYER_PAIRS = list(zip(LAYER_ORDER, LAYER_ORDER[1:]))

INTERFACES = {
    ("network", "security"): (
        "Network provides the isolated lab network and platform "
        "networking that security work runs inside. Link-based: follow "
        "the P20 and P23 proof links in the records to their repos and "
        "releases; no network configuration is copied here."
    ),
    ("security", "model"): (
        "Security provides defensive guardrails and range isolation "
        "checks that a model must pass before use. Link-based: follow "
        "the P24 and P13 proof links to their repos; no guardrail code "
        "or range content is copied here."
    ),
    ("model", "serving"): (
        "The model layer provides the trained model artifact from P01 "
        "that serving loads. Link-based: follow the P01 proof link to "
        "its v1.0 release; no model code or weights are copied here."
    ),
    ("serving", "scoring"): (
        "Serving provides inference responses that scoring evaluates "
        "with the P06 harness. Link-based: follow the P03 proof link to "
        "its v1.0 release; no serving code is copied here."
    ),
    ("scoring", "watching"): (
        "Scoring provides evaluation results and failure labels that "
        "watching observes and reports. Link-based: follow the P06 "
        "proof link to its v1.0 release; no scoring code is copied here."
    ),
}
SECURITY_PROJECTS = ["P24", "P13", "P20"]

def fleet_architecture(records):
    by_node = {}
    for r in records:
        by_node.setdefault(r["node"], []).append(r)
    groups = []
    for node in sorted(by_node):
        rs = sorted(by_node[node], key=lambda x: x["project"])
        groups.append({
            "node": node,
            "count": len(rs),
            "projects": [r["project"] for r in rs],
            "repos": [r["repo"] for r in rs],
            "v1_0_count": sum(1 for r in rs if r["status"] == "v1.0"),
        })
    return {"group_count": len(groups), "groups": groups,
            "total_projects": sum(g["count"] for g in groups)}

def security_posture(records):
    by_id = {r["project"]: r for r in records}
    items = []
    for pid in SECURITY_PROJECTS:
        r = by_id[pid]
        items.append({"project": pid, "repo": r["repo"], "node": r["node"],
                      "status": r["status"], "proof_link": r["proof_link"]})
    return {
        "basis": "Derived from Learn records only. Defensive only.",
        "projects": items,
        "project_ids": SECURITY_PROJECTS,
        "all_v1_0": all(i["status"] == "v1.0" for i in items),
        "v1_0_count": sum(1 for i in items if i["status"] == "v1.0"),
        "notes": [
            "P24 cyber-range-lab at v1.0: isolated range work, defensive posture recorded in its own repo, linked not copied.",
            "P13 guardrails-lab at v1.0: guardrail checks recorded in its own repo, linked not copied.",
            "P20 ml-platform-lab at v1.0: platform layer that carries network and cluster posture, linked not copied.",
            "No offensive scenario content is included in this capstone. P24 scenario work stays under its own sign-off rules in its own repo.",
        ],
    }

def worked_chains(records):
    by_id = {r["project"]: r for r in records}
    chains = []
    for frm, to in LAYER_PAIRS:
        fp = CHAIN_LAYERS[frm]
        tp = CHAIN_LAYERS[to]
        f_v10 = [p for p in fp if by_id[p]["status"] == "v1.0"]
        t_v10 = [p for p in tp if by_id[p]["status"] == "v1.0"]
        passed = len(f_v10) >= 1 and len(t_v10) >= 1
        notes = ""
        if (frm, to) == ("network", "security"):
            notes = ("Network side partial on P23: P23 is at Learn only, "
                     "covered in this records chain by P20 at v1.0. "
                     "No P23 Build or Deep record exists.")
        chains.append({
            "from_layer": frm, "to_layer": to,
            "from_projects": fp, "to_projects": tp,
            "from_v1_0_projects": f_v10, "to_v1_0_projects": t_v10,
            "from_proof_links": [by_id[p]["proof_link"] for p in fp],
            "to_proof_links": [by_id[p]["proof_link"] for p in tp],
            "interface": INTERFACES[(frm, to)],
            "check": "both sides have at least one v1.0 record",
            "passed": passed, "notes": notes,
        })
    return chains

def run_all(records=None):
    if records is None:
        records = load_records()
    arch = fleet_architecture(records)
    sec = security_posture(records)
    chains = worked_chains(records)
    return {
        "as_of": "2026-11-06",
        "records_reused": len(records),
        "v1_0_count": sum(1 for r in records if r["status"] == "v1.0"),
        "exceptions": sorted(r["project"] for r in records if r["status"] != "v1.0"),
        "architecture": arch,
        "architecture_group_count": arch["group_count"],
        "security_posture": sec,
        "layer_pairs_total": len(chains),
        "layer_pairs_passed": sum(1 for c in chains if c["passed"]),
        "worked_chains": chains,
        "all_pairs_pass": all(c["passed"] for c in chains),
        "network_pair_notes": chains[0]["notes"],
        "live_deployment_run": False,
        "deep_claimed": False,
        "assembly_window": "2026-12-28 to 2026-12-30",
    }
