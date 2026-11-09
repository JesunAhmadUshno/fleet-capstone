"""Hand-computed tests for P25 Build. Counts from experiments/records-2026-11-05.json verified in code first:
29 records, 26 v1.0, groups: BlackBox (GPU) 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3,
Cluster 1, All nodes 1 = 6 groups, 29 total. 5 layer pairs.
Run: python tests/test_build_capstone.py
"""
import os
import sys

ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT,"src"))
from capstone_build import (  # noqa: E402
    LAYER_PAIRS,
    fleet_architecture,
    run_all,
    security_posture,
    worked_chains,
)
from capstone_learn import load_records  # noqa: E402
from verify_links import parse_release_link  # noqa: E402

PASS=0
def check(c,label):
    global PASS
    assert c,label
    PASS+=1
    print("ok:",label)
records=load_records()
check(len(records)==29,"29 records reused")
res=run_all(records)
check(res["records_reused"]==29,"run_all records 29")
check(res["v1_0_count"]==26,"26 at v1.0")
check(res["exceptions"]==["P19","P23","P25"],"exceptions P19 P23 P25")
arch=fleet_architecture(records)
check(arch["group_count"]==6,"6 architecture node groups")
check(arch["total_projects"]==29,"architecture total 29")
by_node={g["node"]:g for g in arch["groups"]}
check(by_node["BlackBox (GPU)"]["count"]==11,"BlackBox GPU count 11")
check(by_node["BlackBoxV2"]["count"]==9,"BlackBoxV2 count 9")
check(by_node["Dell R610"]["count"]==4,"Dell R610 count 4")
check(by_node["BlackBoxV3"]["count"]==3,"BlackBoxV3 count 3")
check(by_node["Cluster (V2, V3, R610)"]["count"]==1,"Cluster count 1")
check(by_node["All nodes"]["count"]==1,"All nodes count 1")
check(by_node["BlackBox (GPU)"]["v1_0_count"]==10,"BlackBox GPU v1.0 count 10 (P19 exception)")
check(by_node["Dell R610"]["v1_0_count"]==3,"Dell v1.0 count 3 (P23 exception)")
sec=security_posture(records)
check(sec["project_ids"]==["P24","P13","P20"],"security projects P24 P13 P20")
check(sec["all_v1_0"] is True and sec["v1_0_count"]==3,"security all v1.0")
check(all(p["proof_link"].endswith("/releases/tag/v1.0") for p in sec["projects"]),"security proof links are v1.0 form")
check(LAYER_PAIRS==[("network","security"),("security","model"),("model","serving"),
                    ("serving","scoring"),("scoring","watching")],"5 layer pairs in chain order")
chains=worked_chains(records)
check(len(chains)==5,"5 worked chains")
check(all(c["passed"] for c in chains),"all 5 pairs pass")
check(res["layer_pairs_passed"]==5 and res["all_pairs_pass"] is True,"run_all pairs 5 passed")
check(chains[0]["from_projects"]==["P23","P20"],"network pair from P23 P20")
check("P23" in chains[0]["notes"] and "Learn only" in chains[0]["notes"],"network pair names P23 partial")
check(chains[0]["from_v1_0_projects"]==["P20"],"network v1.0 side is P20 only")
check(chains[1]["from_projects"]==["P24","P13"] and chains[1]["to_projects"]==["P01"],"security to model pair")
check(chains[2]["from_projects"]==["P01"] and chains[2]["to_projects"]==["P03"],"model to serving pair")
check(chains[3]["to_projects"]==["P06"],"serving to scoring pair")
check(chains[4]["to_projects"]==["P12"],"scoring to watching pair")
check(all(c["interface"] for c in chains),"every chain has interface description")
check(all("github.com/JesunAhmadUshno/" in link for c in chains
          for link in c["from_proof_links"]+c["to_proof_links"]),"proof links are GitHub links")
check(res["live_deployment_run"] is False,"no live deployment claimed")
check(res["deep_claimed"] is False,"Deep not claimed")
check(parse_release_link("https://github.com/JesunAhmadUshno/tokenizer-lab/releases/tag/v1.0")
      ==("JesunAhmadUshno/tokenizer-lab","v1.0"),"link parser splits repo and tag")
check(parse_release_link(None) is None,"link parser skips a null link")
check(sum(1 for r in records if parse_release_link(r["proof_link"])) == 28,"28 records carry a release link")
print(f"test_build_capstone: PASS, {PASS} checks")
