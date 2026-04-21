import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ElementDefinition } from 'cytoscape';
import { GraphScene } from '@/components/graph/GraphScene';
import type { TimelineStep } from '@/components/graph/timelineRunner';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 6 — side-by-side: traditional RAG vs Graph RAG on the same question.
 * Both panes use the real-entity example (Metformin / T2D / UKPDS) so the
 * audience keeps their bearings. The left pane emphasises chunk-similarity
 * retrieval; the right pane emphasises entity-graph traversal. Timelines
 * run in sync so the comparison is direct.
 */

// ---------- Left pane — traditional RAG ----------
const VECTOR_SIDE: ElementDefinition[] = [
  { data: { id: 'vq',  label: 'Question',     type: 'question',     shortLabel: '?'   }, classes: 'node-base node-question     label-below' },
  { data: { id: 'vix', label: 'Vector index', type: 'vector_index', shortLabel: 'VIX' }, classes: 'node-base node-vector_index  label-below' },
  { data: { id: 'vc1', label: '"…activates AMPK…"',       type: 'chunk', shortLabel: '§1' }, classes: 'node-base node-chunk label-below' },
  { data: { id: 'vc2', label: '"…reduces hepatic gluconeogenesis…"', type: 'chunk', shortLabel: '§2' }, classes: 'node-base node-chunk label-below' },
  { data: { id: 'vc3', label: '"…UKPDS cardiovascular benefit…"',    type: 'chunk', shortLabel: '§3' }, classes: 'node-base node-chunk label-below' },
  { data: { id: 'vc4', label: '"…lactic acidosis risk…"',             type: 'chunk', shortLabel: '§4' }, classes: 'node-base node-chunk label-below' },
  { data: { id: 'va',  label: 'Answer',       type: 'answer',       shortLabel: 'A'   }, classes: 'node-base node-answer       label-below' },

  { data: { id: 've1', source: 'vq',  target: 'vix', type: 'QUERIES'    }, classes: 'edge-base' },
  { data: { id: 've2', source: 'vix', target: 'vc1', type: 'INDEXED_IN' }, classes: 'edge-base' },
  { data: { id: 've3', source: 'vix', target: 'vc2', type: 'INDEXED_IN' }, classes: 'edge-base' },
  { data: { id: 've4', source: 'vix', target: 'vc3', type: 'INDEXED_IN' }, classes: 'edge-base' },
  { data: { id: 've5', source: 'vix', target: 'vc4', type: 'INDEXED_IN' }, classes: 'edge-base' },
  { data: { id: 've6', source: 'vc1', target: 'va',  type: 'SUPPORTS'   }, classes: 'edge-base' },
  { data: { id: 've7', source: 'vc2', target: 'va',  type: 'SUPPORTS'   }, classes: 'edge-base' },
];

// Hub-and-spoke preset positions for the vector pane.
const VECTOR_POSITIONS: Record<string, { x: number; y: number }> = {
  vq:  { x:  80, y: 240 },
  vix: { x: 260, y: 240 },
  vc1: { x: 460, y: 110 },
  vc2: { x: 460, y: 195 },
  vc3: { x: 460, y: 280 },
  vc4: { x: 460, y: 365 },
  va:  { x: 640, y: 240 },
};

const VECTOR_SIDE_POSITIONED: ElementDefinition[] = VECTOR_SIDE.map((el) => {
  if (el.group === 'edges' || !el.data?.id) return el;
  const pos = VECTOR_POSITIONS[el.data.id as string];
  return pos ? { ...el, position: pos } : el;
});

