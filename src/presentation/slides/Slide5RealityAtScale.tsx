import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 5 — architecture diagram hand-laid for pixel-precise alignment.
 * Cytoscape isn't the right tool here: we want callouts anchored to specific
 * edges in a fixed architecture, not a generic graph auto-layout. So this
 * slide uses HTML cards for nodes and SVG paths for edges.
 *
 * All coordinates assume the 1600×900 virtual viewport set up in SlideViewport.
 */

type NodeDef = {
  id: string;
  label: string;
  sub?: string;
  x: number;   // centre x
  y: number;   // centre y
  w?: number;
  h?: number;
  tone: 'platform' | 'lakehouse' | 'enrich' | 'vector' | 'graph' | 'agents' | 'gov';
  delay: number;
};

const NODES: NodeDef[] = [
  // Sources
  { id: 'cdc',    label: 'CDC streams',        sub: 'Kafka · DLT',       x: 150, y: 280, tone: 'platform', delay: 0.2 },
  { id: 'oltp',   label: 'OLTP / app DBs',     sub: 'Postgres · MySQL',  x: 150, y: 400, tone: 'platform', delay: 0.28 },
  { id: 'docs',   label: 'Docs · PDFs · HL7',  sub: 'S3 · ADLS',         x: 150, y: 520, tone: 'platform', delay: 0.36 },

  // Medallion (single combined card)
  { id: 'bronze', label: 'Bronze',             sub: 'raw landed',        x: 430, y: 280, w: 160, h: 58, tone: 'lakehouse', delay: 0.5 },
  { id: 'silver', label: 'Silver',             sub: 'cleansed',          x: 430, y: 400, w: 160, h: 58, tone: 'lakehouse', delay: 0.58 },
  { id: 'gold',   label: 'Gold',               sub: 'curated entities',  x: 430, y: 520, w: 160, h: 58, tone: 'lakehouse', delay: 0.66 },

  // Enrichment
  { id: 'parse',  label: 'Entity extraction',  sub: 'LLM · NER',         x: 730, y: 340, w: 170, h: 58, tone: 'enrich',    delay: 0.82 },
  { id: 'emb',    label: 'Embeddings',         sub: 'vector endpoint',   x: 730, y: 460, w: 170, h: 58, tone: 'enrich',    delay: 0.9 },

  // Governance (sits across the bottom)
  { id: 'gov',    label: 'Unity Catalog · lineage · ACLs', sub: 'governance spine', x: 770, y: 620, w: 420, h: 48, tone: 'gov', delay: 1.05 },

  // Serving — vector and graph side-by-side
  { id: 'vix',    label: 'Vector index',       sub: 'retrieval',         x: 1010, y: 340, w: 160, h: 58, tone: 'vector',   delay: 1.15 },
  { id: 'gp',     label: 'Graph projection',   sub: 'LPG from curated',  x: 1010, y: 460, w: 160, h: 58, tone: 'graph',    delay: 1.25 },

  // Native graph service (subordinate)
  { id: 'ngx',    label: 'Native graph service', sub: 'Cypher / Gremlin',  x: 1220, y: 460, w: 160, h: 58, tone: 'graph',  delay: 1.4 },

  // Agents
  { id: 'agents', label: 'Agents · apps',      sub: 'consumers',         x: 1430, y: 400, w: 140, h: 70, tone: 'agents',   delay: 1.55 },
];

type EdgeDef = {
  from: string;
  to: string;
  curve?: 'straight' | 'corner' | 'bezier';
  dashed?: boolean;
  highlighted?: boolean;
  delay: number;
};

const EDGES: EdgeDef[] = [
  // Sources → Bronze (converging lines)
  { from: 'cdc',    to: 'bronze', delay: 0.6 },
  { from: 'oltp',   to: 'bronze', delay: 0.62 },
  { from: 'docs',   to: 'bronze', delay: 0.64 },
  // Medallion chain
  { from: 'bronze', to: 'silver', delay: 0.72 },
  { from: 'silver', to: 'gold',   delay: 0.78 },
  // Enrichment branches
  { from: 'silver', to: 'parse',  delay: 0.94 },
  { from: 'silver', to: 'emb',    delay: 0.98 },
  // Governance
  { from: 'gold',   to: 'gov',    delay: 1.1 },
  // Serving
  { from: 'emb',    to: 'vix',    delay: 1.22 },
  { from: 'parse',  to: 'gp',     delay: 1.32, highlighted: true },
  { from: 'gp',     to: 'ngx',    delay: 1.45, highlighted: true, dashed: true },
  // Consumers
  { from: 'vix',    to: 'agents', delay: 1.62 },
  { from: 'ngx',    to: 'agents', delay: 1.66, dashed: true },
  { from: 'gov',    to: 'agents', delay: 1.7 },
];

