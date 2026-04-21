import { useEffect, useMemo, useRef } from 'react';
import type { Core, ElementDefinition, LayoutOptions } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import { registerCytoscapeExtensions } from './cytoscapeSetup';
import { graphStylesheet } from './graphStyles';
import { runTimeline, type TimelineStep } from './timelineRunner';
import { clearEmphasis, highlightNeighbourhood } from './graphUtils';

registerCytoscapeExtensions();

export type GraphSceneProps = {
  elements: ElementDefinition[];
  layout?: LayoutOptions;
  stylesheet?: any;
  timeline?: TimelineStep[];
  replayKey?: number | string;
  reducedMotion?: boolean;
  onReady?: (cy: Core) => void;
  interactiveHover?: boolean;
  fitPadding?: number;
  className?: string;
};

const defaultLayout: LayoutOptions = {
  name: 'fcose',
  animate: true,
  animationDuration: 700,
  randomize: false,
  nodeRepulsion: () => 6500,
  idealEdgeLength: () => 90,
  edgeElasticity: () => 0.4,
  gravity: 0.25,
  padding: 30,
  tile: false,
} as any;

export function GraphScene({
  elements,
  layout = defaultLayout,
  stylesheet = graphStylesheet,
  timeline,
  replayKey,
  reducedMotion,
  onReady,
  interactiveHover = true,
  fitPadding = 40,
  className,
}: GraphSceneProps) {
  const cyRef = useRef<Core | null>(null);
  const memoElements = useMemo(() => elements, [elements]);
  const memoStylesheet = useMemo(() => stylesheet, [stylesheet]);

  // Re-run timeline whenever replayKey changes.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    clearEmphasis(cy);
    if (!timeline || timeline.length === 0) return;
    const handle = runTimeline(cy, timeline, { reducedMotion });
    return () => handle.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayKey, reducedMotion]);

  // Wire hover handlers and initial ready.
  const handleCy = (cy: Core) => {
    cyRef.current = cy;
    cy.userZoomingEnabled(false);
    cy.userPanningEnabled(false);
    cy.boxSelectionEnabled(false);

    cy.ready(() => {
      cy.fit(undefined, fitPadding);
      onReady?.(cy);
    });

    if (interactiveHover) {
      cy.on('mouseover', 'node', (evt) => {
        const id = evt.target.id();
        highlightNeighbourhood(cy, id);
      });
      cy.on('mouseout', 'node', () => {
        clearEmphasis(cy);
      });
    }
  };

  return (
    <div className={`cy-host ${className ?? ''}`}>
      <CytoscapeComponent
        elements={memoElements as any}
        stylesheet={memoStylesheet as any}
        layout={layout as any}
        style={{ width: '100%', height: '100%' }}
        cy={handleCy as any}
        wheelSensitivity={0.1}
      />
    </div>
  );
}
