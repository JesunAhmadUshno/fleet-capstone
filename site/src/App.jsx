import { useMemo, useState, useEffect, useId } from 'react';
import recordsFile from '../../experiments/records-2026-11-05.json';
import learn from '../../results/learn.json';
import sens from '../../results/sensitivity.json';
import build from '../../results/build.json';
import links from '../../experiments/verify-links-2026-11-07.json';
import readmeText from '../../README.md?raw';
import reportText from '../../REPORT.md?raw';
import { chainSpec, validateRecords, coverage, chainCheck, fleetArchitecture, workedChains, parseReport, parseReadme } from './chain.js';

const REPO = 'https://github.com/JesunAhmadUshno/fleet-capstone';
const blob = (p) => `${REPO}/blob/main/${p}`;
const RECORDS = recordsFile.records;
const TOTAL = recordsFile.total_projects;
const SPEC = chainSpec(learn, build);
const REPORT_MD = parseReport(reportText);
const README_MD = parseReadme(readmeText);
const LINK_ROWS = Object.fromEntries(links.rows.map((r) => [r.project, r]));
const NODES = [...new Set(RECORDS.map((r) => r.node))].sort();
const STATUSES = [...new Set(RECORDS.map((r) => r.status))].sort();
const fmt = (n) => n.toLocaleString('en-US');
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const tagOf = (link) => (link ? link.split('/').pop() : '');

const SECTIONS = [['top', 'Overview', '◎'], ['chain', 'Chain', '⛓'], ['checker', 'What-if', '⚙'], ['fleet', 'Fleet', '▤'], ['records', 'Records', '{}'], ['validator', 'Validator', '✓'], ['posture', 'Security', '◈'], ['pairs', 'Handoffs', '⇄'], ['status', 'Status', '★'], ['reproduce', 'Reproduce', '❯_']];