const TONE = {
  platform:   { bg: 'rgba(94,200,255,0.06)',  border: 'rgba(94,200,255,0.38)',  accent: '#5ec8ff' },
  lakehouse:  { bg: 'rgba(94,200,255,0.10)',  border: 'rgba(94,200,255,0.55)',  accent: '#5ec8ff' },
  enrich:     { bg: 'rgba(255,122,69,0.07)',  border: 'rgba(255,122,69,0.4)',   accent: '#ff7a45' },
  vector:     { bg: 'rgba(94,200,255,0.08)',  border: 'rgba(94,200,255,0.5)',   accent: '#5ec8ff' },
  graph:      { bg: 'rgba(179,155,255,0.08)', border: 'rgba(179,155,255,0.5)',  accent: '#b39bff' },
  agents:     { bg: 'rgba(255,212,121,0.08)', border: 'rgba(255,212,121,0.55)', accent: '#ffd479' },
  gov:        { bg: 'rgba(79,209,165,0.06)',  border: 'rgba(79,209,165,0.4)',   accent: '#4fd1a5' },
} as const;

type Pain = {
  id: string;
  title: string;
  body: string;
  // anchor node id — callout positions off the node
  anchor: string;
  dx: number;
  dy: number;
  delay: number;
  // When stacked with a sibling callout that already has a leader line,
  // suppress this one's line so we don't draw two lines into the same node.
  noLeader?: boolean;
};

const PAINS: Pain[] = [
  // TOP band — above the serving / consumers row (y≈270)
  {
    id: 'sync',
    title: 'Sync lag',
    body: 'ETL freshness becomes a product decision.',
    anchor: 'ngx', dx: 0, dy: -190, delay: 2.1,
  },
  {
    id: 'lang',
    title: 'Query-language split',
    body: 'Cypher / Gremlin ≠ SQL. Team skill gap.',
    anchor: 'agents', dx: 0, dy: -130, delay: 2.35,
  },
  // BOTTOM band — gp-related pains stacked under Graph projection
  {
    id: 'dup',
    title: 'Duplicate data',
    body: 'Graph DB is rarely the system of record.',
    anchor: 'gp', dx: 0, dy: 225, delay: 2.6,
  },
  {
    id: 'model',
    title: 'Modelling overhead',
    body: 'Another schema to maintain alongside Delta.',
    anchor: 'gp', dx: 0, dy: 305, delay: 2.85,
    noLeader: true,
  },
  // BOTTOM band — ngx-related pain
  {
    id: 'infra',
    title: 'Extra infra',
    body: 'HA, upgrades, backups — a second platform.',
    anchor: 'ngx', dx: 0, dy: 260, delay: 3.1,
  },
];

