import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 10 — the closing decision framework.
 * Horizontal spine of three questions (all "yes" answers flow rightward),
 * each with a vertical "no" exit to a terminal. The recommended terminal
 * (Hybrid Graph RAG) sits at the end of the spine so the story naturally
 * resolves there.
 */

// ---------- terminal metadata (used by nodes + hover card) ----------

type TerminalId = 'sql' | 'rag' | 'native' | 'hybrid';

type TerminalMeta = {
  id: TerminalId;
  label: string;
  accent: string;
  examples: string[];
  recommended?: boolean;
};

const TERMINALS: Record<TerminalId, TerminalMeta> = {
  sql: {
    id: 'sql',
    label: 'Lakehouse SQL',
    accent: '#5ec8ff',
    examples: ['Reporting / BI', 'Aggregates, KPIs, window fns', 'Broad analytics across wide tables'],
  },
  rag: {
    id: 'rag',
    label: 'Traditional RAG',
    accent: '#ff7a45',
    examples: ['Document-heavy Q&A', 'Chunk-similarity retrieval', 'Single-entity semantic lookup'],
  },
  hybrid: {
    id: 'hybrid',
    label: 'Hybrid Graph RAG',
    accent: '#4fd1a5',
    recommended: true,
    examples: [
      'Connected entities + supporting docs',
      'Multi-hop reasoning with explanations',
      'Usually the right starting point',
    ],
  },
  native: {
    id: 'native',
    label: 'Native graph service',
    accent: '#b39bff',
    examples: [
      'Low-latency relationship serving',
      'Fraud rings, rec path explainability',
      'Specialised traversal workloads',
    ],
  },
};

// ---------- React Flow node + edge defs ----------

const SPINE_COLOR = '#ffd479';    // warm amber for the "yes" spine
const MUTED_EDGE  = '#4a515e';

const nodes: Node[] = [
  {
    id: 'intro',
    type: 'intro',
    position: { x: 0, y: 120 },
    data: { title: 'My domain looks graph-shaped.', footnote: "that alone isn't enough →" },
    draggable: false,
  },
  {
    id: 'q1',
    type: 'question',
    position: { x: 320, y: 130 },
    data: { badge: 'Q1', text: 'Is the problem relationship-first?' },
    draggable: false,
  },
  {
    id: 'q2',
    type: 'question',
    position: { x: 620, y: 130 },
    data: { badge: 'Q2', text: 'Do you need multi-hop / path-based reasoning?' },
    draggable: false,
  },
  {
    id: 'q3',
    type: 'question',
    position: { x: 920, y: 130 },
    data: { badge: 'Q3', text: 'Is hybrid Graph RAG enough?' },
    draggable: false,
  },
  // End-of-spine recommended terminal
  {
    id: 'hybrid',
    type: 'terminal',
    position: { x: 1230, y: 130 },
    data: { ...TERMINALS.hybrid, handleSide: 'left' },
    draggable: false,
  },
  // Downward "no" exit terminals — align under their Q
  {
    id: 'sql',
    type: 'terminal',
    position: { x: 320, y: 360 },
    data: { ...TERMINALS.sql, handleSide: 'top' },
    draggable: false,
  },
  {
    id: 'rag',
    type: 'terminal',
    position: { x: 620, y: 360 },
    data: { ...TERMINALS.rag, handleSide: 'top' },
    draggable: false,
  },
  {
    id: 'native',
    type: 'terminal',
    position: { x: 920, y: 360 },
    data: { ...TERMINALS.native, handleSide: 'top' },
    draggable: false,
  },
];

