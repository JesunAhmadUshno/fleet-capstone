# fleet-capstone

The whole fleet story in one chain: network to security to model to serving to scoring to watching, in one repo. This repo is a records chain: it reuses the batch records by import and links into each project repo instead of copying content. It is not a running deployment, and its Deep assembly stays for 2026-12-28 to 2026-12-30.

- Learn: a validator and chain checker over 29 batch project records. Coverage: 26 of 29 projects at v1.0, exceptions P19, P23, P25. The SPEC chain has 6 layers and every layer is covered.
- Build: the fleet architecture in 6 node groups (BlackBox GPU 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1), a defensive security posture from the P24, P13, and P20 records (all at v1.0, defensive only), and 5 worked layer-pair chains, all 5 passing the both-sides v1.0 check. The network to security chain names P23 partial: network is covered by P20 at v1.0, P23 is at Learn only.

Grade on record (of 10,000): Build 8,300.

Every number above is already published in this repo (README.md level write-ups) and reproduced by the runners in this repo, checked in CI. The full write-ups are in the level folders: level-1-learn, level-2-build. Deep is not claimed.

Releases: https://github.com/JesunAhmadUshno/fleet-capstone/releases