// ---------- Right pane — Graph RAG ----------
const GRAPH_SIDE: ElementDefinition[] = [
  { data: { id: 'gq',        label: 'Question',          type: 'question', shortLabel: '?'   }, classes: 'node-base node-question label-below' },
  { data: { id: 'gmet',      label: 'Metformin',         type: 'compound', shortLabel: 'MET' }, classes: 'node-base node-compound label-below' },
  { data: { id: 'gampk',     label: 'AMPK',              type: 'target',   shortLabel: 'AMPK'}, classes: 'node-base node-target   label-below' },
  { data: { id: 'gins',      label: 'Insulin signalling',type: 'pathway',  shortLabel: 'INS' }, classes: 'node-base node-pathway  label-below' },
  { data: { id: 'gt2d',      label: 'Type 2 Diabetes',   type: 'disease',  shortLabel: 'T2D' }, classes: 'node-base node-disease  label-below' },
  { data: { id: 'gukpds',    label: 'UKPDS trial',       type: 'trial',    shortLabel: 'UK'  }, classes: 'node-base node-trial    label-below' },
  { data: { id: 'gdoc',      label: 'UKPDS evidence',    type: 'document', shortLabel: 'doc' }, classes: 'node-base node-document label-below' },
  { data: { id: 'ga',        label: 'Answer',            type: 'answer',   shortLabel: 'A'   }, classes: 'node-base node-answer   label-below' },

  { data: { id: 'ge1', source: 'gq',     target: 'gmet',   type: 'RETRIEVES'       }, classes: 'edge-base' },
  { data: { id: 'ge2', source: 'gmet',   target: 'gampk',  type: 'TARGETS'         }, classes: 'edge-base' },
  { data: { id: 'ge3', source: 'gampk',  target: 'gins',   type: 'PARTICIPATES_IN' }, classes: 'edge-base' },
  { data: { id: 'ge4', source: 'gins',   target: 'gt2d',   type: 'ASSOCIATED_WITH' }, classes: 'edge-base' },
  { data: { id: 'ge5', source: 'gmet',   target: 'gukpds', type: 'TESTED_IN'       }, classes: 'edge-base' },
  { data: { id: 'ge6', source: 'gukpds', target: 'gdoc',   type: 'DESCRIBED_BY'    }, classes: 'edge-base' },
  { data: { id: 'ge7', source: 'gdoc',   target: 'ga',     type: 'SUPPORTS'        }, classes: 'edge-base' },
  { data: { id: 'ge8', source: 'gins',   target: 'ga',     type: 'SUPPORTS'        }, classes: 'edge-base' },
];

