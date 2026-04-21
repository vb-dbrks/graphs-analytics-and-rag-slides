import { motion } from 'framer-motion';
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 2 — the scenario.
 * Left column: narrative + typed questions.
 * Right column: a proper React Flow diagram — 4 source nodes feeding a
 * research-assistant node. No hand-rolled SVG positioning, no overlap.
 */

// ---------- Node data shapes ----------

type SourceNodeData = {
  label: string;
  sub: string;
  accent: string;
  icon: 'table' | 'graph' | 'doc' | 'note';
};

type AssistantNodeData = {
  needs: string[];
};

type AnyNodeData = SourceNodeData | AssistantNodeData;

// ---------- Question cards (left column) ----------

type Q = { kind: string; q: string; accent: string };
const QUESTIONS: Q[] = [
  { kind: 'mechanism',   q: 'How does Metformin actually treat Type 2 Diabetes?',                accent: '#ff7a45' },
  { kind: 'evidence',    q: 'Which trials inform the current label — and where\u2019s the data?', accent: '#5ec8ff' },
  { kind: 'safety',      q: 'Any safety signals in patients with reduced renal function?',       accent: '#ff5d6c' },
  { kind: 'repurposing', q: 'Could AMPK agonists be repurposed for other indications?',          accent: '#4fd1a5' },
];

// ---------- React Flow nodes + edges ----------

const SOURCE_COLORS = {
  trials: '#5ec8ff',
  kb:     '#b39bff',
  lit:    '#ff7a45',
  notes:  '#4fd1a5',
} as const;

const nodes: Node[] = [
  {
    id: 'trials',
    type: 'source',
    position: { x: 0, y: 0 },
    data: { label: 'Clinical trials & cohorts', sub: 'Delta · outcomes · eligibility', accent: SOURCE_COLORS.trials, icon: 'table' } satisfies SourceNodeData,
  },
  {
    id: 'kb',
    type: 'source',
    position: { x: 0, y: 110 },
    data: { label: 'Biomedical knowledge', sub: 'drugs · targets · pathways', accent: SOURCE_COLORS.kb, icon: 'graph' } satisfies SourceNodeData,
  },
  {
    id: 'lit',
    type: 'source',
    position: { x: 0, y: 220 },
    data: { label: 'Literature & labels', sub: 'PDFs · FDA labels · abstracts', accent: SOURCE_COLORS.lit, icon: 'doc' } satisfies SourceNodeData,
  },
  {
    id: 'notes',
    type: 'source',
    position: { x: 0, y: 330 },
    data: { label: 'Internal clinical notes', sub: 'protocols · SOPs · trial reports', accent: SOURCE_COLORS.notes, icon: 'note' } satisfies SourceNodeData,
  },
  {
    id: 'assistant',
    type: 'assistant',
    position: { x: 420, y: 165 },
    data: { needs: ['relationships', 'evidence chain', 'explanation'] } satisfies AssistantNodeData,
  },
];

const edges: Edge[] = [
  {
    id: 'e-trials',
    source: 'trials',
    target: 'assistant',
    style: { stroke: SOURCE_COLORS.trials, strokeWidth: 1.6, opacity: 0.85 },
    markerEnd: { type: MarkerType.ArrowClosed, color: SOURCE_COLORS.trials, width: 14, height: 14 },
    type: 'default',
  },
  {
    id: 'e-kb',
    source: 'kb',
    target: 'assistant',
    style: { stroke: SOURCE_COLORS.kb, strokeWidth: 1.6, opacity: 0.85 },
    markerEnd: { type: MarkerType.ArrowClosed, color: SOURCE_COLORS.kb, width: 14, height: 14 },
    type: 'default',
  },
  {
    id: 'e-lit',
    source: 'lit',
    target: 'assistant',
    style: { stroke: SOURCE_COLORS.lit, strokeWidth: 1.6, opacity: 0.85 },
    markerEnd: { type: MarkerType.ArrowClosed, color: SOURCE_COLORS.lit, width: 14, height: 14 },
    type: 'default',
  },
  {
    id: 'e-notes',
    source: 'notes',
    target: 'assistant',
    style: { stroke: SOURCE_COLORS.notes, strokeWidth: 1.6, opacity: 0.85 },
    markerEnd: { type: MarkerType.ArrowClosed, color: SOURCE_COLORS.notes, width: 14, height: 14 },
    type: 'default',
  },
];

// ---------- Custom node components ----------

function SourceNode({ data }: NodeProps) {
  const d = data as unknown as SourceNodeData;
  const icon =
    d.icon === 'table'
      ? <TableIcon />
      : d.icon === 'graph'
        ? <GraphIcon />
        : d.icon === 'doc'
          ? <DocIcon />
          : <NoteIcon />;
  return (
    <div
      style={{
        width: 240,
        padding: '10px 12px',
        background: `linear-gradient(90deg, ${d.accent}14, rgba(14,18,24,0.78) 70%)`,
        border: `1px solid ${d.accent}55`,
        borderLeft: `3px solid ${d.accent}`,
        borderRadius: 10,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        fontFamily: 'var(--font-display)',
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 6,
          background: `${d.accent}20`,
          border: `1px solid ${d.accent}60`,
          display: 'grid',
          placeItems: 'center',
          color: d.accent,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: 'var(--color-ink)',
            fontWeight: 600,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {d.label}
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: d.accent,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.03em',
            marginTop: 2,
          }}
        >
          {d.sub}
        </div>
      </div>
      {/* Outgoing handle — right edge, centred */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: d.accent, width: 6, height: 6, border: 'none' }}
        isConnectable={false}
      />
    </div>
  );
}