const edges: Edge[] = [
  // Spine (intro → Q1 → Q2 → Q3 → hybrid) with "yes" labels on Q-to-Q hops
  {
    id: 'e-intro-q1',
    source: 'intro',
    sourceHandle: 'out',
    target: 'q1',
    targetHandle: 'in',
    type: 'default',
    style: { stroke: MUTED_EDGE, strokeWidth: 1.4 },
    markerEnd: { type: MarkerType.ArrowClosed, color: MUTED_EDGE, width: 14, height: 14 },
  },
  {
    id: 'e-q1-q2',
    source: 'q1',
    sourceHandle: 'yes',
    target: 'q2',
    targetHandle: 'in',
    type: 'default',
    label: 'yes',
    style: { stroke: SPINE_COLOR, strokeWidth: 1.8 },
    labelStyle: { fill: SPINE_COLOR, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: SPINE_COLOR, width: 14, height: 14 },
  },
  {
    id: 'e-q2-q3',
    source: 'q2',
    sourceHandle: 'yes',
    target: 'q3',
    targetHandle: 'in',
    type: 'default',
    label: 'yes',
    style: { stroke: SPINE_COLOR, strokeWidth: 1.8 },
    labelStyle: { fill: SPINE_COLOR, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: SPINE_COLOR, width: 14, height: 14 },
  },
  {
    id: 'e-q3-hybrid',
    source: 'q3',
    sourceHandle: 'yes',
    target: 'hybrid',
    targetHandle: 'in',
    type: 'default',
    label: 'yes',
    style: { stroke: TERMINALS.hybrid.accent, strokeWidth: 2 },
    labelStyle: { fill: TERMINALS.hybrid.accent, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: TERMINALS.hybrid.accent, width: 14, height: 14 },
  },
  // "no" exits (vertical, smoothstep)
  {
    id: 'e-q1-sql',
    source: 'q1',
    sourceHandle: 'no',
    target: 'sql',
    targetHandle: 'in',
    type: 'smoothstep',
    label: 'no',
    style: { stroke: TERMINALS.sql.accent, strokeWidth: 1.6, strokeDasharray: '4 4' },
    labelStyle: { fill: TERMINALS.sql.accent, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: TERMINALS.sql.accent, width: 14, height: 14 },
  },
  {
    id: 'e-q2-rag',
    source: 'q2',
    sourceHandle: 'no',
    target: 'rag',
    targetHandle: 'in',
    type: 'smoothstep',
    label: 'no',
    style: { stroke: TERMINALS.rag.accent, strokeWidth: 1.6, strokeDasharray: '4 4' },
    labelStyle: { fill: TERMINALS.rag.accent, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: TERMINALS.rag.accent, width: 14, height: 14 },
  },
  {
    id: 'e-q3-native',
    source: 'q3',
    sourceHandle: 'no',
    target: 'native',
    targetHandle: 'in',
    type: 'smoothstep',
    label: 'no',
    style: { stroke: TERMINALS.native.accent, strokeWidth: 1.6, strokeDasharray: '4 4' },
    labelStyle: { fill: TERMINALS.native.accent, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 },
    labelBgStyle: { fill: '#07090c' },
    labelBgPadding: [4, 6],
    labelBgBorderRadius: 4,
    markerEnd: { type: MarkerType.ArrowClosed, color: TERMINALS.native.accent, width: 14, height: 14 },
  },
];

// ---------- Custom node components ----------

function IntroNode({ data }: NodeProps) {
  const d = data as unknown as { title: string; footnote: string };
  return (
    <div
      style={{
        width: 240,
        padding: '12px 14px',
        background: 'rgba(14,18,24,0.85)',
        border: '1px solid var(--color-line-strong)',
        borderRadius: 10,
        fontFamily: 'var(--font-display)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        start
      </div>
      <div style={{ fontSize: 13.5, color: 'var(--color-ink)', lineHeight: 1.3, fontWeight: 500 }}>
        {d.title}
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px dashed rgba(255,122,69,0.35)',
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-warm)',
          fontWeight: 600,
        }}
      >
        {d.footnote}
      </div>
      <Handle type="source" position={Position.Right} id="out" isConnectable={false} style={handleStyle('#4a515e')} />
    </div>
  );
}

function QuestionNode({ data }: NodeProps) {
  const d = data as unknown as { badge: string; text: string };
  return (
    <div
      style={{
        width: 260,
        padding: '12px 14px',
        background: 'linear-gradient(180deg, rgba(255,122,69,0.14), rgba(14,18,24,0.88))',
        border: '1px solid rgba(255,122,69,0.55)',
        borderRadius: 10,
        fontFamily: 'var(--font-display)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-warm)',
          fontWeight: 800,
          marginBottom: 5,
        }}
      >
        {d.badge}
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-ink)', lineHeight: 1.3, fontWeight: 500 }}>
        {d.text}
      </div>
      <Handle type="target" position={Position.Left}   id="in"  isConnectable={false} style={handleStyle('#4a515e')} />
      <Handle type="source" position={Position.Right}  id="yes" isConnectable={false} style={handleStyle(SPINE_COLOR)} />
      <Handle type="source" position={Position.Bottom} id="no"  isConnectable={false} style={handleStyle('#4a515e')} />
    </div>
  );
}

