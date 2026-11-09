# LinkedIn post draft: P25 fleet-capstone at Build scope

Status: DRAFT NOT POSTED
Date drafted: 2026-11-06
Author: Jesun Ahmad Ushno
Rule for this platform: the link goes in the first comment, not in the
post body. The first comment line is at the end of this file.

## Post body

Twenty-nine projects can still be a pile, not a fleet. So the capstone project in my Roadmap v3 batch does the unglamorous part first: it records every project, validates the records, and checks the chain on paper, labelled as exactly that.

fleet-capstone is at Build scope: Learn and Build done, Deep not claimed. The assembly is scheduled 2026-12-28 to 2026-12-30, and this post does not move that date forward.

Learn: one deployment record per project, 29 records, each v1.0 record carrying a release proof link verified with gh on 2026-11-05. Result: 26 of 29 at v1.0, 0 validation errors, all 6 chain layers covered (network, security, model, serving, scoring, watching). The three exceptions are named in the data: P19, P23, P25. 29 checks.

Build: the same records, reused by import, grouped into 6 fleet node groups (BlackBox GPU 11, BlackBoxV2 9, Dell R610 4, BlackBoxV3 3, Cluster 1, All nodes 1). A defensive security posture from the P24, P13, and P20 records, all at v1.0. Five worked layer-pair chains, 5 of 5 passing the both-sides v1.0 check. 32 checks, 61 in total. Limits named in the repo.

The honest limits, in the post and not in a footnote: this is a records chain, not a running chain. No live deployment was run. The network layer is partial: P23, the primary network project, is at Learn only, blocked on a fresh server capture, and the layer passes through P20 coverage. Records are only as current as their last verification.

If you maintain a fleet of small projects: what is your proof that the whole set still forms the chain you designed, and when did you last check it?

## First comment (post this as the first comment, per the standing rule)

Repo, releases v0.1 and v0.5, docs, and the full tutorial: https://github.com/JesunAhmadUshno/fleet-capstone
