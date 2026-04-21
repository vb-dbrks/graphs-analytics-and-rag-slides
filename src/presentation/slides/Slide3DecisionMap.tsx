import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import { CalloutPanel } from '@/components/ui/CalloutPanel';
import type { SlideConfig } from './slideConfigs';

/**
 * Coord system: x=0(left)→100(right) relationship complexity.
 *               y=0(bottom)→100(top) scale / distributed analytics.
 * SVG path coordinates are y-flipped once, only when drawing shapes.
 *
 * Zones form a deliberate "Z": two top corners (Lakehouse left, Native
 * Graph right) and a horizontal Hybrid band across the bottom half.
 * They do NOT overlap — a clean decision geography.
 */

type UseCase = {
  id: string;
  label: string;
  x: number;
  y: number;
  rationale: string;
  zone: 'lakehouse' | 'graph' | 'hybrid';
};

// Cards are positioned so they each sit inside their zone, spaced out.
const CASES: UseCase[] = [
  // Lakehouse / SQL — top-left (high scale, low relationship)
  { id: 'bi',     label: 'BI reporting',            x: 10, y: 86, zone: 'lakehouse', rationale: 'Scan-heavy aggregates. Columnar SQL wins every time.' },
  { id: 'c360',   label: 'Customer 360',            x: 28, y: 68, zone: 'lakehouse', rationale: 'Graph-shaped domain, but relationship queries are mostly joins.' },
  { id: 'cohort', label: 'Patient cohort analysis', x: 35, y: 82, zone: 'lakehouse', rationale: 'Filter + aggregate across wide tables. Graph adds nothing.' },

  // Native Graph — top-right (high scale OR high-stakes serving, high relationship)
  { id: 'fraud', label: 'Fraud ring detection',   x: 88, y: 80, zone: 'graph', rationale: 'Ring topology + low-latency multi-hop. Canonical native-graph.' },
  { id: 'dtp',   label: 'Drug–target–pathway',    x: 70, y: 65, zone: 'graph', rationale: 'Relationship-first, multi-hop, path-sensitive reasoning.' },

  // Hybrid Graph RAG — bottom band (medium scale, anywhere from low to high relationship)
  { id: 'docqa',   label: 'Document Q&A',             x: 18, y: 28, zone: 'hybrid', rationale: 'Vector retrieval handles it. Graph only if entity context matters.' },
  { id: 'lineage', label: 'Data lineage exploration', x: 50, y: 38, zone: 'hybrid', rationale: 'Multi-hop lineage is a graph query. Projecting UC metadata is cheap.' },
  { id: 'rec',     label: 'Recommendation paths',     x: 78, y: 30, zone: 'hybrid', rationale: 'Hybrid shines — vector recall + relationship re-ranking.' },
];

type Zone = {
  id: 'lakehouse' | 'hybrid' | 'graph';
  label: string;
  color: string;
  x: [number, number];
  y: [number, number];
  labelX: number;
  labelY: number;
  labelAlign: 'start' | 'end';
};

// Non-overlapping rectangles in a "Z" layout.
const ZONES: Zone[] = [
  {
    id: 'lakehouse',
    label: 'Lakehouse / SQL',
    color: '#5ec8ff',
    x: [0, 42],
    y: [52, 100],
    labelX: 3,
    labelY: 95,
    labelAlign: 'start',
  },
  {
    id: 'graph',
    label: 'Native Graph',
    color: '#4fd1a5',
    x: [58, 100],
    y: [52, 100],
    labelX: 97,
    labelY: 95,
    labelAlign: 'end',
  },
  {
    id: 'hybrid',
    label: 'Hybrid Graph RAG',
    color: '#ff7a45',
    x: [6, 94],
    y: [8, 48],
    labelX: 50,
    labelY: 44,
    labelAlign: 'start',
  },
];

function rectPath(x: [number, number], y: [number, number]): string {
  const svgYTop = 100 - y[1];
  const svgYBottom = 100 - y[0];
  return `M ${x[0]} ${svgYTop} L ${x[1]} ${svgYTop} L ${x[1]} ${svgYBottom} L ${x[0]} ${svgYBottom} Z`;
}

