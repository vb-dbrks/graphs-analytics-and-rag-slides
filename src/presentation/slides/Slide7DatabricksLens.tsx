import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 7 — the architecture-stack view.
 * Lakehouse occupies the backbone (ingestion → delta → medallion). Enrichment
 * and serving layers stack on top. Unity Catalog runs as a governance spine
 * along the right. The graph projection sits as an explicit side-spur off the
 * curated-entity layer so it visually reads as a *branch*, not a replacement.
 */

type StackRow = {
  id: string;
  label: string;
  role: string;
  tone: 'foundation' | 'lakehouse' | 'enrich' | 'serve-primary' | 'serve-spur' | 'consumers';
  delay: number;
  width?: 'full' | 'primary';
};

// Rows go BOTTOM → TOP conceptually. We render them via column-reverse so the
// first entry sits at the bottom of the stack.
const ROWS: StackRow[] = [
  { id: 'ingest',    label: 'Ingestion · CDC',             role: 'Kafka · DLT · Lakeflow Connect',    tone: 'foundation',    delay: 0.25 },
  { id: 'delta',     label: 'Delta / Lakehouse storage',   role: 'single source of truth',            tone: 'foundation',    delay: 0.35 },
  { id: 'medallion', label: 'Medallion · curated entities',role: 'Bronze → Silver → Gold',            tone: 'lakehouse',     delay: 0.48 },
  { id: 'extract',   label: 'Entity extraction',           role: 'LLM · NER over docs',               tone: 'enrich',        delay: 0.62 },
  { id: 'embed',     label: 'Embeddings & vector index',   role: 'Mosaic AI vector search',           tone: 'enrich',        delay: 0.72 },
  { id: 'apps',      label: 'Apps · agents · APIs',        role: 'Agent Framework · Serving · Apps',  tone: 'consumers',     delay: 1.05 },
];

type ToneDef = { accent: string; bg: string; border: string };
const TONE: Record<StackRow['tone'], ToneDef> = {
  foundation:    { accent: '#5ec8ff',           bg: 'rgba(94,200,255,0.07)',  border: 'rgba(94,200,255,0.32)' },
  lakehouse:     { accent: '#5ec8ff',           bg: 'rgba(94,200,255,0.11)',  border: 'rgba(94,200,255,0.48)' },
  enrich:        { accent: '#ff7a45',           bg: 'rgba(255,122,69,0.08)',  border: 'rgba(255,122,69,0.4)' },
  'serve-primary':{accent: '#5ec8ff',           bg: 'rgba(94,200,255,0.08)',  border: 'rgba(94,200,255,0.45)' },
  'serve-spur':  { accent: '#b39bff',           bg: 'rgba(179,155,255,0.08)', border: 'rgba(179,155,255,0.5)' },
  consumers:     { accent: '#ffd479',           bg: 'rgba(255,212,121,0.09)', border: 'rgba(255,212,121,0.48)' },
};