export function Slide6RagVsGraphRag({
  config,
  replayKey,
  reducedMotion,
}: {
  config: SlideConfig;
  replayKey: number;
  reducedMotion: boolean;
}) {
  // Vector retrieval timeline — question → index → similar chunks (the top 2 win)
  const vectorTimeline = useMemo<TimelineStep[]>(
    () => [
      { at: 0,    type: 'clearEmphasis' },
      { at: 400,  type: 'fit', padding: 40, durationMs: 600 },
      { at: 700,  type: 'addClass', selector: 'node, edge', classes: 'node-dim edge-dim' },
      { at: 1000, type: 'removeClass', selector: '#vq, #vix, #ve1', classes: 'node-dim edge-dim' },
      { at: 1300, type: 'addClass', selector: '#ve2, #ve3, #ve4, #ve5', classes: 'edge-animated' },
      { at: 1300, type: 'removeClass', selector: '#ve2, #ve3, #ve4, #ve5', classes: 'edge-dim' },
      { at: 1700, type: 'removeClass', selector: '#vc1, #vc2', classes: 'node-dim' },
      { at: 1700, type: 'addClass', selector: '#vc1, #vc2', classes: 'node-path' },
      { at: 2100, type: 'removeClass', selector: '#ve6, #ve7, #va', classes: 'node-dim edge-dim' },
      { at: 2100, type: 'addClass', selector: '#ve6, #ve7', classes: 'edge-path' },
    ],
    [],
  );

  // Graph traversal timeline — hop by hop through the entity chain
  const graphTimeline = useMemo<TimelineStep[]>(
    () => [
      { at: 0,    type: 'clearEmphasis' },
      { at: 400,  type: 'fit', padding: 36, durationMs: 600 },
      { at: 700,  type: 'addClass', selector: 'node, edge', classes: 'node-dim edge-dim' },
      { at: 1000, type: 'removeClass', selector: '#gq, #gmet, #ge1', classes: 'node-dim edge-dim' },
      { at: 1000, type: 'addClass', selector: '#gq, #gmet', classes: 'node-path' },
      { at: 1250, type: 'removeClass', selector: '#ge2, #gampk', classes: 'node-dim edge-dim' },
      { at: 1250, type: 'addClass', selector: '#gampk, #ge2', classes: 'node-path edge-path' },
      { at: 1500, type: 'removeClass', selector: '#ge3, #gins', classes: 'node-dim edge-dim' },
      { at: 1500, type: 'addClass', selector: '#gins, #ge3', classes: 'node-path edge-path' },
      { at: 1750, type: 'removeClass', selector: '#ge4, #gt2d', classes: 'node-dim edge-dim' },
      { at: 1750, type: 'addClass', selector: '#gt2d, #ge4', classes: 'node-path edge-path' },
      { at: 2000, type: 'removeClass', selector: '#ge5, #gukpds', classes: 'node-dim edge-dim' },
      { at: 2000, type: 'addClass', selector: '#gukpds, #ge5', classes: 'node-path edge-path' },
      { at: 2250, type: 'removeClass', selector: '#ge6, #gdoc', classes: 'node-dim edge-dim' },
      { at: 2250, type: 'addClass', selector: '#gdoc, #ge6', classes: 'node-path edge-path' },
      { at: 2500, type: 'removeClass', selector: '#ge7, #ge8, #ga', classes: 'node-dim edge-dim' },
      { at: 2500, type: 'addClass', selector: '#ga, #ge7, #ge8', classes: 'node-path edge-path' },
    ],
    [],
  );

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SlideTitle kicker={config.kicker} title={<>Traditional RAG vs Graph RAG</>} small />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="card"
          style={{
            marginTop: 10,
            padding: '10px 16px',
            maxWidth: 860,
            borderLeft: '2px solid var(--color-warm)',
            fontSize: 14,
            color: 'var(--color-ink)',
          }}
        >
          <span
            style={{
              color: 'var(--color-warm)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginRight: 10,
              fontWeight: 600,
            }}
          >
            question
          </span>
          How does Metformin actually treat Type 2 Diabetes — and where&rsquo;s the evidence?
        </motion.div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 270,
          bottom: 90,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
        }}
      >
        <Pane
          label="Traditional RAG"
          tone="cool"
          summary="question → similar chunks → answer"
          summaryBody="Finds what&rsquo;s textually close. The relationship between chunks is invisible."
        >
          <GraphScene
            elements={VECTOR_SIDE_POSITIONED}
            timeline={vectorTimeline}
            replayKey={replayKey}
            reducedMotion={reducedMotion}
            layout={{ name: 'preset', fit: true, padding: 40, animate: false } as any}
            interactiveHover
            fitPadding={36}
          />
        </Pane>

        <Pane
          label="Graph RAG"
          tone="warm"
          summary="question → entities → traversal → evidence → answer"
          summaryBody="Follows the relationship chain. The answer carries its own reasoning path."
        >
          <GraphScene
            elements={GRAPH_SIDE}
            timeline={graphTimeline}
            replayKey={replayKey}
            reducedMotion={reducedMotion}
            layout={
              {
                name: 'breadthfirst',
                directed: true,
                roots: '#gq',
                padding: 28,
                spacingFactor: 1.25,
                animate: true,
                animationDuration: 500,
              } as any
            }
            interactiveHover
            fitPadding={28}
          />
        </Pane>
      </div>

      {/* Bottom takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          bottom: 36,
          display: 'flex',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        Vectors find what&rsquo;s{' '}
        <span style={{ color: 'var(--color-cool)', margin: '0 4px' }}>similar</span>·{' '}
        graphs find what&rsquo;s{' '}
        <span style={{ color: 'var(--color-warm)', margin: '0 4px' }}>connected</span>· Graph RAG uses both.
      </motion.div>
    </div>
  );
}

function Pane({
  label,
  tone,
  summary,
  summaryBody,
  children,
}: {
  label: string;
  tone: 'cool' | 'warm';
  summary: string;
  summaryBody: string;
  children: React.ReactNode;
}) {
  const accent = tone === 'warm' ? 'var(--color-warm)' : 'var(--color-cool)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card"
      style={{
        position: 'relative',
        borderTop: `2px solid ${accent}`,
        background: `linear-gradient(180deg, ${accent}11, rgba(14,18,24,0.82) 50%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: accent,
          fontWeight: 700,
          zIndex: 5,
        }}
      >
        {label}
      </div>
      <div style={{ position: 'absolute', inset: 0, top: 36, bottom: 70 }}>{children}</div>
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 16,
          right: 16,
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          lineHeight: 1.45,
          zIndex: 5,
        }}
      >
        <span style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          {summary}
        </span>
        <br />
        {summaryBody}
      </div>
    </motion.div>
  );
}
