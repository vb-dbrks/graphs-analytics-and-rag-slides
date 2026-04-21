declare module 'cytoscape-fcose' {
  const ext: any;
  export default ext;
}

declare module 'cytoscape-euler' {
  const ext: any;
  export default ext;
}

declare module 'react-cytoscapejs' {
  import type { ComponentType, CSSProperties } from 'react';
  import type { Core, ElementDefinition, LayoutOptions } from 'cytoscape';

  export interface CytoscapeComponentProps {
    id?: string;
    className?: string;
    style?: CSSProperties;
    elements: ElementDefinition[];
    stylesheet?: any;
    layout?: LayoutOptions | Record<string, unknown>;
    zoom?: number;
    pan?: { x: number; y: number };
    minZoom?: number;
    maxZoom?: number;
    zoomingEnabled?: boolean;
    userZoomingEnabled?: boolean;
    boxSelectionEnabled?: boolean;
    autoungrabify?: boolean;
    autolock?: boolean;
    autounselectify?: boolean;
    panningEnabled?: boolean;
    userPanningEnabled?: boolean;
    wheelSensitivity?: number;
    cy?: (cy: Core) => void;
    headless?: boolean;
    styleEnabled?: boolean;
  }

  const CytoscapeComponent: ComponentType<CytoscapeComponentProps>;
  export default CytoscapeComponent;
}
