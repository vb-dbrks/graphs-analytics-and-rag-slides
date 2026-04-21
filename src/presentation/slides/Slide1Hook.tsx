import { useMemo } from 'react';
import type { ElementDefinition } from 'cytoscape';
import { motion } from 'framer-motion';
import { GraphScene } from '@/components/graph/GraphScene';
import { canonicalLifeSci, graphRagPath } from '@/components/graph/graphDatasets';
import type { TimelineStep } from '@/components/graph/timelineRunner';
import { Legend } from '@/components/ui/Legend';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Hook slide — the graph occupies the full canvas as a living background.
 * Title and copy sit on the left on a soft vertical gradient for contrast.
 * Nodes get label-below so full names are readable. Euler physics gives the
 * "graphs come alive" opening beat, then the reasoning path lights up.
 */

// Apply label-below to every node so full names render underneath.
function withLabelsBelow(elements: ElementDefinition[]): ElementDefinition[] {
  return elements.map((el) => {
    if (el.group === 'edges' || !('data' in el)) return el;
    const src = (el as any).classes ?? '';
    const alreadyHas = typeof src === 'string' && src.includes('label-below');
    return { ...el, classes: alreadyHas ? src : `${src} label-below` };
  });
}

export function Slide1Hook({
  config,
  replayKey,
  reducedMotion,
}: {
  config: SlideConfig;
  replayKey: number;
  reducedMotion: boolean;
}) {
  const elements = useMemo(() => withLabelsBelow(canonicalLifeSci), []);

  const timeline = useMemo<TimelineStep[]>(() => {
    const pathNodeSel = graphRagPath.nodes.map((id) => `#${id}`).join(', ');
    const pathEdgeSel = graphRagPath.edges.map((id) => `#${id}`).join(', ');
    return [
      { at: 0,    type: 'clearEmphasis' },
      // Re-fit the viewport after the physics has settled, smoothly.
      { at: 2700, type: 'fit', padding: 90, durationMs: 600 },
      // Dim everything, then light up the reasoning path.
      { at: 3100, type: 'addClass', selector: 'node, edge', classes: 'node-dim edge-dim' },
      { at: 3300, type: 'removeClass', selector: pathNodeSel, classes: 'node-dim' },
      { at: 3300, type: 'addClass', selector: pathNodeSel, classes: 'node-path' },
      { at: 3550, type: 'removeClass', selector: pathEdgeSel, classes: 'edge-dim' },
      { at: 3550, type: 'addClass', selector: pathEdgeSel, classes: 'edge-path' },
    ];
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Graph canvas — right column, leaves the left third clear for the title */}
      <div style={{ position: 'absolute', top: 60, right: 20, bottom: 60, left: 720, zIndex: 0 }}>
        <GraphScene
          elements={elements}
          timeline={timeline}
          replayKey={replayKey}
          reducedMotion={reducedMotion}
          fitPadding={90}
          layout={{
            name: 'euler',
            animate: true,
            animationDuration: 2500,
            animationEasing: 'ease-out',
            // Longer ideal edge length + heavier mass ⇒ spread-out, calm settling.
            springLength: () => 150,
            springCoeff: () => 0.0008,
            mass: () => 8,
            gravity: -2.5,
            pull: 0.0012,
            theta: 0.666,
            dragCoeff: 0.02,
            movementThreshold: 1,
            timeStep: 24,
            refresh: 12,
            fit: false, // we drive fit via the timeline to avoid a double camera jump
            padding: 90,
            randomize: false,
            maxIterations: 1200,
            maxSimulationTime: 2400,
            ungrabifyWhileSimulating: true,
            infinite: false,
          } as any}
        />
      </div>


      {/* Title column */}
      <div className="slide-safe" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        <div style={{ maxWidth: 680, paddingTop: 40 }}>
          <div style={{ pointerEvents: 'auto' }}>
            <SlideTitle
              kicker={config.kicker}
              title={
                <>
                  Graphs are <span style={{ color: 'var(--color-warm)' }}>everywhere</span>…
                  <br />
                  but should we <span style={{ color: 'var(--color-cool)' }}>actually</span> use one?
                </>
              }
              subtitle={config.subtitle}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
            style={{
              marginTop: 28,
              padding: '12px 14px',
              borderLeft: '2px solid var(--color-warm)',
              color: 'var(--color-ink-dim)',
              fontSize: 14,
              maxWidth: 520,
              background: 'rgba(255,122,69,0.05)',
              pointerEvents: 'auto',
            }}
          >
            For relationship-heavy workloads — not graph-shaped hype.
          </motion.div>
        </div>
      </div>

      <Legend
        style={{ position: 'absolute', right: 40, bottom: 70, zIndex: 3 }}
        items={[
          { type: 'question', label: 'Question' },
          { type: 'agent', label: 'Agent' },
          { type: 'compound', label: 'Drug' },
          { type: 'target', label: 'Target' },
          { type: 'pathway', label: 'Pathway' },
          { type: 'disease', label: 'Disease' },
          { type: 'trial', label: 'Trial' },
          { type: 'answer', label: 'Answer' },
        ]}
      />
    </div>
  );
}