function AssistantNode({ data }: NodeProps) {
  const d = data as unknown as AssistantNodeData;
  return (
    <div
      style={{
        width: 230,
        padding: '16px 14px',
        background:
          'radial-gradient(circle at 30% 25%, rgba(255,212,121,0.22), rgba(14,18,24,0.92) 72%)',
        border: '2px solid #ffd479',
        borderRadius: 14,
        boxShadow:
          '0 0 0 4px rgba(255,212,121,0.10), 0 18px 48px -22px rgba(0,0,0,0.7)',
        fontFamily: 'var(--font-display)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 9.5,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#ffd479',
          fontWeight: 700,
        }}
      >
        Copilot
      </div>
      <div
        style={{
          fontSize: 17,
          color: 'var(--color-ink)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
        }}
      >
        Research Assistant
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-ink-dim)',
          fontFamily: 'var(--font-mono)',
          lineHeight: 1.4,
        }}
      >
        multi-hop · multi-modal · grounded
      </div>
      <div
        style={{
          marginTop: 4,
          paddingTop: 9,
          borderTop: '1px dashed rgba(255,212,121,0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#ffd479',
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          answer needs
        </div>
        {d.needs.map((t) => (
          <div key={t} style={{ fontSize: 12, color: 'var(--color-ink-dim)' }}>
            <span style={{ color: '#ffd479', marginRight: 7, fontFamily: 'var(--font-mono)' }}>›</span>
            {t}
          </div>
        ))}
      </div>
      {/* Incoming handle — left edge, centred */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#ffd479', width: 8, height: 8, border: 'none' }}
        isConnectable={false}
      />
    </div>
  );
}

const nodeTypes = { source: SourceNode, assistant: AssistantNode };

// ---------- Main slide component ----------

export function Slide2Scenario({ config }: { config: SlideConfig }) {
  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1100 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>Meet the research assistant.</>}
          subtitle="A life-sciences knowledge copilot spanning structured trials, curated ontologies, literature, and clinical notes."
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 240,
          bottom: 110,
          display: 'grid',
          gridTemplateColumns: '1fr 1.15fr',
          gap: 28,
        }}
      >
        {/* Left — narrative + questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: 'var(--color-ink-dim)',
              maxWidth: '56ch',
            }}
          >
            An R&amp;D team wants an assistant that can{' '}
            <span style={{ color: 'var(--color-ink)' }}>answer real questions</span>{' '}
            across their data estate — trial outcomes in Delta, curated
            biomedical knowledge, FDA labels and papers in S3, and clinical
            notes in UC volumes. The questions below all look innocent.{' '}
            <span style={{ color: 'var(--color-warm)' }}>They aren&rsquo;t.</span>
          </motion.p>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
              fontWeight: 600,
              marginTop: 6,
            }}
          >
            Questions it has to handle
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {QUESTIONS.map((q, i) => (
              <motion.div
                key={q.kind}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '9px 12px',
                  background: 'rgba(14,18,24,0.6)',
                  border: `1px solid ${q.accent}30`,
                  borderLeft: `3px solid ${q.accent}`,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: q.accent,
                    fontWeight: 700,
                    minWidth: 90,
                    paddingTop: 2,
                  }}
                >
                  {q.kind}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-ink)', lineHeight: 1.4 }}>
                  {q.q}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — React Flow diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          style={{
            position: 'relative',
            background:
              'radial-gradient(circle at 70% 50%, rgba(255,212,121,0.04), transparent 60%)',
            borderRadius: 12,
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
              fontWeight: 600,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            Data estate
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            nodesDraggable={false}
            nodesConnectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'default' }}
            style={{ background: 'transparent' }}
          >
            <Background color="#1d232d" gap={22} size={1} />
          </ReactFlow>
        </motion.div>
      </div>

      {/* Bottom transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 42,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        Every useful answer{' '}
        <span style={{ color: 'var(--color-warm)' }}>traverses entities and modalities</span>. So
        what does that{' '}
        <span style={{ color: 'var(--color-cool)' }}>cost you in SQL</span>?
      </motion.div>
    </div>
  );
}

// ---------- icons ----------

function TableIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="3" x2="8" y2="15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function GraphIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <circle cx="4" cy="5" r="1.8" fill="currentColor" />
      <circle cx="14" cy="5" r="1.8" fill="currentColor" />
      <circle cx="9" cy="13" r="1.8" fill="currentColor" />
      <path d="M4 5L9 13L14 5M4 5L14 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <path d="M4 2H11L14 5V16H4V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 2V5H14" stroke="currentColor" strokeWidth="1.2" />
      <line x1="6" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.1" />
      <line x1="6" y1="11" x2="12" y2="11" stroke="currentColor" strokeWidth="1.1" />
      <line x1="6" y1="13.5" x2="10" y2="13.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
function NoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
      <rect x="3" y="3" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="5.5" y1="7" x2="12.5" y2="7" stroke="currentColor" strokeWidth="1.1" />
      <line x1="5.5" y1="10" x2="12.5" y2="10" stroke="currentColor" strokeWidth="1.1" />
      <line x1="5.5" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}