function useNarrow() {
  const q = '(max-width: 760px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return narrow;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function MenuBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);
  return (
    <div className="menubar" role="banner">
      <span className="apple" aria-hidden="true">◆</span>
      <a className="app" href="#top">fleet-capstone</a>
      <a className="m" href={blob('PROPOSAL.md')}>Proposal</a>
      <a className="m" href={blob('REPORT.md')}>Report</a>
      <span className="spacer" />
      <span className="status"><i /> records chain</span>
      <a href={REPO}>GitHub ↗</a>
      <span className="clock">{now.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>
    </div>
  );
}

function Dock() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="dock" aria-label="Sections">
      {SECTIONS.map(([id, label, icon]) => (
        <a key={id} href={`#${id}`} className={active === id ? 'on' : ''} aria-current={active === id ? 'true' : undefined}>
          <span className="ico" aria-hidden="true">{icon}</span><span className="lbl">{label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  useReveal();
  // What-if state: status overrides per project and the coverage rule. Shared by chain.svg and the checker.
  const [shipped, setShipped] = useState(() => Object.fromEntries(RECORDS.map((r) => [r.project, r.status === 'v1.0'])));
  const [rule, setRule] = useState('any');
  const what = useMemo(() => {
    const recs = RECORDS.map((r) => (shipped[r.project] === (r.status === 'v1.0') ? r : { ...r, status: shipped[r.project] ? 'v1.0' : 'not shipped (what-if)' }));
    const changed = RECORDS.filter((r) => shipped[r.project] !== (r.status === 'v1.0')).map((r) => r.project);
    return { recs, changed, chain: chainCheck(recs, SPEC, rule), pairs: workedChains(recs, SPEC, rule), cov: coverage(recs, TOTAL), arch: fleetArchitecture(recs) };
  }, [shipped, rule]);
  const reset = () => { setShipped(Object.fromEntries(RECORDS.map((r) => [r.project, r.status === 'v1.0']))); setRule('any'); };
  return (
    <div className="wrap">
      <MenuBar />
      <div className="glow" aria-hidden="true" />
      <Hero />
      <ChainSvg what={what} rule={rule} reset={reset} />
      <Checker what={what} rule={rule} setRule={setRule} shipped={shipped} setShipped={setShipped} reset={reset} />
      <Fleet />
      <Records />
      <Validator />
      <Posture />
      <Pairs />
      <Status />
      <Reproduce />
      <Dock />
      <footer>
        Records as of {recordsFile.as_of}. Code: Apache-2.0. Every number on this page is read from <code>results/</code>, <code>experiments/</code>, README.md and REPORT.md at build time or computed in your browser from the records file; a build-time check proves the browser code reproduces the Python results.
      </footer>
    </div>
  );
}

function Hero() {
  const layers = Object.values(learn.chain_layers);
  const covered = layers.filter((l) => l.covered).length;
  const partial = SPEC.order.filter((l) => learn.chain_layers[l].partial_projects.length);
  return (
    <header className="card hero window" id="top" data-title="fleet-capstone — README.md">
      <div className="head">
        <p className="eyebrow">Integration capstone · records as of {learn.as_of}</p>
        <span className="pill warn">● Records chain, not a running chain</span>
      </div>
      <h1>{learn.records_count} project records, one {SPEC.order.length}-layer chain: every layer and all {build.layer_pairs_total} handoffs check out <em>on paper</em>.</h1>
      <p className="sub">
        This capstone ties the fleet together as one chain: {SPEC.order.join(' → ')}. Each project has a deployment record with its node, status and a release proof link.
        A layer passes when a project behind it has a v1.0 release; a handoff passes when both of its layers do.
        That proves releases exist. It does not prove the systems talk to each other: no live deployment was run (<span className="mono">live_deployment_run = {String(build.live_deployment_run)}</span>) and the end-to-end demo is not claimed (<span className="mono">deep_claimed = {String(build.deep_claimed)}</span>).
        The {partial.join(', ')} layer rests on {learn.chain_layers[partial[0]].v1_0_projects.join(', ')} while {learn.chain_layers[partial[0]].partial_projects.join(', ')} waits at Learn.
      </p>
      <div className="actions">
        <a className="btn primary" href="#checker">Open the what-if checker</a>
        <a className="btn ghost" href={blob('REPORT.md')}>Read the report</a>
        <span className="hint">Learn results as of {learn.as_of}, Build results as of {build.as_of}</span>
      </div>
      <div className="tiles">
        <div className="tile"><div className="num">{learn.records_count}</div><div className="cap">deployment records, {learn.validation_errors.length} validation errors</div></div>
        <div className="tile"><div className="num">{learn.v1_0_count}<small>/{learn.total_projects}</small></div><div className="cap">projects at v1.0; exceptions {learn.exceptions.join(', ')}</div></div>
        <div className="tile"><div className="num">{covered}<small>/{layers.length}</small></div><div className="cap">chain layers covered (repo rule); {sens.primary_only.covered_count}/{sens.primary_only.layer_count} if only the primary project counts</div></div>
        <div className="tile"><div className="num">{build.layer_pairs_passed}<small>/{build.layer_pairs_total}</small></div><div className="cap">layer handoffs with a v1.0 release on both sides</div></div>
      </div>
    </header>
  );
}

function ChainSvg({ what, rule, reset }) {
  const narrow = useNarrow();
  const n = SPEC.order.length;
  const ids = Object.fromEntries(what.recs.map((r) => [r.project, r]));
  const live = what.changed.length > 0 || rule !== 'any';
  // Two layouts of the same diagram: columns on wide screens, stacked rows on phones.
  const W = narrow ? 360 : 960;
  const colW = W / n, rowH = 92;
  const H = narrow ? n * rowH + 8 : 236;
  const box = (i) => (narrow ? { x: 0, y: i * rowH + 4, w: W, h: 64 } : { x: i * colW + 8, y: 30, w: colW - 16, h: 150 });
  const chipW = narrow ? 112 : colW - 40;
  const chip = (b, k) => (narrow ? { x: 100 + k * (chipW + 8), y: b.y + 11 } : { x: b.x + 12, y: b.y + 14 + k * 50 });
  return (
    <section id="chain" className="card window reveal" data-title="chain.svg">
      <div className="head">
        <div>
          <p className="eyebrow">The chain</p>
          <h2>{n} layers, {narrow ? 'top to bottom' : 'left to right'}. Each chip is a project record.</h2>
          <p className="sub">
            Solid chips have a v1.0 release; dashed chips do not. A layer box turns green when the coverage rule is met.
            {' '}{SPEC.partial.join(', ')} is the named partial project. This diagram follows the what-if checker below.
          </p>
        </div>
        {live ? <button className="pill warn" onClick={reset} style={{ cursor: 'pointer' }}>What-if: {what.changed.length} change{what.changed.length === 1 ? '' : 's'}{rule !== 'any' ? ', primary-only rule' : ''} · reset</button>
          : <span className="pill info">Recorded state, {learn.as_of}</span>}
      </div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Chain of ${n} layers from ${SPEC.order[0]} to ${SPEC.order[n - 1]}, ${Object.values(what.chain.layers).filter((l) => l.covered).length} covered, ${what.pairs.filter((p) => p.passed).length} handoffs passing`}>
        <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--muted)" /></marker></defs>
        {SPEC.order.map((layer, i) => {
          const Ly = what.chain.layers[layer];
          const b = box(i);
          const pair = what.pairs[i];
          const tone = Ly.covered ? 'var(--good)' : 'var(--bad)';
          return (
            <g key={layer}>
              <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="12" fill={Ly.covered ? 'var(--good-bg)' : 'var(--bad-bg)'} stroke={tone} strokeOpacity="0.5" />
              {narrow ? <>
                <text x={12} y={b.y + 28} style={{ fill: 'var(--text)', fontSize: 14, fontWeight: 700 }}>{layer}</text>
                <text x={12} y={b.y + 46} style={{ fill: tone, fontWeight: 700 }}>{Ly.covered ? 'covered' : 'not covered'}</text>
              </> : <>
                <text x={b.x + b.w / 2} y={22} textAnchor="middle" style={{ fill: 'var(--text)', fontSize: 14, fontWeight: 700 }}>{layer}</text>
                <text x={b.x + b.w / 2} y={b.y + b.h - 12} textAnchor="middle" style={{ fill: tone, fontWeight: 700 }}>{Ly.covered ? 'covered' : 'not covered'}</text>
              </>}
              {Ly.projects.map((p, k) => {
                const ok = ids[p].status === 'v1.0';
                const counted = rule === 'primary' ? k === 0 : true;
                const c = chip(b, k);
                return (
                  <g key={p} transform={`translate(${c.x} ${c.y})`}>
                    <rect width={chipW} height={42} rx="9" fill={ok ? 'var(--surface-strong)' : 'transparent'} stroke={ok ? 'var(--good)' : 'var(--warn)'} strokeDasharray={ok ? '' : '5 4'} opacity={counted ? 1 : 0.45} />
                    <text x={10} y={18} style={{ fill: 'var(--text)', fontSize: 13, fontWeight: 700 }}>{p}{SPEC.partial.includes(p) ? ' · partial' : ''}</text>
                    <text x={10} y={33}>{ok ? 'v1.0' : ids[p].status.replace(' (what-if)', '')}{k === 0 ? ' · primary' : ''}</text>
                  </g>
                );
              })}
              {pair && (narrow ? <g>
                <line x1={40} x2={40} y1={b.y + b.h + 2} y2={b.y + rowH - 2} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arr)" />
                <text x={54} y={b.y + b.h + 19} style={{ fill: pair.passed ? 'var(--good)' : 'var(--bad)', fontWeight: 700 }}>{pair.passed ? '✓ handoff passes' : '✗ handoff fails'}</text>
              </g> : <g>
                <line x1={b.x + b.w + 1} x2={b.x + b.w + 15} y1={b.y + b.h / 2} y2={b.y + b.h / 2} stroke="var(--muted)" strokeWidth="1.5" markerEnd="url(#arr)" />
                <text x={b.x + b.w + 8} y={b.y + b.h + 22} textAnchor="middle" style={{ fill: pair.passed ? 'var(--good)' : 'var(--bad)', fontWeight: 700 }}>{pair.passed ? '✓' : '✗'}</text>
              </g>)}
            </g>
          );
        })}
        {!narrow && <text x={0} y={H - 4}>✓/✗ under each arrow: does that handoff pass</text>}
      </svg>
    </section>
  );
}

function Checker({ what, rule, setRule, shipped, setShipped, reset }) {
  const chainIds = new Set(Object.values(SPEC.layers).flat());
  const covered = Object.values(what.chain.layers).filter((l) => l.covered).length;
  const passed = what.pairs.filter((p) => p.passed).length;
  const isDefault = what.changed.length === 0 && rule === 'any';
  return (
    <section id="checker" className="card window reveal" data-title="chain-checker.app — live">
      <div className="head">
        <div>
          <p className="eyebrow">Live in your browser</p>
          <h2>What if a project had not shipped? Toggle it and the chain re-checks itself.</h2>
          <p className="sub">
            The checker is a line-by-line port of <a href={blob('src/capstone_learn.py')}>capstone_learn.py</a> and <a href={blob('src/capstone_build.py')}>capstone_build.py</a>.
            At its default state it reproduces <span className="mono">results/learn.json</span> and <span className="mono">results/build.json</span> exactly, which <span className="mono">npm run build</span> asserts before every deploy.
            The stricter rule counts only each layer's primary SPEC project; the repo records that result in <span className="mono">results/sensitivity.json</span>.
          </p>
        </div>
        <span className={`pill ${isDefault ? 'info' : 'warn'}`}>{isDefault ? 'Default = recorded results' : 'What-if, not recorded'}</span>
      </div>
      <div className="seg" role="group" aria-label="Coverage rule" style={{ marginBottom: 16 }}>
        {[['any', 'Any listed project at v1.0 (repo rule)'], ['primary', 'Primary project only (stricter)']].map(([k, l]) => (
          <button key={k} aria-pressed={rule === k} onClick={() => setRule(k)}>{l}</button>
        ))}
      </div>
      <div className="tiles" style={{ marginTop: 0 }}>
        <div className="tile"><div className="num">{covered}<small>/{SPEC.order.length}</small></div><div className="cap">layers covered</div></div>
        <div className="tile"><div className="num">{passed}<small>/{what.pairs.length}</small></div><div className="cap">handoffs pass</div></div>
        <div className="tile"><div className="num">{what.cov.v1_0_count}<small>/{TOTAL}</small></div><div className="cap">{what.cov.coverage_text}</div></div>
        <div className="tile"><div className="num">{what.cov.exceptions.length}</div><div className="cap">exceptions{what.cov.exceptions.length ? `: ${what.cov.exceptions.join(', ')}` : ''}</div></div>
      </div>
      <h3 style={{ marginTop: 20 }}>Chain projects</h3>
      <div className="toggles">
        {RECORDS.filter((r) => chainIds.has(r.project)).map((r) => <Toggle key={r.project} r={r} shipped={shipped} setShipped={setShipped} />)}
      </div>
      <details className="more">
        <summary>All {RECORDS.length} projects (off-chain projects change coverage and node counts only)</summary>
        <div className="toggles">
          {RECORDS.filter((r) => !chainIds.has(r.project)).map((r) => <Toggle key={r.project} r={r} shipped={shipped} setShipped={setShipped} />)}
        </div>
      </details>
      <div className="grid2" style={{ marginTop: 20 }}>
        <div>
          <h3>Handoffs</h3>
          <ul className="list">
            {what.pairs.map((p) => (
              <li key={p.from_layer}><span className={`pill ${p.passed ? 'good' : 'bad'}`}>{p.passed ? 'Pass' : 'Fail'}</span> {p.from_layer} → {p.to_layer}
                <span className="hint"> · v1.0: {p.from_v1_0_projects.join(', ') || 'none'} → {p.to_v1_0_projects.join(', ') || 'none'}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>v1.0 per node group</h3>
          <table>
            <thead><tr><th>Node</th><th>Projects</th><th>At v1.0</th></tr></thead>
            <tbody>{what.arch.groups.map((g) => <tr key={g.node}><td>{g.node}</td><td>{g.count}</td><td>{g.v1_0_count}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <div className="actions"><button className="btn ghost" onClick={reset} disabled={isDefault}>Reset to recorded state</button><span className="hint">Try: untick P20, or switch to the primary-only rule. Both break the network layer.</span></div>
    </section>
  );
}

function Toggle({ r, shipped, setShipped }) {
  const id = useId();
  return (
    <label className="toggle" htmlFor={id}>
      <input id={id} type="checkbox" checked={shipped[r.project]} onChange={(e) => setShipped((s) => ({ ...s, [r.project]: e.target.checked }))} />
      <span><b>{r.project}</b> {r.repo}<small>{shipped[r.project] ? 'v1.0' : r.status === 'v1.0' ? 'not shipped (what-if)' : r.status}</small></span>
    </label>
  );
}

function Fleet() {
  const groups = build.architecture.groups;
  const [sel, setSel] = useState(groups.reduce((a, g) => (g.count > a.count ? g : a)).node);
  const max = Math.max(...groups.map((g) => g.count));
  const W = 960, rowH = 40, l = 190, r = 60, H = groups.length * rowH + 10;
  const x = (v) => (v / max) * (W - l - r);
  const g = groups.find((gg) => gg.node === sel);
  const ids = Object.fromEntries(RECORDS.map((rr) => [rr.project, rr]));
  return (
    <section id="fleet" className="card window reveal" data-title="fleet-architecture.tsv">
      <p className="eyebrow">Fleet architecture · recorded, from results/build.json</p>
      <h2>{build.architecture.total_projects} projects across {build.architecture.group_count} node groups.</h2>
      <p className="sub">Bar length is the number of projects on a node; the solid part is how many are at v1.0. Select a group to list its projects and proof links.</p>
      <div className="scroll-x" style={{ overflowX: 'auto', marginTop: 16 }}>
      <svg className="chart wide" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Projects per node group, ${build.architecture.group_count} groups`}>
        {groups.map((gg, i) => (
          <g key={gg.node} transform={`translate(0 ${i * rowH + 6})`} role="button" tabIndex={0} aria-label={`${gg.node}: ${gg.count} projects, ${gg.v1_0_count} at v1.0`} aria-pressed={sel === gg.node}
            onClick={() => setSel(gg.node)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(gg.node); } }} style={{ cursor: 'pointer' }}>
            <rect x={0} y={-4} width={W} height={rowH - 4} rx="8" fill={sel === gg.node ? 'var(--primary-pale)' : 'transparent'} />
            <text x={10} y={20} style={{ fill: 'var(--text)', fontSize: 13, fontWeight: sel === gg.node ? 700 : 500 }}>{gg.node}</text>
            <rect x={l} y={6} width={x(gg.count)} height={18} rx="5" fill="var(--primary)" opacity="0.18" />
            <rect x={l} y={6} width={x(gg.v1_0_count)} height={18} rx="5" fill="var(--primary)" />
            <text x={l + x(gg.count) + 8} y={20} style={{ fill: 'var(--text)' }}>{gg.v1_0_count} / {gg.count}</text>
          </g>
        ))}
      </svg>
      </div>
      <div className="legend"><span><i style={{ background: 'var(--primary)' }} />at v1.0</span><span><i style={{ background: 'var(--primary)', opacity: 0.18 }} />not at v1.0</span></div>
      <h3 style={{ marginTop: 18 }}>{g.node}: {g.count} project{g.count === 1 ? '' : 's'}</h3>
      <div className="chips">
        {g.projects.map((p, i) => (
          <a key={p} className={`chip ${ids[p].status === 'v1.0' ? '' : 'dash'}`} href={ids[p].proof_link || REPO}>
            <b>{p}</b> {g.repos[i]} <small>{ids[p].status === 'v1.0' ? 'v1.0 release ↗' : `${ids[p].status}${ids[p].proof_link ? ` · ${tagOf(ids[p].proof_link)} ↗` : ' · no release link'}`}</small>
          </a>
        ))}
      </div>
    </section>
  );
}

function Records() {
  const [node, setNode] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState(['project', 1]);
  const [pick, setPick] = useState(null);
  const rows = useMemo(() => {
    const r = RECORDS.filter((x) => (node === 'all' || x.node === node) && (status === 'all' || x.status === status));
    const [k, d] = sort;
    return [...r].sort((a, b) => (a[k] < b[k] ? -d : a[k] > b[k] ? d : 0));
  }, [node, status, sort]);
  const distinctSteps = new Set(RECORDS.map((r) => r.steps)).size;
  const col = (k, label) => (
    <th aria-sort={sort[0] === k ? (sort[1] > 0 ? 'ascending' : 'descending') : 'none'}>
      <button className="th" onClick={() => setSort(([sk, sd]) => [k, sk === k ? -sd : 1])}>{label}{sort[0] === k ? (sort[1] > 0 ? ' ↑' : ' ↓') : ''}</button>
    </th>
  );
  return (
    <section id="records" className="card window reveal" data-title="records-2026-11-05.json">
      <div className="head">
        <div>
          <p className="eyebrow">The records · as of {recordsFile.as_of}</p>
          <h2>All {RECORDS.length} records, filterable and sortable.</h2>
          <p className="sub">
            Status is frozen at {recordsFile.as_of}, so this is not current status: P25 (this repo) still reads "{RECORDS.find((r) => r.project === 'P25').status}" by design.
            The <span className="mono">latest release</span> column comes from <a href={blob('src/verify_links.py')}>verify_links.py</a>, re-run on {links.checked_on}: {links.links_resolved} of {links.links_checked} proof links still resolve.
            Only {distinctSteps} distinct <span className="mono">steps</span> strings exist across {RECORDS.length} records, so steps carry little per-project detail.
          </p>
        </div>
      </div>
      <div className="controls">
        <div className="field"><label htmlFor="f-node">Node</label>
          <select id="f-node" value={node} onChange={(e) => setNode(e.target.value)}><option value="all">All nodes ({RECORDS.length})</option>{NODES.map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
        <div className="field"><label htmlFor="f-status">Status</label>
          <select id="f-status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Any status</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>
      <div className="scroll-x table-box">
        <table>
          <thead><tr>{col('project', 'Project')}{col('repo', 'Repo')}{col('node', 'Node')}{col('status', 'Status')}<th>Proof link</th><th>Latest release</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const lr = LINK_ROWS[r.project];
              return (
                <tr key={r.project} className={pick === r.project ? 'sel' : ''} onClick={() => setPick(r.project)}>
                  <td className="mono">{r.project}</td><td>{r.repo}</td><td>{r.node}</td>
                  <td><span className={`pill ${r.status === 'v1.0' ? 'good' : 'warn'}`}>{r.status}</span></td>
                  <td>{r.proof_link ? <a href={r.proof_link}>{tagOf(r.proof_link)} ↗</a> : <span className="hint">null</span>}</td>
                  <td className="mono">{lr?.latest_tag ?? '–'}{lr?.checked && !lr.tag_exists ? ' (link broken)' : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="tip" aria-live="polite">{rows.length} shown. {pick ? <>Steps for {pick}: {RECORDS.find((r) => r.project === pick).steps}</> : 'Click a row to read its steps.'}</p>
    </section>
  );
}

function Validator() {
  const [pid, setPid] = useState(RECORDS[0].project);
  const base = RECORDS.find((r) => r.project === pid);
  const [draft, setDraft] = useState(base);
  const [nullLink, setNullLink] = useState(base.proof_link === null);
  const choose = (p) => { const r = RECORDS.find((x) => x.project === p); setPid(p); setDraft(r); setNullLink(r.proof_link === null); };
  const edited = { ...draft, proof_link: nullLink ? null : draft.proof_link ?? '' };
  const all = RECORDS.map((r) => (r.project === pid ? edited : r));
  const errors = validateRecords(all);
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const field = (k, label, extra = {}) => (
    <div className="field"><label htmlFor={`v-${k}`}>{label}</label><input id={`v-${k}`} type="text" value={draft[k] ?? ''} onChange={set(k)} {...extra} /></div>
  );
  return (
    <section id="validator" className="card window reveal" data-title="validator.py — playground">
      <div className="head">
        <div>
          <p className="eyebrow">Live in your browser</p>
          <h2>Break a record and watch the validator catch it.</h2>
          <p className="sub">
            A port of <span className="mono">validate_record</span> and <span className="mono">validate_records</span>: a v1.0 record must link exactly to its repo's v1.0 release,
            a non-v1.0 link must be a well-formed GitHub URL or null, steps must be non-empty, and project ids must be unique across all {RECORDS.length} records.
            Error strings match the Python output, and the build checks them against known answers.
          </p>
        </div>
        <span className={`pill ${errors.length ? 'bad' : 'good'}`}>{errors.length} error{errors.length === 1 ? '' : 's'}</span>
      </div>
      <div className="controls">
        <div className="field"><label htmlFor="v-pick">Record to edit</label>
          <select id="v-pick" value={pid} onChange={(e) => choose(e.target.value)}>{RECORDS.map((r) => <option key={r.project} value={r.project}>{r.project} · {r.repo}</option>)}</select></div>
        {field('project', 'project id')}
        {field('repo', 'repo')}
        <div className="field"><label htmlFor="v-status">status</label><input id="v-status" type="text" list="v-statuses" value={draft.status} onChange={set('status')} />
          <datalist id="v-statuses">{STATUSES.map((s) => <option key={s} value={s} />)}</datalist></div>
      </div>
      <div className="controls" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)' }}>
        {field('proof_link', 'proof_link', { disabled: nullLink })}
        <label className="toggle" htmlFor="v-null" style={{ alignSelf: 'end' }}><input id="v-null" type="checkbox" checked={nullLink} onChange={(e) => setNullLink(e.target.checked)} /><span>proof_link is null</span></label>
      </div>
      <div className="field"><label htmlFor="v-steps">steps</label><textarea id="v-steps" rows={2} value={draft.steps} onChange={set('steps')} /></div>
      <div className="log" role="status" aria-live="polite" style={{ marginTop: 14 }}>
        {errors.length ? errors.map((e) => <div key={e} className="no">✗ {e}</div>) : <div className="ok">✓ validate_records: 0 errors across {all.length} records</div>}
      </div>
      <div className="actions"><button className="btn ghost" onClick={() => choose(pid)}>Restore {pid}</button><span className="hint">Try: set status to v1.0 on P23, or rename a record to an id that already exists.</span></div>
    </section>
  );
}

function Posture() {
  const sp = build.security_posture;
  return (
    <section id="posture" className="card window reveal" data-title="security-posture.md">
      <p className="eyebrow">Security posture · recorded, from results/build.json</p>
      <h2>{sp.v1_0_count} of {sp.projects.length} security records at v1.0, defensive only.</h2>
      <p className="sub">{sp.basis} This is a summary of records, not a live audit of any node.</p>
      <div className="grid3" style={{ marginTop: 16 }}>
        {sp.projects.map((p) => (
          <div className="tile" key={p.project}>
            <div className="head" style={{ marginBottom: 6 }}><h3>{p.project} · {p.repo}</h3><span className={`pill ${p.status === 'v1.0' ? 'good' : 'warn'}`}>{p.status}</span></div>
            <p className="hint" style={{ margin: 0 }}>Node: {p.node}</p>
            <a className="hint" href={p.proof_link}>{tagOf(p.proof_link)} release ↗</a>
          </div>
        ))}
      </div>
      <ul className="list" style={{ marginTop: 16 }}>{sp.notes.map((n) => <li key={n}>{n}</li>)}</ul>
    </section>
  );
}

function Pairs() {
  return (
    <section id="pairs" className="card window reveal" data-title="worked-chains.log">
      <p className="eyebrow">Worked chains · recorded, from results/build.json</p>
      <h2>{build.layer_pairs_passed} of {build.layer_pairs_total} handoffs pass the both-sides check.</h2>
      <p className="sub">The check is “{build.worked_chains[0].check}”. Interfaces are prose that points at releases, not executable contracts, so a pass means both sides shipped, not that they interoperate.</p>
      <div className="log" style={{ marginTop: 16 }}>
        {build.worked_chains.map((c) => (
          <div key={c.from_layer} className="entry">
            <div><span className={c.passed ? 'ok' : 'no'}>{c.passed ? 'PASS' : 'FAIL'}</span> {c.from_layer} [{c.from_projects.join(' ')}] → {c.to_layer} [{c.to_projects.join(' ')}]
              <span className="dim">  v1.0 sides: {c.from_v1_0_projects.join(' ')} → {c.to_v1_0_projects.join(' ')}</span></div>
            <div className="dim">{c.interface}</div>
            {c.notes && <div className="warn-t">note: {c.notes}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Status() {
  const done = README_MD.stages.filter((s) => s.status === 'DONE').length;
  return (
    <section id="status" className="card window reveal" data-title="lifecycle.md">
      <p className="eyebrow">Lifecycle and limits · parsed from README.md and REPORT.md at build time</p>
      <h2>{done} of {README_MD.stages.length} stages done. Verdict: <em>{README_MD.verdict}</em>.</h2>
      <p className="sub">Stages and verdict are read from README.md; the plan is PROPOSAL.md. Nothing here is a progress estimate.</p>
      <div className="grid2" style={{ marginTop: 16 }}>
        {README_MD.stages.map((s) => (
          <div className="tile" key={s.stage}><h3>{s.stage}</h3><p className="hint" style={{ margin: '4px 0 0' }}>{s.status}{s.date ? ` ${s.date}` : ''}</p></div>
        ))}
      </div>
      <h3 style={{ marginTop: 24 }}>Limits, from the REPORT failure modes</h3>
      <div className="grid2 limits" style={{ marginTop: 10 }}>
        {REPORT_MD.limits.map((l) => (
          <div className="tile" key={l.title}><h3>{l.title}</h3><p className="hint" style={{ margin: '4px 0 0' }}>{cap(l.text)}</p></div>
        ))}
      </div>
      <p className="hint" style={{ marginTop: 14 }}>Each open gap, with what it would take to close it, is in <a href={blob('REPORT.md')}>REPORT.md</a>.</p>
    </section>
  );
}

function Reproduce() {
  const docs = [
    ['PROPOSAL.md', 'Proposal', 'Question, scope, draft drill plan'],
    ['REPORT.md', 'Report', 'Baseline records audit, limits, open gaps'],
    ['experiments/verify-links-2026-11-07.json', 'Link check', `Re-run ${links.checked_on}`],
  ];
  return (
    <section id="reproduce" className="card window reveal" data-title="reproduce.sh">
      <p className="eyebrow">Reproduce it</p>
      <h2>Standard-library Python, two runners, byte-identical output.</h2>
      <ol className="steps" style={{ marginTop: 16 }}>
        <li><span className="n">1</span><div><b>Run the tests and the Learn runner</b><div className="hint"><code>python tests/test_learn_capstone.py && python src/run_learn.py</code></div></div></li>
        <li><span className="n">2</span><div><b>Run the Build runner</b><div className="hint"><code>python tests/test_build_capstone.py && python src/run_build.py</code></div></div></li>
        <li><span className="n">3</span><div><b>Compare hashes with the ones quoted in REPORT.md</b><div className="hint"><code>sha256sum results/learn.json results/build.json</code></div>
          <div className="hint mono hash">results/learn.json {REPORT_MD.hashes['results/learn.json']}<br />results/build.json {REPORT_MD.hashes['results/build.json']}</div>
          <div className="hint">The site build re-hashes both committed files and fails if they differ from these REPORT values.</div></div></li>
      </ol>
      <div className="docs" style={{ marginTop: 20 }}>
        {docs.map(([p, t, d]) => <a key={p} href={blob(p)}><b>{t}</b><small>{d}</small></a>)}
        <a href={`${REPO}/releases`}><b>Releases</b><small>Tagged snapshots of this repo</small></a>
      </div>
    </section>
  );
}
