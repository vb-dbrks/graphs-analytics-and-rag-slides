import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ElementDefinition } from 'cytoscape';
import { SlideTitle } from '@/components/ui/SlideTitle';
import { InteractiveGraph } from '@/components/graph/InteractiveGraph';
import type { NodeType } from '@/components/graph/graphDatasets';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 5b — Build an LPG graph (interactive).
 * Properties live inline on the node. Edges are typed + directional. Hover
 * a node to see its property object.
 */

type LpgNode = {
  id: string;
  label: string;
  type: NodeType;
  properties: Record<string, string>;
};

type LpgEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

const METFORMIN_NODES: LpgNode[] = [
  { id: 'metformin', label: 'Metformin',         type: 'compound', properties: { launched: '1995', class: 'Biguanide' } },
  { id: 'ampk',      label: 'AMPK',              type: 'target',   properties: { kind: 'Kinase' } },
  { id: 'ins',       label: 'Insulin signalling', type: 'pathway', properties: {} },
  { id: 't2d',       label: 'Type 2 Diabetes',   type: 'disease',  properties: { prevalence: '~10% adults' } },
];

const METFORMIN_EDGES: LpgEdge[] = [
  { id: 'e1', source: 'metformin', target: 'ampk', label: 'TARGETS' },
  { id: 'e2', source: 'ampk',      target: 'ins',  label: 'PARTICIPATES_IN' },
  { id: 'e3', source: 'ins',       target: 't2d',  label: 'ASSOCIATED_WITH' },
  { id: 'e4', source: 'metformin', target: 't2d',  label: 'TREATS' },
];

// Lord of the Rings — a cheeky second preset. Types are mapped loosely to
// the pharma palette so the visual still reads: heroes/allies as orange
// compounds, artefact as a green document, villain as a red disease.
const LOTR_NODES: LpgNode[] = [
  { id: 'frodo',   label: 'Frodo',         type: 'compound', properties: { race: 'Hobbit', age: '50', from: 'Shire' } },
  { id: 'aragorn', label: 'Aragorn',       type: 'compound', properties: { race: 'Human', age: '87', heirOf: 'Gondor' } },
  { id: 'gandalf', label: 'Gandalf',       type: 'compound', properties: { race: 'Maia', colour: 'Grey' } },
  { id: 'sauron',  label: 'Sauron',        type: 'disease',  properties: { role: 'Dark Lord', realm: 'Mordor' } },
  { id: 'ring',    label: 'The One Ring',  type: 'document', properties: { forgedIn: 'Mount Doom', power: 'Invisibility' } },
];

const LOTR_EDGES: LpgEdge[] = [
  { id: 'le1', source: 'frodo',   target: 'ring',    label: 'CARRIES' },
  { id: 'le2', source: 'sauron',  target: 'ring',    label: 'FORGED' },
  { id: 'le3', source: 'gandalf', target: 'frodo',   label: 'ADVISES' },
  { id: 'le4', source: 'aragorn', target: 'frodo',   label: 'PROTECTS' },
  { id: 'le5', source: 'aragorn', target: 'gandalf', label: 'ALLY_OF' },
];

const TYPE_OPTIONS: NodeType[] = [
  'compound',
  'target',
  'pathway',
  'disease',
  'trial',
  'document',
  'cohort',
];

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
}

function parseProps(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  raw.split(',')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [k, ...rest] = pair.split('=');
      if (!k) return;
      out[k.trim()] = rest.join('=').trim();
    });
  return out;
}

function formatPropsShort(p: Record<string, string>): string {
  const entries = Object.entries(p);
  if (entries.length === 0) return '';
  return entries.map(([k, v]) => `${k}=${v}`).join(' · ');
}

function toElements(nodes: LpgNode[], edges: LpgEdge[]): ElementDefinition[] {
  const els: ElementDefinition[] = [];
  nodes.forEach((n) => {
    els.push({
      data: {
        id: n.id,
        label: n.label,
        shortLabel: n.label,
        type: n.type,
      },
      classes: `node-base node-${n.type} label-below`,
    });
  });
  edges.forEach((e) => {
    els.push({
      data: { id: e.id, source: e.source, target: e.target, label: e.label },
      classes: 'edge-base edge-active',
    });
  });
  return els;
}