export function Slide3DecisionMap({ config }: { config: SlideConfig }) {
  const [hovered, setHovered] = useState<UseCase | null>(null);

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 840 }}>
        <SlideTitle
          kicker={config.kicker}
          title="When does a graph actually make sense?"
          subtitle={config.subtitle}
          small
        />
      </div>

      {/* Chart frame */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          right: 400,
          top: 250,
          bottom: 130,
        }}
      >
        <ChartBackground />
        <ZoneLabels />
        <AxisLabels />

        {/* Use-case cards */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3 }}>
          {CASES.map((c, i) => {
            const isHovered = hovered?.id === c.id;
            const accent =
              c.zone === 'graph'
                ? '#4fd1a5'
                : c.zone === 'lakehouse'
                  ? '#5ec8ff'
                  : '#ff7a45';
            return (
              <motion.button
                key={c.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                onMouseEnter={() => setHovered(c)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(c)}
                onBlur={() => setHovered(null)}
                style={{
                  position: 'absolute',
                  left: `${c.x}%`,
                  top: `${100 - c.y}%`,
                  transform: 'translate(-50%, -50%)',
                  padding: '8px 13px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 12.5,
                  fontWeight: 500,
                  background: 'rgba(10,12,16,0.92)',
                  color: 'var(--color-ink)',
                  border: `1px solid ${accent}99`,
                  borderRadius: 8,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  backdropFilter: 'blur(4px)',
                  boxShadow: isHovered
                    ? `0 0 0 3px ${accent}33, 0 10px 22px -12px ${accent}`
                    : '0 8px 20px -12px rgba(0,0,0,0.7)',
                  transition: 'box-shadow 180ms, border-color 180ms',
                }}
              >
                {c.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Right side: legend + callout */}
      <div
        style={{
          position: 'absolute',
          right: 40,
          top: 250,
          width: 330,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div className="card" style={{ padding: '14px 16px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--color-warm)',
              marginBottom: 10,
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Zones
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { color: '#5ec8ff', label: 'Lakehouse / SQL',    sub: 'scale-heavy, few hops' },
              { color: '#ff7a45', label: 'Hybrid Graph RAG',   sub: 'vectors + relationships' },
              { color: '#4fd1a5', label: 'Native Graph',       sub: 'relationship-first, low-latency' },
            ].map((z) => (
              <div key={z.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--color-ink)' }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: z.color,
                    opacity: 0.65,
                    border: `1px solid ${z.color}`,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  {z.label}
                  <div style={{ fontSize: 11, color: 'var(--color-ink-faint)', marginTop: 1 }}>{z.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CalloutPanel
          visible={hovered !== null}
          tone={hovered?.zone === 'graph' ? 'good' : hovered?.zone === 'lakehouse' ? 'cool' : 'warm'}
          title={hovered?.label ?? ''}
          body={hovered?.rationale}
          style={{ position: 'relative' }}
        />

        {!hovered && (
          <div
            style={{
              padding: '10px 14px',
              fontSize: 12,
              color: 'var(--color-ink-faint)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
            }}
          >
            hover a card for the reasoning.
          </div>
        )}
      </div>
    </div>
  );
}

function ChartBackground() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      {/* Zone fills */}
      {ZONES.map((z, i) => (
        <g key={z.id}>
          <motion.path
            d={rectPath(z.x, z.y)}
            fill={z.color}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.13 }}
            transition={{ delay: 0.55 + i * 0.15, duration: 0.7 }}
          />
          <motion.path
            d={rectPath(z.x, z.y)}
            fill="none"
            stroke={z.color}
            strokeWidth={0.18}
            strokeOpacity={0.55}
            strokeDasharray="1 1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + i * 0.15, duration: 0.9 }}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
      {/* Grid */}
      {[25, 50, 75].map((p) => (
        <line key={`h${p}`} x1={0} y1={p} x2={100} y2={p} stroke="#1d232d" strokeWidth={0.1} />
      ))}
      {[25, 50, 75].map((p) => (
        <line key={`v${p}`} x1={p} y1={0} x2={p} y2={100} stroke="#1d232d" strokeWidth={0.1} />
      ))}
      {/* Axes */}
      <line x1={0} y1={100} x2={100} y2={100} stroke="#2a313d" strokeWidth={0.25} />
      <line x1={0} y1={0}   x2={0}   y2={100} stroke="#2a313d" strokeWidth={0.25} />
    </svg>
  );
}

function ZoneLabels() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {ZONES.map((z, i) => (
        <motion.div
          key={z.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.15, duration: 0.55 }}
          style={{
            position: 'absolute',
            left: z.labelAlign === 'start' ? `${z.labelX}%` : undefined,
            right: z.labelAlign === 'end' ? `${100 - z.labelX}%` : undefined,
            top: `${100 - z.labelY}%`,
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: z.color,
            fontWeight: 700,
            opacity: 0.95,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {z.label}
        </motion.div>
      ))}
    </div>
  );
}

function AxisLabels() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          bottom: -28,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--color-ink-faint)',
          pointerEvents: 'none',
        }}
      >
        relationship complexity →
      </div>
      <div
        style={{
          position: 'absolute',
          left: -10,
          top: '50%',
          transform: 'translate(-100%, -50%) rotate(-90deg)',
          transformOrigin: 'right center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.18em',
          color: 'var(--color-ink-faint)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        scale / distributed analytics →
      </div>
    </>
  );
}
