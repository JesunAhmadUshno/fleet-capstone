"""Re-check every proof link in records.json against GitHub releases.

Standard library plus the gh CLI (free GitHub API, no paid service).
For each record with a proof link it asks gh whether that release tag
exists and which tag is the repo's latest release, then writes
verify_links.json (sorted keys, no timings, one checked_on date).

This replaces the one-off "verified with gh release list" hand check
with a committed script and a committed output. It needs network access
and a signed-in gh, so it is not part of the offline test suite.

Run: python level-2-build/verify_links.py
"""
import datetime
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(HERE), "level-1-learn"))
from capstone_learn import load_records  # noqa: E402

TAG_RE = re.compile(r"^https://github\.com/(JesunAhmadUshno/[a-z0-9-]+)/releases/tag/([^/]+)$")


def parse_release_link(link):
    """Return (owner/repo, tag) for a release URL, or None."""
    m = TAG_RE.match(link or "")
    return (m.group(1), m.group(2)) if m else None


def gh_tag(repo, tag=None):
    """Tag name gh reports for a release (latest when tag is None), or None."""
    cmd = ["gh", "release", "view"] + ([tag] if tag else []) + ["-R", repo, "--json", "tagName", "-q", ".tagName"]
    out = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    return out.stdout.strip() or None if out.returncode == 0 else None


def verify(records):
    rows = []
    for r in sorted(records, key=lambda x: x["project"]):
        parsed = parse_release_link(r["proof_link"])
        if parsed is None:
            rows.append({"project": r["project"], "repo": r["repo"], "proof_link": r["proof_link"],
                         "checked": False, "tag_exists": None, "latest_tag": None})
            continue
        repo, tag = parsed
        rows.append({"project": r["project"], "repo": r["repo"], "proof_link": r["proof_link"],
                     "checked": True, "tag_exists": gh_tag(repo, tag) == tag, "latest_tag": gh_tag(repo)})
    checked = [x for x in rows if x["checked"]]
    return {
        "checked_on": datetime.date.today().isoformat(),
        "method": "gh release view <tag> and gh release view (latest) per repo",
        "links_checked": len(checked),
        "links_resolved": sum(1 for x in checked if x["tag_exists"]),
        "records_without_link": [x["project"] for x in rows if not x["checked"]],
        "rows": rows,
    }


if __name__ == "__main__":
    result = verify(load_records())
    out = os.path.join(HERE, "verify_links.json")
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(result, fh, indent=2, sort_keys=True)
        fh.write("\n")
    print("links resolved:", result["links_resolved"], "of", result["links_checked"],
          "no link:", result["records_without_link"])
    print("wrote", out)
