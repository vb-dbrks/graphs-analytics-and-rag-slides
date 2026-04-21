import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Core } from 'cytoscape';
import { InteractiveGraph, type Path } from '@/components/graph/InteractiveGraph';
import { canonicalLifeSci } from '@/components/graph/graphDatasets';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 11 — Interactive retrieval playground.
 * The canonical Metformin/T2D graph. Pick any two nodes, find the shortest
 * path between them, see the traversal highlighted + written out.
 */

type Preset = { label: string; from: string; to: string };

const PRESETS: Preset[] = [
  { label: 'Classic: question → answer',          from: 'q',         to: 'ans' },
  { label: 'Mechanism: Metformin → T2D',          from: 'metformin', to: 't2d' },
  { label: 'Mechanism: Lisinopril → Hypertension', from: 'lisinopril', to: 'htn' },
];

// Elements with label-below so full names render in the graph.
const ELEMENTS = canonicalLifeSci.map((el: any) => {
  if (el.group === 'edges' || !el?.data) return el;
  const existing = typeof el.classes === 'string' ? el.classes : '';
  return existing.includes('label-below') ? el : { ...el, classes: `${existing} label-below` };
});

const NODE_OPTIONS = canonicalLifeSci
  .filter((el: any) => el.group !== 'edges' && el?.data?.id)
  .map((el: any) => ({ id: el.data.id as string, label: (el.data.label as string) ?? el.data.id }));

export function Slide11Playground({
  config,
  replayKey,
  reducedMotion,
}: {
  config: SlideConfig;
  replayKey: number;
  reducedMotion: boolean;
}) {
  const [from, setFrom] = useState<string>('q');
  const [to, setTo] = useState<string>('ans');
  const [path, setPath] = useState<Path | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [cy, setCy] = useState<Core | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = replayKey; // reset path on replay
  const __ = reducedMotion;

  const fromLabel = NODE_OPTIONS.find((n) => n.id === from)?.label ?? from;
  const toLabel = NODE_OPTIONS.find((n) => n.id === to)?.label ?? to;

  const run = () => {
    if (!cy || !from || !to || from === to) {
      setNotFound(true);
      setPath(null);
      return;
    }
    const result: any = cy.elements().aStar({
      root: `#${from}`,
      goal: `#${to}`,
      directed: false,
    });
    if (!result.found || !result.path) {
      setNotFound(true);
      setPath(null);
      return;
    }
    const nodes = result.path.nodes().map((n: any) => n.id() as string);
    const edges = result.path.edges().map((e: any) => e.id() as string);
    setPath({ nodes, edges });
    setNotFound(false);
  };

  const applyPreset = (p: Preset) => {
    setFrom(p.from);
    setTo(p.to);
    // Delay run so state settles first.
    setTimeout(() => {
      if (!cy) return;
      const result: any = cy.elements().aStar({
        root: `#${p.from}`,
        goal: `#${p.to}`,
        directed: false,
      });
      if (result.found && result.path) {
        setPath({
          nodes: result.path.nodes().map((n: any) => n.id() as string),
          edges: result.path.edges().map((e: any) => e.id() as string),
        });
        setNotFound(false);
      } else {
        setPath(null);
        setNotFound(true);
      }
    }, 40);
  };

  const clear = () => {
    setPath(null);
    setNotFound(false);
  };

  const breadcrumb = useMemo(() => {
    if (!path) return null;
    return path.nodes.map((id) => NODE_OPTIONS.find((n) => n.id === id)?.label ?? id);
  }, [path]);

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1080 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>Graph RAG is just pathfinding.</>}
          subtitle="Pick any two nodes in the Metformin / T2D graph. The assistant walks the shortest path — and that path is the answer."
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 240,
          bottom: 170,
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: 22,
          minHeight: 0,
        }}
      >
        {/* Left — controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              borderTop: '2px solid var(--color-warm)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-warm)',
                fontWeight: 700,
              }}
            >
              Query
            </div>
            <FieldLabel label="From" />
            <select value={from} onChange={(e) => setFrom(e.target.value)} style={selectStyle()}>
              {NODE_OPTIONS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <FieldLabel label="To" />
            <select value={to} onChange={(e) => setTo(e.target.value)} style={selectStyle()}>
              {NODE_OPTIONS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <button type="button" onClick={run} style={primaryBtnStyle('var(--color-warm)')}>
              ▶  find path
            </button>
            {(path || notFound) && (
              <button type="button" onClick={clear} style={ghostBtnStyle()}>
                clear highlight
              </button>
            )}
          </div>

          <div
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-cool)',
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              try a preset
            </div>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  background: 'rgba(94,200,255,0.06)',
                  border: '1px solid rgba(94,200,255,0.3)',
                  borderRadius: 6,
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right — graph */}
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
            Canonical Metformin graph · pathfinding
          </div>
          <InteractiveGraph
            elements={ELEMENTS}
            highlightedPath={path}
            fitPadding={50}
            onReady={setCy}
            layout={{
              name: 'fcose',
              animate: true,
              animationDuration: 800,
              randomize: false,
              nodeRepulsion: () => 7500,
              idealEdgeLength: () => 120,
              edgeElasticity: () => 0.45,
              gravity: 0.3,
              padding: 40,
              fit: true,
            } as any}
          />
        </div>
      </div>

      {/* Breadcrumb of the found path */}
      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          bottom: 86,
          minHeight: 50,
        }}
      >
        <AnimatePresence mode="wait">
          {breadcrumb && (
            <motion.div
              key={breadcrumb.join('->')}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="card"
              style={{
                padding: '12px 16px',
                borderLeft: '3px solid var(--color-cool)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-cool)',
                  fontWeight: 700,
                }}
              >
                path · {breadcrumb.length - 1} hops
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {breadcrumb.map((label, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-ink)', fontWeight: 500 }}>{label}</span>
                    {i < breadcrumb.length - 1 && (
                      <span style={{ color: 'var(--color-cool)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="card"
              style={{
                padding: '12px 16px',
                borderLeft: '3px solid var(--color-danger)',
                fontSize: 13,
                color: 'var(--color-ink-dim)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-danger)',
                  fontWeight: 700,
                  marginRight: 10,
                }}
              >
                no path
              </span>
              <span style={{ color: 'var(--color-ink-dim)' }}>
                {fromLabel} and {toLabel} aren&rsquo;t connected in this graph. That&rsquo;s useful signal
                too — the graph tells you honestly what it can&rsquo;t answer.
              </span>
            </motion.div>
          )}
        </AnimatePresence>
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
          bottom: 38,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        Every retrieval question is a{' '}
        <span style={{ color: 'var(--color-cool)' }}>pathfinding problem</span>.{' '}
        <span style={{ color: 'var(--color-warm)' }}>Graph RAG</span> just gives it the right primitive.
      </motion.div>
    </div>
  );
}

// ---------- UI helpers ----------

function FieldLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-faint)',
        fontWeight: 600,
        marginTop: 2,
      }}
    >
      {label}
    </div>
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
    marginTop: 6,
    padding: '10px 12px',
    background: `${accent}22`,
    border: `1px solid ${accent}`,
    borderRadius: 6,
    color: accent,
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    letterSpacing: '0.06em',
    fontWeight: 700,
    cursor: 'pointer',
  };
}

function ghostBtnStyle(): React.CSSProperties {
  return {
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
