import { useEffect, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import type { Core, ElementDefinition, LayoutOptions } from 'cytoscape';
import { registerCytoscapeExtensions } from './cytoscapeSetup';
import { graphStylesheet } from './graphStyles';

registerCytoscapeExtensions();

export type Path = { nodes: string[]; edges: string[] };

export type InteractiveGraphProps = {
  elements: ElementDefinition[];
  layout?: LayoutOptions;
  highlightedPath?: Path | null;
  onNodeHover?: (id: string | null) => void;
  onReady?: (cy: Core) => void;
  interactive?: boolean;
  className?: string;
  fitPadding?: number;
};

const DEFAULT_LAYOUT: LayoutOptions = {
  name: 'fcose',
  animate: true,
  animationDuration: 450,
  randomize: false,
  nodeRepulsion: () => 5500,
  idealEdgeLength: () => 85,
  edgeElasticity: () => 0.45,
  gravity: 0.3,
  padding: 24,
  fit: true,
} as any;

/**
 * A light wrapper around react-cytoscapejs for slides where the graph
 * evolves in response to user input. Re-runs layout whenever the elements
 * array reference changes. Supports external path highlighting and hover
 * callbacks. Interactivity (zoom/pan/drag) is off by default to match the
 * presentation feel.
 */
export function InteractiveGraph({
  elements,
  layout = DEFAULT_LAYOUT,
  highlightedPath,
  onNodeHover,
  onReady,
  interactive = false,
  className,
  fitPadding = 30,
}: InteractiveGraphProps) {
  const cyRef = useRef<Core | null>(null);
  const lastKey = useRef<string>('');

  // Re-layout whenever the set of elements changes.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    const key = elements.map((e) => e.data?.id).join('|');
    if (key === lastKey.current) return;
    lastKey.current = key;
    cy.layout(layout as any).run();
    cy.one('layoutstop', () => cy.fit(undefined, fitPadding));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements]);

  // Apply externally-controlled path highlighting.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass('node-path edge-path node-dim edge-dim');
    if (!highlightedPath) return;
    cy.elements().addClass('node-dim edge-dim');
    const nSel = highlightedPath.nodes.map((id) => `#${cssEscape(id)}`).join(', ');
    const eSel = highlightedPath.edges.map((id) => `#${cssEscape(id)}`).join(', ');
    if (nSel) cy.elements(nSel).removeClass('node-dim').addClass('node-path');
    if (eSel) cy.elements(eSel).removeClass('edge-dim').addClass('edge-path');
  }, [highlightedPath]);

  const handleCy = (cy: Core) => {
    cyRef.current = cy;
    cy.userZoomingEnabled(interactive);
    cy.userPanningEnabled(interactive);
    cy.boxSelectionEnabled(false);
    cy.autoungrabify(!interactive);

    cy.ready(() => {
      cy.fit(undefined, fitPadding);
      onReady?.(cy);
    });

    if (onNodeHover) {
      cy.on('mouseover', 'node', (e) => onNodeHover((e.target.id() as string) ?? null));
      cy.on('mouseout', 'node', () => onNodeHover(null));
    }
  };

  return (
    <div className={`cy-host ${className ?? ''}`}>
      <CytoscapeComponent
        elements={elements as any}
        stylesheet={graphStylesheet as any}
        layout={layout as any}
        style={{ width: '100%', height: '100%' }}
        cy={handleCy as any}
        wheelSensitivity={0.1}
      />
    </div>
  );
}

function cssEscape(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
}
