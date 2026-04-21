import type { Core } from 'cytoscape';

export function dimAll(cy: Core) {
  cy.elements().addClass('node-dim edge-dim');
}

export function clearEmphasis(cy: Core) {
  cy.elements().removeClass(
    'node-dim edge-dim node-active node-path edge-path node-neighbour edge-active edge-animated',
  );
}

export function highlightPath(cy: Core, nodeIds: string[], edgeIds: string[]) {
  cy.elements().addClass('node-dim edge-dim');
  nodeIds.forEach((id) => cy.getElementById(id).removeClass('node-dim').addClass('node-path'));
  edgeIds.forEach((id) => cy.getElementById(id).removeClass('edge-dim').addClass('edge-path'));
}

export function highlightNeighbourhood(cy: Core, nodeId: string) {
  const node = cy.getElementById(nodeId);
  if (node.empty()) return;
  cy.elements().addClass('node-dim edge-dim');
  node.removeClass('node-dim').addClass('node-active');
  node
    .closedNeighborhood()
    .removeClass('node-dim edge-dim')
    .addClass('node-neighbour edge-active');
  node.addClass('node-active');
}

export function fitTo(cy: Core, selector?: string, padding = 60, durationMs = 650) {
  const eles = selector ? cy.elements(selector) : cy.elements();
  if (eles.empty()) return;
  cy.stop(true, true);
  cy.animate({ fit: { eles, padding } } as any, { duration: durationMs, easing: 'ease-in-out' });
}
