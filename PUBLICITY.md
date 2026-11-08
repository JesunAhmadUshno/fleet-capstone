# PUBLICITY: fleet-capstone (P25)

This log records channel outcomes for finished work on this repo.
The loop prepares drafts and never posts to social. Pieces were
scored against an internal publicity rubric before release; the scores
are kept outside the public repo.

## Fan-out set for the Build scope (2026-11-06)

Written fan-out for P25 fleet-capstone at its Build scope (Learn
and Build), in the records-chain scope named in the batch ledger.
Deep is not claimed in any piece: the capstone assembly stays
scheduled 2026-12-28 to 2026-12-30, and there is no v1.0 release
for this project. Drafts are in fanout/. The loop prepares drafts
and never posts to social.

| Channel | Outcome on 2026-11-06 |
| --- | --- |
| GitHub releases | Live: v0.1 https://github.com/JesunAhmadUshno/fleet-capstone/releases/tag/v0.1 , v0.5 https://github.com/JesunAhmadUshno/fleet-capstone/releases/tag/v0.5 (verified with gh release list, 2026-11-06). Draft release notes for both are in fanout/release-notes.md. No new release was created for the fan-out. |
| GitHub Pages | Live: https://jesunahmadushno.github.io/fleet-capstone/ , status built, verified with gh api on 2026-11-06 after the Actions polish pack enabled Pages from docs/ on main. |
| Portfolio index | Held: fan-out links are ready, the index update is a coordinator step outside this cycle. Named reason: held for index refresh. |
| Website page | Draft in fanout/website-page.md. Held: not published to jesunahmadushno.com. |
| Blog | Draft in fanout/blog-post.md. Held: not posted. |
| Tutorial | In repo: fanout/tutorial.md. Every command in it was run and verified on 2026-11-06 (two runners, two per-level test modules, scaffold smoke test; 61 level checks in total). Results files stayed byte-identical across the verification runs. |
| LinkedIn post | Draft in fanout/linkedin-post.md, marked DRAFT NOT POSTED, link carried as the first-comment line per the LinkedIn rule. Held: not posted, loop never posts. |
| X | Draft held: no X copy is shipped in this set beyond the LinkedIn draft source text. Held under the standing social rules; posting is outside the loop. |
| Facebook | Draft held: no Facebook copy posted. Standing rule applies (no link in body or comments, keyword call to action fulfilled by DM). Held: not posted, loop never posts. |
| Instagram | Draft held: no Instagram copy posted. Standing rule applies (no clickable link in caption, link in bio). Held: not posted, loop never posts. |
| Threads | Draft held: no Threads copy posted. Threads waits for Jesun's tap per post, hash-locked on exact text and media. Held: awaiting Jesun's tap. |
| Video | Held: engine queue. The capstone is a flagship, but its story is incomplete until the December assembly; no video was produced in this cycle and none is claimed. |
| Book chapter | Draft angle in fanout/blog-post.md (records before runtime). Held: chapter draft follows the finished project set; not a published chapter. |
| Paper candidate | Draft brief in fanout/paper-candidate.md (the verified records-chain method). Submission is Jesun's tap. Nothing submitted, no venue contacted. The publications tracker is updated by the coordinator, not by this cycle. |

## Jev gate (2026-11-06)

claim_check on the blog main results claim, extracted byte-exact
from fanout/blog-post.md by script. Spec:
hidden_files/jev-p25-fanout-claim-spec-2026-11-06.json in the
goal workspace. Results:
hidden_files/jev-p25-fanout-claim-results-2026-11-06.json. Model
jev-1.13.0, question id supported, noul 0.28, route REVIEW
(clear at 0.85 or above, block at 0.10 or below, review
between), input tokens 1386, output tokens 20. Arithmetic was
pre-computed in the spec evidence (11 plus 9 plus 4 plus 3
plus 1 plus 1 is 29; 29 plus 32 is 61). No claim was blocked. The route is in the same REVIEW
band as this project's earlier gates (Learn 0.46, Build 0.31);
the mitigation is the same as in prior cycles: the full
per-group and per-pair tables sit beside the claim in the
level READMEs (now REPORT.md), and the results files are byte-identical across
runs at the hashes quoted in the claim.

## Actions polish pack (2026-11-06)

Applied through PR #3, merged as 0f75fb34c30f6f19fc9e5bbb554d7a6739db58a7
on 2026-11-06, following the Actions polish pack standard. The
pack adds: CI on a Python 3.11 and 3.12 matrix with a ruff lint
step (ruff scope in ruff.toml: E, F, I, line-length 120),
CodeQL scanning, Dependabot for pip and GitHub Actions, a
release workflow that attaches a source tarball named
fleet-capstone-<tag>.tar.gz to v* tag releases, Labeler,
Greetings, Stale in comment-only mode (days-before-close: -1,
never closes), and a docs page at docs/index.md for GitHub
Pages. Pages was enabled from docs/ on main after the merge
and read back as status built on 2026-11-06. requirements.txt
records that this project is stdlib-only and intentionally
lists no packages, so Dependabot pip has a manifest to watch.
Ruff fixes in the PR were formatting only: import formatting,
two long string lines split by implicit concatenation with
identical string values, and one ambiguous test variable
renamed; results_build.json stayed byte-identical at sha256
9b34465d3232fc5284f2452592a6b7bd24d34d36a5d205314527561119dfd679.
CI in the pack has no Deep step: Deep is not built yet.

| Channel | Outcome on 2026-11-06 |
| --- | --- |
| GitHub Pages | Live: https://jesunahmadushno.github.io/fleet-capstone/ , status built (verified with gh api, 2026-11-06). |
| PyPI publishing | Held: needs a PyPI token, a new credential. Jesun's tap only. Not set up. |
| Social channels (LinkedIn, X, Facebook, Instagram, Threads) | Held: no posts made. The loop never posts to social; Threads waits for Jesun's tap per post under the standing gates. |

