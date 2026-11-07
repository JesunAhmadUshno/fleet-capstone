// JS port of level-1-learn/capstone_learn.py and level-2-build/capstone_build.py.
// Pure functions over the committed data; chain.check.mjs proves they reproduce
// results_learn.json, results_build.json and results_sensitivity.json exactly.

const REQUIRED_FIELDS = ['project', 'repo', 'node', 'status', 'steps', 'proof_link'];
const py = (v) => (v === null ? 'None' : v); // Python f-string rendering of None
const LINK_RE = /^https:\/\/github\.com\/JesunAhmadUshno\/[a-z0-9-]+(\/.*)?$/;

// Layer mapping, layer order and partial projects are read from the recorded
// results (which the Python code wrote), so no project id is typed here.
export function chainSpec(learn, build) {
  const order = [build.worked_chains[0].from_layer, ...build.worked_chains.map((c) => c.to_layer)];
  const layers = Object.fromEntries(order.map((l) => [l, learn.chain_layers[l].projects]));
  const partial = [...new Set(order.flatMap((l) => learn.chain_layers[l].partial_projects))];
  const interfaces = Object.fromEntries(build.worked_chains.map((c) => [`${c.from_layer}>${c.to_layer}`, c.interface]));
  return { order, layers, partial, interfaces, networkNote: build.network_pair_notes, securityIds: build.security_posture.project_ids };
}

export function validateRecord(record) {
  const errors = [];
  for (const f of REQUIRED_FIELDS) if (!(f in record)) errors.push(`${record.project ?? '?'}: missing field ${f}`);
  if (errors.length) return errors;
  const pid = record.project;
  if (record.status === 'v1.0') {
    const expected = `https://github.com/JesunAhmadUshno/${record.repo}/releases/tag/v1.0`;
    if (record.proof_link !== expected) errors.push(`${pid}: bad v1.0 proof link ${py(record.proof_link)}`);
  } else {
    const link = record.proof_link;
    if (link !== null && !LINK_RE.test(link)) errors.push(`${pid}: bad proof link ${link}`);
  }
  if (typeof record.steps !== 'string' || !record.steps) errors.push(`${pid}: steps must be a non-empty string`);
  return errors;
}

export function validateRecords(records) {
  const errors = [];
  const seen = new Set();
  for (const r of records) {
    errors.push(...validateRecord(r));
    if (seen.has(r.project)) errors.push(`${r.project}: duplicate project id`);
    seen.add(r.project);
  }
  return errors;
}

const byId = (records) => Object.fromEntries(records.map((r) => [r.project, r]));
const sorted = (a) => [...a].sort();

export function coverage(records, total) {
  const v10 = sorted(records.filter((r) => r.status === 'v1.0').map((r) => r.project));
  return {
    total_projects: total,
    records_count: records.length,
    v1_0_count: v10.length,
    v1_0_projects: v10,
    exceptions: sorted(records.filter((r) => r.status !== 'v1.0').map((r) => r.project)),
    coverage_text: `${v10.length} of ${total} projects at v1.0`,
  };
}

// rule 'any': a layer is covered when any listed project is at v1.0 (the repo rule).
// rule 'primary': only the first listed (SPEC-named) project counts (capstone_learn.chain_check_primary).
export function sideOk(records, projects, rule) {
  const ids = byId(records);
  const counted = rule === 'primary' ? projects.slice(0, 1) : projects;
  return counted.filter((p) => ids[p]?.status === 'v1.0');
}

export function chainCheck(records, spec, rule = 'any') {
  const layers = {};
  for (const l of spec.order) {
    const projects = spec.layers[l];
    const v10 = sideOk(records, projects, rule);
    layers[l] = { projects, v1_0_projects: v10, covered: v10.length >= 1, partial_projects: projects.filter((p) => spec.partial.includes(p)) };
  }
  return { layers, all_covered: Object.values(layers).every((v) => v.covered) };
}

export function fleetArchitecture(records) {
  const byNode = {};
  for (const r of records) (byNode[r.node] ??= []).push(r);
  const groups = sorted(Object.keys(byNode)).map((node) => {
    const rs = [...byNode[node]].sort((a, b) => (a.project < b.project ? -1 : a.project > b.project ? 1 : 0));
    return { count: rs.length, node, projects: rs.map((r) => r.project), repos: rs.map((r) => r.repo), v1_0_count: rs.filter((r) => r.status === 'v1.0').length };
  });
  return { group_count: groups.length, groups, total_projects: groups.reduce((s, g) => s + g.count, 0) };
}

export function workedChains(records, spec, rule = 'any') {
  const ids = byId(records);
  return spec.order.slice(1).map((to, i) => {
    const from = spec.order[i];
    const fp = spec.layers[from], tp = spec.layers[to];
    const f = sideOk(records, fp, rule), t = sideOk(records, tp, rule);
    return {
      from_layer: from, to_layer: to, from_projects: fp, to_projects: tp,
      from_v1_0_projects: f, to_v1_0_projects: t,
      from_proof_links: fp.map((p) => ids[p].proof_link), to_proof_links: tp.map((p) => ids[p].proof_link),
      interface: spec.interfaces[`${from}>${to}`],
      passed: f.length >= 1 && t.length >= 1,
      notes: i === 0 ? spec.networkNote : '',
    };
  });
}

export function securityPosture(records, spec) {
  const ids = byId(records);
  const items = spec.securityIds.map((p) => ({ node: ids[p].node, project: p, proof_link: ids[p].proof_link, repo: ids[p].repo, status: ids[p].status }));
  return { projects: items, all_v1_0: items.every((i) => i.status === 'v1.0'), v1_0_count: items.filter((i) => i.status === 'v1.0').length };
}

// ---- README parsing: grades, deductions, sha256 and failure modes live only in prose ----
export function parseLevelReadme(text) {
  const g = text.match(/\nGrade ([\d,]+) of ([\d,]+)\. Deductions: ([\s\S]*?)\.\n\n/);
  const num = (s) => Number(s.replace(/,/g, ''));
  const deductions = g ? g[3].replace(/\s+/g, ' ').split(/;\s*/).map((d) => {
    const m = d.match(/^(.*) \(minus (\d+)\)$/);
    return m && { text: m[1].trim(), minus: Number(m[2]) };
  }) : [];
  const shaM = text.match(/sha256 ([0-9a-f]{64})/);
  const fm = text.match(/## Failure modes\n\n([\s\S]*?)\n\n## /);
  const limits = fm ? fm[1].split(/\n- /).map((b) => b.replace(/^- /, '').replace(/\s+/g, ' ').trim()).map((b) => {
    const i = b.indexOf(': ');
    return { title: b.slice(0, i), text: b.slice(i + 2) };
  }) : [];
  return { grade: g ? num(g[1]) : null, outOf: g ? num(g[2]) : null, deductions, sha256: shaM ? shaM[1] : null, limits };
}