export function Slide5bLpgPlayground({ config }: { config: SlideConfig }) {
  const [nodes, setNodes] = useState<LpgNode[]>(METFORMIN_NODES);
  const [edges, setEdges] = useState<LpgEdge[]>(METFORMIN_EDGES);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<NodeType>('compound');
  const [newProps, setNewProps] = useState('');

  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const elements = useMemo(() => toElements(nodes, edges), [nodes, edges]);
  const hoveredNode = nodes.find((n) => n.id === hoveredId) ?? null;

  const addNode = () => {
    if (!newName.trim()) return;
    const id = slug(newName);
    if (nodes.some((n) => n.id === id)) return;
    setNodes((prev) => [...prev, { id, label: newName.trim(), type: newType, properties: parseProps(newProps) }]);
    setNewName('');
    setNewProps('');
  };

  const addEdge = () => {
    if (!edgeSource || !edgeTarget || !edgeLabel.trim()) return;
    setEdges((prev) => [
      ...prev,
      {
        id: `e_${Date.now()}`,
        source: edgeSource,
        target: edgeTarget,
        label: edgeLabel.trim().toUpperCase().replace(/\s+/g, '_'),
      },
    ]);
    setEdgeLabel('');
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  };
  const removeEdge = (id: string) => setEdges((prev) => prev.filter((e) => e.id !== id));

  const reset = () => {
    setNodes([]);
    setEdges([]);
  };
  const loadPreset = (n: LpgNode[], e: LpgEdge[]) => {
    setNodes(n);
    setEdges(e);
  };

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1080 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>Build an LPG graph.</>}
          subtitle="Nodes carry their own properties. Edges are typed and directional. Hover a node to see inside it."
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 230,
          bottom: 100,
          display: 'grid',
          gridTemplateColumns: '360px 330px 1fr',
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Left column — forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              borderTop: '2px solid var(--color-warm)',
            }}
          >
            <SectionLabel color="var(--color-warm)" label="Add a node" />
            <Input value={newName} onChange={setNewName} placeholder="Metformin" onEnter={addNode} />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as NodeType)}
              style={selectStyle()}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Input value={newProps} onChange={setNewProps} placeholder="launched=1995, class=Biguanide" onEnter={addNode} />
            <button type="button" onClick={addNode} style={primaryBtnStyle('var(--color-warm)')}>
              + add node
            </button>
          </div>

          <div
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              borderTop: '2px solid var(--color-cool)',
            }}
          >
            <SectionLabel color="var(--color-cool)" label="Add an edge" />
            <select
              value={edgeSource}
              onChange={(e) => setEdgeSource(e.target.value)}
              style={selectStyle()}
            >
              <option value="">source…</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <select
              value={edgeTarget}
              onChange={(e) => setEdgeTarget(e.target.value)}
              style={selectStyle()}
            >
              <option value="">target…</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <Input value={edgeLabel} onChange={setEdgeLabel} placeholder="TARGETS" onEnter={addEdge} />
            <button type="button" onClick={addEdge} style={primaryBtnStyle('var(--color-cool)')}>
              + add edge
            </button>
          </div>

          <div
            style={{
              fontSize: 9.5,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
              fontWeight: 600,
              marginTop: 4,
            }}
          >
            Presets
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => loadPreset(METFORMIN_NODES, METFORMIN_EDGES)}
              style={ghostBtnStyle()}
            >
              💊 Metformin
            </button>
            <button
              type="button"
              onClick={() => loadPreset(LOTR_NODES, LOTR_EDGES)}
              style={ghostBtnStyle()}
            >
              🧙 Middle-earth
            </button>
          </div>
          <button type="button" onClick={reset} style={{ ...ghostBtnStyle(), flex: 'none' }}>
            clear all
          </button>
        </div>

        {/* Middle — entity inspector / list */}
        <div
          className="card"
          style={{
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minHeight: 0,
          }}
        >
          <SectionLabel color={hoveredNode ? 'var(--color-warm)' : 'var(--color-ink-faint)'} label={hoveredNode ? 'inspect node' : 'entities'} />
          {hoveredNode ? (
            <HoveredNodePanel node={hoveredNode} />
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
              <EntitySection label="Nodes" count={nodes.length}>
                <AnimatePresence initial={false}>
                  {nodes.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={itemStyle()}
                    >
                      <span
                        style={{
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <span style={{ color: 'var(--color-warm)' }}>{n.label}</span>{' '}
                        <span style={{ color: 'var(--color-ink-faint)' }}>:{n.type}</span>
                        {Object.keys(n.properties).length > 0 && (
                          <span style={{ color: 'var(--color-grounded)' }}>
                            {' '}
                            {`{${formatPropsShort(n.properties)}}`}
                          </span>
                        )}
                      </span>
                      <button type="button" onClick={() => removeNode(n.id)} style={removeBtnStyle()}>
                        ×
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {nodes.length === 0 && <div style={emptyHintStyle()}>no nodes yet.</div>}
              </EntitySection>
              <EntitySection label="Edges" count={edges.length}>
                <AnimatePresence initial={false}>
                  {edges.map((e) => {
                    const src = nodes.find((n) => n.id === e.source)?.label ?? e.source;
                    const tgt = nodes.find((n) => n.id === e.target)?.label ?? e.target;
                    return (
                      <motion.div
                        key={e.id}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={itemStyle()}
                      >
                        <span>
                          <span style={{ color: 'var(--color-warm)' }}>{src}</span>{' '}
                          <span style={{ color: 'var(--color-ink-faint)' }}>-[</span>
                          <span style={{ color: 'var(--color-cool)' }}>{e.label}</span>
                          <span style={{ color: 'var(--color-ink-faint)' }}>]→</span>{' '}
                          <span style={{ color: 'var(--color-grounded)' }}>{tgt}</span>
                        </span>
                        <button type="button" onClick={() => removeEdge(e.id)} style={removeBtnStyle()}>
                          ×
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {edges.length === 0 && <div style={emptyHintStyle()}>no edges yet.</div>}
              </EntitySection>
            </div>
          )}
        </div>

        {/* Right — Cytoscape */}
        <div
          className="card"
          style={{
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 14,
              zIndex: 5,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-warm)',
              fontWeight: 700,
            }}
          >
            Property graph
          </div>
          <InteractiveGraph elements={elements} fitPadding={40} onNodeHover={setHoveredId} />
        </div>
      </div>

      {/* Bottom takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 40,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        Properties live on the node · edges are typed and directional ·{' '}
        <span style={{ color: 'var(--color-warm)' }}>the shape matches your traversal</span>.
      </motion.div>
    </div>
  );
}

// ---------- sub-components ----------

function HoveredNodePanel({ node }: { node: LpgNode }) {
  const entries = Object.entries(node.properties);
  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div style={{ fontSize: 16, color: 'var(--color-ink)', fontWeight: 600 }}>{node.label}</div>
      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-warm)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        :{node.type}
      </div>
      <div
        style={{
          padding: '10px 12px',
          background: 'rgba(7,9,12,0.7)',
          border: '1px solid var(--color-line)',
          borderRadius: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-ink)',
          lineHeight: 1.6,
        }}
      >
        {entries.length === 0 ? (
          <span style={{ color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>no properties</span>
        ) : (
          <>
            <span style={{ color: 'var(--color-ink-faint)' }}>{'{'}</span>
            {entries.map(([k, v], i) => (
              <div key={k} style={{ paddingLeft: 10 }}>
                <span style={{ color: 'var(--color-cool)' }}>{k}</span>
                <span style={{ color: 'var(--color-ink-faint)' }}>: </span>
                <span style={{ color: 'var(--color-grounded)' }}>&quot;{v}&quot;</span>
                {i < entries.length - 1 && <span style={{ color: 'var(--color-ink-faint)' }}>,</span>}
              </div>
            ))}
            <span style={{ color: 'var(--color-ink-faint)' }}>{'}'}</span>
          </>
        )}
      </div>
      <div
        style={{
          fontSize: 10.5,
          color: 'var(--color-ink-faint)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.06em',
        }}
      >
        ← move off the node to see the full list
      </div>
    </motion.div>
  );
}

function EntitySection({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          fontWeight: 600,
        }}
      >
        {label} ({count})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  );
}

function SectionLabel({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      placeholder={placeholder}
      style={{
        padding: '7px 10px',
        background: 'rgba(7,9,12,0.75)',
        border: '1px solid var(--color-line)',
        borderRadius: 6,
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        outline: 'none',
      }}
    />
  );
}

function selectStyle(): React.CSSProperties {
  return {
    padding: '7px 10px',
    background: 'rgba(7,9,12,0.75)',
    border: '1px solid var(--color-line)',
    borderRadius: 6,
    color: 'var(--color-ink)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    outline: 'none',
  };
}

function primaryBtnStyle(accent: string): React.CSSProperties {
  return {
    marginTop: 4,
    padding: '8px 12px',
    background: `${accent}20`,
    border: `1px solid ${accent}`,
    borderRadius: 6,
    color: accent,
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    letterSpacing: '0.06em',
    fontWeight: 600,
    cursor: 'pointer',
  };
}

function ghostBtnStyle(): React.CSSProperties {
  return {
    flex: 1,
    padding: '7px 10px',
    background: 'transparent',
    border: '1px solid var(--color-line)',
    borderRadius: 6,
    color: 'var(--color-ink-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    letterSpacing: '0.04em',
    cursor: 'pointer',
  };
}

function removeBtnStyle(): React.CSSProperties {
  return {
    padding: '0 6px',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-ink-faint)',
    fontSize: 14,
    cursor: 'pointer',
    lineHeight: 1,
  };
}

function emptyHintStyle(): React.CSSProperties {
  return {
    padding: '6px 8px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--color-ink-faint)',
    fontStyle: 'italic',
  };
}

function itemStyle(): React.CSSProperties {
  return {
    padding: '5px 8px',
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid var(--color-line)',
    borderRadius: 5,
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    color: 'var(--color-ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    lineHeight: 1.3,
  };
}