function TerminalNode({ data }: NodeProps) {
  const d = data as unknown as TerminalMeta & { handleSide: 'top' | 'left' };
  return (
    <div
      style={{
        width: 230,
        padding: '12px 14px',
        background: 'rgba(10,12,16,0.92)',
        border: `1px solid ${d.accent}`,
        borderRadius: 12,
        boxShadow: d.recommended ? `0 0 0 2px ${d.accent}28, 0 10px 26px -14px ${d.accent}80` : '0 8px 22px -16px rgba(0,0,0,0.7)',
        fontFamily: 'var(--font-display)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 5,
        }}
      >
        <div
          style={{
            fontSize: 9.5,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: d.accent,
            fontWeight: 700,
          }}
        >
          recommend
        </div>
        {d.recommended && (
          <span
            style={{
              fontSize: 8.5,
              padding: '2px 6px',
              border: `1px solid ${d.accent}77`,
              borderRadius: 4,
              color: d.accent,
              letterSpacing: '0.14em',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            start here
          </span>
        )}
      </div>
      <div style={{ fontSize: 14.5, color: 'var(--color-ink)', fontWeight: 600, letterSpacing: '-0.005em' }}>
        {d.label}
      </div>
      {d.handleSide === 'top' ? (
        <Handle type="target" position={Position.Top}  id="in" isConnectable={false} style={handleStyle(d.accent)} />
      ) : (
        <Handle type="target" position={Position.Left} id="in" isConnectable={false} style={handleStyle(d.accent)} />
      )}
    </div>
  );
}

const nodeTypes = {
  intro: IntroNode,
  question: QuestionNode,
  terminal: TerminalNode,
};

function handleStyle(color: string) {
  return { background: color, width: 7, height: 7, border: 'none' };
}

// ---------- Slide component ----------

export function Slide8DecisionFramework({ config }: { config: SlideConfig }) {
  const [hover, setHover] = useState<TerminalId | null>(null);

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 960 }}>
        <SlideTitle
          kicker={config.kicker}
          title="A simple decision framework"
          subtitle={config.subtitle}
          small
        />
      </div>

      {/* React Flow canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 220,
          bottom: 130,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
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
          onNodeMouseEnter={(_, n) => {
            if (TERMINALS[n.id as TerminalId]) setHover(n.id as TerminalId);
          }}
          onNodeMouseLeave={() => setHover(null)}
          style={{ background: 'transparent' }}
        >
          <Background color="#1d232d" gap={24} size={1} />
        </ReactFlow>

        {/* Hover detail panel */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 280, pointerEvents: 'none' }}>
          <AnimatePresence mode="wait">
            {hover && (
              <motion.div
                key={hover}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.22 }}
                className="card"
                style={{ padding: '12px 14px', borderLeft: `3px solid ${TERMINALS[hover].accent}` }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.18em',
                    color: TERMINALS[hover].accent,
                    marginBottom: 7,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {TERMINALS[hover].label} · typical use cases
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--color-ink)', fontSize: 13, lineHeight: 1.5 }}>
                  {TERMINALS[hover].examples.map((ex) => (
                    <li
                      key={ex}
                      style={{
                        padding: '4px 0',
                        borderBottom: '1px dashed var(--color-line)',
                      }}
                    >
                      <span style={{ color: TERMINALS[hover].accent, marginRight: 8 }}>›</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Closing tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 46,
          textAlign: 'center',
          fontSize: 22,
          fontWeight: 600,
          color: 'var(--color-ink)',
          letterSpacing: '-0.015em',
        }}
      >
        Graphs matter. <span style={{ color: 'var(--color-warm)' }}>Graph databases are specialised.</span>
      </motion.div>
    </div>
  );
}