export function Slide5RealityAtScale({ config }: { config: SlideConfig }) {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 820 }}>
        <SlideTitle kicker={config.kicker} title="Reality at scale" subtitle={config.subtitle} small />
      </div>

      {/* Lane labels */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 220, height: 28, pointerEvents: 'none' }}>
        {[
          { x: 150, label: 'sources' },
          { x: 430, label: 'medallion' },
          { x: 730, label: 'enrichment' },
          { x: 1010, label: 'serving' },
          { x: 1430, label: 'consumers' },
        ].map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
            style={{
              position: 'absolute',
              left: l.x,
              top: 0,
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
            }}
          >
            {l.label}
          </motion.div>
        ))}
      </div>

      {/* Edges — SVG overlay */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      >
        <defs>
          <marker id="arrow-dim"  viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#2a313d" />
          </marker>
          <marker id="arrow-graph" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#b39bff" />
          </marker>
        </defs>
        {EDGES.map((e) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const aw = a.w ?? 150;
          const ah = a.h ?? 58;
          const bw = b.w ?? 150;
          const bh = b.h ?? 58;
          // edge between nearest edges of the two boxes horizontally
          const x1 = a.x + aw / 2;
          const y1 = a.y;
          const x2 = b.x - bw / 2;
          const y2 = b.y;
          // gentle cubic bezier
          const dx = Math.abs(x2 - x1);
          const cx = Math.max(30, dx * 0.4);
          const d = `M ${x1} ${y1} C ${x1 + cx} ${y1}, ${x2 - cx} ${y2}, ${x2} ${y2}`;
          const stroke = e.highlighted ? '#b39bff' : '#2a313d';
          const markerId = e.highlighted ? 'arrow-graph' : 'arrow-dim';
          return (
            <motion.path
              key={`${e.from}-${e.to}`}
              d={d}
              fill="none"
              stroke={stroke}
              strokeWidth={e.highlighted ? 1.8 : 1.2}
              strokeDasharray={e.dashed ? '6 4' : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: e.highlighted ? 0.95 : 0.72 }}
              transition={{ delay: e.delay, duration: 0.55, ease: 'easeOut' }}
              markerEnd={`url(#${markerId})`}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        {NODES.map((n) => {
          const t = TONE[n.tone];
          const w = n.w ?? 150;
          const h = n.h ?? 58;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: n.delay, duration: 0.45, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: n.x - w / 2,
                top: n.y - h / 2,
                width: w,
                height: h,
                padding: '6px 12px',
                background: t.bg,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                color: 'var(--color-ink)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                fontSize: 12.5,
                fontWeight: 600,
                lineHeight: 1.2,
                boxShadow: '0 10px 26px -18px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <div>{n.label}</div>
              {n.sub && (
                <div
                  style={{
                    fontSize: 10,
                    color: t.accent,
                    marginTop: 3,
                    letterSpacing: '0.06em',
                    fontWeight: 500,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {n.sub}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pain callouts — anchored to specific node */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        {PAINS.map((p) => {
          const a = byId[p.anchor];
          if (!a) return null;
          const cx = a.x + p.dx;
          const cy = a.y + p.dy;
          // Leader-line geometry.
          // dir = +1 ⇒ callout BELOW anchor (line goes from callout-top to anchor-bottom).
          // dir = −1 ⇒ callout ABOVE anchor (line goes from callout-bottom to anchor-top).
          const dir = Math.sign(p.dy) || 1;
          const calloutHalfH = 32;
          const anchorHalfH = (a.h ?? 58) / 2;
          const lineFromX = cx;
          const lineFromY = cy - dir * calloutHalfH;
          const lineToX = a.x;
          const lineToY = a.y + dir * anchorHalfH;
          return (
            <g key={p.id}>
              {!p.noLeader && (
                <motion.svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 1600 900"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: p.delay + 0.05, duration: 0.3 }}
                >
                  <line
                    x1={lineFromX}
                    y1={lineFromY}
                    x2={lineToX}
                    y2={lineToY}
                    stroke="#ff5d6c"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={0.6}
                  />
                </motion.svg>
              )}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: p.delay, duration: 0.4 }}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  transform: 'translate(-50%, -50%)',
                  padding: '7px 11px',
                  border: '1px dashed rgba(255,93,108,0.6)',
                  borderRadius: 6,
                  background: 'rgba(255,93,108,0.08)',
                  color: 'var(--color-ink)',
                  fontSize: 11.5,
                  maxWidth: 190,
                  minWidth: 150,
                  lineHeight: 1.35,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: 'var(--color-danger)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: 3,
                  }}
                >
                  {p.title}
                </div>
                {p.body}
              </motion.div>
            </g>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 36,
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          textAlign: 'center',
        }}
      >
        <span style={{ color: 'var(--color-cool)' }}>Lakehouse</span> stays the system of record ·
        <span style={{ color: 'var(--color-violet)' }}> Graph projection</span> is a curated side-view ·
        <span style={{ color: 'var(--color-danger)' }}>Every copy has a cost</span>
      </motion.div>
    </div>
  );
}
