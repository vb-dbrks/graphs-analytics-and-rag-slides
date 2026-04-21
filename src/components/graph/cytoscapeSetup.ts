import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import euler from 'cytoscape-euler';

let registered = false;
export function registerCytoscapeExtensions() {
  if (registered) return;
  cytoscape.use(fcose);
  cytoscape.use(euler);
  registered = true;
}
