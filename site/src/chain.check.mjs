// Known-answer parity check: node src/chain.check.mjs (runs inside npm run build).
// The JS port on records.json must reproduce the recorded Python results exactly.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { chainSpec, validateRecord, validateRecords, coverage, chainCheck, fleetArchitecture, workedChains, securityPosture, parseLevelReadme } from './chain.js';

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const json = (p) => JSON.parse(read(p));
const data = json('level-1-learn/records.json');
const learn = json('level-1-learn/results_learn.json');
const sens = json('level-1-learn/results_sensitivity.json');
const build = json('level-2-build/results_build.json');
const links = json('level-2-build/verify_links.json');
const records = data.records;
const spec = chainSpec(learn, build);

// Learn: validator, coverage, chain check (repo rule)
assert.deepEqual(validateRecords(records), learn.validation_errors);
assert.equal(learn.valid, true);
const cov = coverage(records, data.total_projects);
for (const k of ['total_projects', 'records_count', 'v1_0_count', 'v1_0_projects', 'exceptions', 'coverage_text']) assert.deepEqual(cov[k], learn[k], k);
const chain = chainCheck(records, spec, 'any');
assert.deepEqual(chain.layers, learn.chain_layers);
assert.equal(chain.all_covered, learn.chain_all_covered);

// Sensitivity: primary-project-only rule
const prim = chainCheck(records, spec, 'primary');
for (const [l, v] of Object.entries(sens.primary_only.layers)) assert.equal(prim.layers[l].covered, v.covered, `primary ${l}`);
assert.equal(Object.values(prim.layers).filter((v) => v.covered).length, sens.primary_only.covered_count);

// Build: architecture, worked chains, security posture
assert.deepEqual(fleetArchitecture(records), build.architecture);
const chains = workedChains(records, spec, 'any');
const strip = ({ check, ...c }) => c; // eslint-disable-line no-unused-vars
assert.deepEqual(chains, build.worked_chains.map(strip));
assert.equal(chains.filter((c) => c.passed).length, build.layer_pairs_passed);
assert.equal(chains.length, build.layer_pairs_total);
const sec = securityPosture(records, spec);
assert.deepEqual(sec.projects, build.security_posture.projects);
assert.equal(sec.v1_0_count, build.security_posture.v1_0_count);

// Validator known answers (same strings capstone_learn.validate_record returns)
const p01 = records.find((r) => r.project === 'P01');
assert.deepEqual(validateRecord({ ...p01, proof_link: null }), ['P01: bad v1.0 proof link None']);
assert.deepEqual(validateRecord({ ...p01, status: 'Learn only', proof_link: null }), []);
assert.deepEqual(validateRecord({ ...p01, status: 'Learn only', proof_link: 'http://example.com' }), ['P01: bad proof link http://example.com']);
assert.deepEqual(validateRecord({ ...p01, steps: '' }), ['P01: steps must be a non-empty string']);
const { node, ...noNode } = p01; // eslint-disable-line no-unused-vars
assert.deepEqual(validateRecord(noNode), ['P01: missing field node']);
assert.deepEqual(validateRecords([p01, p01]), ['P01: duplicate project id']);

// What-if known answer: dropping P20 leaves network uncovered and the first pair failing
const noP20 = records.map((r) => (r.project === 'P20' ? { ...r, status: 'not shipped' } : r));
assert.equal(chainCheck(noP20, spec).layers.network.covered, false);
assert.equal(workedChains(noP20, spec).filter((c) => c.passed).length, 4);

// README prose: grades sum with their deductions, quoted sha256 equals the committed file
for (const [readme, results] of [['level-1-learn/README.md', 'level-1-learn/results_learn.json'], ['level-2-build/README.md', 'level-2-build/results_build.json']]) {
  const r = parseLevelReadme(read(readme));
  assert.ok(r.grade && r.deductions.length && r.deductions.every(Boolean), `${readme} grade parse`);
  assert.equal(r.grade + r.deductions.reduce((s, d) => s + d.minus, 0), r.outOf, `${readme} deductions sum`);
  assert.equal(createHash('sha256').update(readFileSync(new URL(results, root))).digest('hex'), r.sha256, `${readme} sha256`);
  assert.ok(r.limits.length >= 4 && r.limits.every((l) => l.title && l.text), `${readme} failure modes`);
}

// Link verification file agrees with the records
assert.equal(links.links_checked, records.filter((r) => r.proof_link).length);
console.log('chain ok', { records: records.length, v1_0: cov.v1_0_count, layers: `${Object.values(chain.layers).filter((v) => v.covered).length}/${spec.order.length}`, primaryOnly: sens.primary_only.covered_count, pairs: `${build.layer_pairs_passed}/${build.layer_pairs_total}`, linksResolved: links.links_resolved });