export function Slide7DatabricksLens({ config }: { config: SlideConfig }) {
  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1020 }}>
        <SlideTitle
          kicker={config.kicker}
          title="How this fits in a Databricks architecture"
          subtitle={config.subtitle}
          small
        />
      </div>

      {/* Stack column — takes the left ~55% of the viewport */}
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 230,
          bottom: 130,
          width: 780,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 9,
        }}
      >
        {ROWS.map((r) => (
          <StackCard key={r.id} row={r} />
        ))}

        {/* Serving row — a dedicated flex row so vector + graph spur sit side-by-side */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.86, duration: 0.5, ease: 'easeOut' }}
          style={{ display: 'flex', gap: 10 }}
        >
          <ServingCard
            label="Vector index"
            role="retrieval-ready chunks"
            tone="serve-primary"
            flex={3}
          />
          <ServingCard
            label="Graph projection · native graph"
            role="curated entities → LPG · optional serving"
            tone="serve-spur"
            flex={2}
            dashed
          />
        </motion.div>
      </div>

      {/* Unity Catalog — governance spine running the full height of the stack */}
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.15, duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: 900,
          top: 230,
          bottom: 130,
          width: 160,
          border: '1px solid rgba(79,209,165,0.42)',
          background: 'linear-gradient(180deg, rgba(79,209,165,0.1), rgba(14,18,24,0.6))',
          borderRadius: 12,
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-grounded)',
            fontWeight: 700,
          }}
        >
          Governance spine
        </div>
        <div style={{ fontSize: 16, color: 'var(--color-ink)', fontWeight: 600, lineHeight: 1.2 }}>
          Unity Catalog
        </div>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
            fontSize: 11.5,
            color: 'var(--color-ink-dim)',
            lineHeight: 1.35,
          }}
        >
          {['lineage', 'ACLs + tags', 'attribute-based policy', 'discovery'].map((i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--color-grounded)',
                  flexShrink: 0,
                }}
              />
              {i}
            </li>
          ))}
        </ul>
        <div
          style={{
            marginTop: 'auto',
            fontSize: 10,
            color: 'var(--color-ink-faint)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            lineHeight: 1.4,
          }}
        >
          spans every layer — graph included
        </div>
      </motion.div>

      {/* Right margin: why the graph branch is subordinate */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.55 }}
        style={{
          position: 'absolute',
          left: 1100,
          top: 230,
          width: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            border: '1px dashed rgba(179,155,255,0.55)',
            borderRadius: 12,
            background: 'rgba(179,155,255,0.06)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-violet)',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            Optional branch
          </div>
          <div style={{ fontSize: 15, color: 'var(--color-ink)', fontWeight: 600, marginBottom: 6 }}>
            Curated entities → LPG projection → Native graph service
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--color-ink-dim)', lineHeight: 1.5 }}>
            Lives alongside the lakehouse, not in place of it. Sync from Silver/Gold curated tables;
            serve low-latency traversal to agents that need it.
          </div>
        </div>
        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(14,18,24,0.65)',
            border: '1px solid var(--color-line)',
            borderRadius: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-warm)',
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            What stays in Databricks
          </div>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontSize: 12.5,
              color: 'var(--color-ink-dim)',
              lineHeight: 1.5,
            }}
          >
            {[
              'Source of truth (Delta)',
              'Entity extraction + embeddings',
              'Lineage, ACLs, audit — everything UC',
              'Agents, serving, apps',
            ].map((t) => (
              <li key={t} style={{ padding: '3px 0' }}>
                <span style={{ color: 'var(--color-grounded)', marginRight: 8 }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Bottom takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 42,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ color: 'var(--color-cool)' }}>Lakehouse</span> is the centre of gravity ·
        <span style={{ color: 'var(--color-violet)' }}> Graph</span> is a targeted serving branch ·
        <span style={{ color: 'var(--color-grounded)' }}> UC</span> spans both.
      </motion.div>
    </div>
  );
}

function StackCard({ row }: { row: StackRow }) {
  const tone = TONE[row.tone];
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: row.delay, duration: 0.5, ease: 'easeOut' }}
      style={{
        padding: '12px 16px',
        background: `linear-gradient(90deg, ${tone.bg}, rgba(14,18,24,0.5) 65%)`,
        border: `1px solid ${tone.border}`,
        borderLeft: `3px solid ${tone.accent}`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ fontSize: 15, color: 'var(--color-ink)', fontWeight: 600, letterSpacing: '-0.01em' }}>
        {row.label}
      </div>
      <div
        style={{
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: tone.accent,
          letterSpacing: '0.08em',
          fontWeight: 500,
          opacity: 0.9,
          textAlign: 'right',
        }}
      >
        {row.role}
      </div>
    </motion.div>
  );
}

function ServingCard({
  label,
  role,
  tone,
  flex,
  dashed,
}: {
  label: string;
  role: string;
  tone: 'serve-primary' | 'serve-spur';
  flex: number;
  dashed?: boolean;
}) {
  const t = TONE[tone];
  return (
    <div
      style={{
        flex,
        padding: '12px 16px',
        background: `linear-gradient(90deg, ${t.bg}, rgba(14,18,24,0.5) 65%)`,
        border: `1px ${dashed ? 'dashed' : 'solid'} ${t.border}`,
        borderLeft: `3px solid ${t.accent}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: t.accent,
          fontWeight: 600,
          marginBottom: 3,
        }}
      >
        serving
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-ink)', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--color-ink-dim)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
        {role}
      </div>
    </div>
  );
}
