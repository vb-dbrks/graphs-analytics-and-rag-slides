import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

type Lane = 'graph' | 'hybrid' | 'elsewhere';

type Workload = {
  id: string;
  label: string;
  lane: Lane;
  reason: string;
};

const WORKLOADS: Workload[] = [
  // Graph-friendly
  { id: 'path', label: 'Path exploration',                lane: 'graph',     reason: 'Multi-hop traversal is the whole point.' },
  { id: 'rec',  label: 'Recommendation explanation',      lane: 'graph',     reason: 'Why was this recommended? Relationships become the explanation.' },
  { id: 'low',  label: 'Low-latency relationship lookup', lane: 'graph',     reason: 'Sub-10ms traversal at service-tier SLAs.' },
  { id: 'int',  label: 'Compound interaction reasoning',  lane: 'graph',     reason: 'Chain of effects across targets and pathways.' },
  // Hybrid
  { id: 'rag',  label: 'Context-aware RAG',               lane: 'hybrid',    reason: 'Vectors + entity relationships working together.' },
  { id: 'lin',  label: 'Metadata lineage navigation',     lane: 'hybrid',    reason: 'Lineage is a graph query; projection from UC is cheap.' },
  // Better elsewhere
  { id: 'kpi',  label: 'Aggregate KPI dashboard',         lane: 'elsewhere', reason: 'GROUP BY, window functions. Columnar SQL wins.' },
  { id: 'etl',  label: 'Batch ETL transform',             lane: 'elsewhere', reason: 'Wide scans + joins. Spark destroys a graph DB here.' },
  { id: 'rpt',  label: 'Standard reporting',              lane: 'elsewhere', reason: 'Tabular outputs. No relationship traversal needed.' },
];

type LaneDef = {
  id: Lane;
  label: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
};

const LANES: LaneDef[] = [
  {
    id: 'graph',
    label: 'Graph-friendly',
    subtitle: 'relationship-first, multi-hop',
    accent: 'var(--color-grounded)',
    icon: <GraphIcon />,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    subtitle: 'vectors + graph, together',
    accent: 'var(--color-warm)',
    icon: <HybridIcon />,
  },
  {
    id: 'elsewhere',
    label: 'Better elsewhere',
    subtitle: 'columnar / scan-heavy / aggregate',
    accent: 'var(--color-cool)',
    icon: <TableIcon />,
  },
];

export function Slide4WorksVsDoesnt({ config }: { config: SlideConfig }) {
  const [hover, setHover] = useState<Workload | null>(null);

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 960 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>What works. What doesn’t. What’s hybrid.</>}
          subtitle={config.subtitle}
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '5vw',
          right: '5vw',
          top: 230,
          bottom: 120,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 22,
        }}
      >
        {LANES.map((lane, laneIdx) => {
          const laneCases = WORKLOADS.filter((w) => w.lane === lane.id);
          return (
            <motion.div
              key={lane.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 + laneIdx * 0.14, ease: 'easeOut' }}
              className="card"
              style={{
                padding: '20px 20px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                borderTop: `2px solid ${lane.accent}`,
                background: `linear-gradient(180deg, ${lane.accent}12, rgba(14,18,24,0.75) 44%)`,
              }}
            >
              {/* Lane header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: `${lane.accent}18`,
                    border: `1px solid ${lane.accent}55`,
                    display: 'grid',
                    placeItems: 'center',
                    color: lane.accent,
                    flexShrink: 0,
                  }}
                >
                  {lane.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: lane.accent,
                        fontWeight: 700,
                      }}
                    >
                      {lane.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--color-ink-faint)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {laneCases.length} case{laneCases.length === 1 ? '' : 's'}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-ink-dim)', marginTop: 4, lineHeight: 1.4 }}>
                    {lane.subtitle}
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {laneCases.map((w, i) => (
                  <motion.button
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + laneIdx * 0.14 + i * 0.08, duration: 0.45 }}
                    onMouseEnter={() => setHover(w)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(w)}
                    onBlur={() => setHover(null)}
                    whileHover={{ y: -2 }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: 'rgba(14,18,24,0.82)',
                      border: `1px solid ${lane.accent}30`,
                      borderRadius: 8,
                      color: 'var(--color-ink)',
                      fontSize: 13.5,
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'border-color 180ms, background 180ms',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 999,
                        background: lane.accent,
                        flexShrink: 0,
                      }}
                    />
                    {w.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hover detail strip */}
      <div style={{ position: 'absolute', left: '5vw', bottom: 38, right: '5vw', height: 50 }}>
        <AnimatePresence mode="wait">
          {hover ? (
            <motion.div
              key={hover.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.22 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 16px',
                background: 'rgba(14,18,24,0.85)',
                border: `1px solid ${laneAccent(hover.lane)}60`,
                borderRadius: 10,
                fontFamily: 'var(--font-display)',
                fontSize: 13,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: laneAccent(hover.lane),
                  fontWeight: 600,
                }}
              >
                {laneLabel(hover.lane)}
              </span>
              <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{hover.label}</span>
              <span style={{ color: 'var(--color-ink-faint)' }}>·</span>
              <span style={{ color: 'var(--color-ink-dim)' }}>{hover.reason}</span>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              style={{ fontSize: 12, color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
            >
              hover a workload for the reasoning.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function laneAccent(lane: Lane) {
  return lane === 'graph'
    ? 'var(--color-grounded)'
    : lane === 'hybrid'
      ? 'var(--color-warm)'
      : 'var(--color-cool)';
}
function laneLabel(lane: Lane) {
  return lane === 'graph' ? 'graph-friendly' : lane === 'hybrid' ? 'hybrid' : 'better elsewhere';
}

// ---------- icons ----------

function GraphIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4" r="2" fill="currentColor" />
      <circle cx="14" cy="4" r="2" fill="currentColor" />
      <circle cx="9" cy="14" r="2" fill="currentColor" />
      <path d="M4 4L9 14L14 4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 4L14 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function HybridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <rect x="10" y="5" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      <line x1="9" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function TableIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="2" y1="8"  x2="16" y2="8"  stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.2" />
      <line x1="7" y1="4"  x2="7"  y2="14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
