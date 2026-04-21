import type { Core } from 'cytoscape';
import { clearEmphasis, dimAll, fitTo, highlightPath } from './graphUtils';

export type TimelineStep =
  | { at: number; type: 'addClass'; selector: string; classes: string }
  | { at: number; type: 'removeClass'; selector: string; classes: string }
  | { at: number; type: 'dimAll' }
  | { at: number; type: 'clearEmphasis' }
  | { at: number; type: 'fit'; selector?: string; padding?: number; durationMs?: number }
  | { at: number; type: 'highlightPath'; nodeIds: string[]; edgeIds: string[] }
  | { at: number; type: 'runLayout'; name: string; options?: Record<string, unknown> };

export type TimelineHandle = {
  cancel: () => void;
};

export function runTimeline(
  cy: Core,
  steps: TimelineStep[],
  opts: { reducedMotion?: boolean } = {},
): TimelineHandle {
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  if (opts.reducedMotion) {
    // Collapse to the final state — run every step immediately, skip layouts/fits animation.
    steps.forEach((s) => applyStep(cy, s, true));
    return { cancel: () => {} };
  }

  steps.forEach((step) => {
    timeouts.push(setTimeout(() => applyStep(cy, step), step.at));
  });

  return {
    cancel: () => timeouts.forEach(clearTimeout),
  };
}

function applyStep(cy: Core, step: TimelineStep, reduced = false) {
  switch (step.type) {
    case 'addClass':
      cy.elements(step.selector).addClass(step.classes);
      break;
    case 'removeClass':
      cy.elements(step.selector).removeClass(step.classes);
      break;
    case 'dimAll':
      dimAll(cy);
      break;
    case 'clearEmphasis':
      clearEmphasis(cy);
      break;
    case 'fit':
      fitTo(cy, step.selector, step.padding ?? 60, reduced ? 0 : step.durationMs ?? 650);
      break;
    case 'highlightPath':
      highlightPath(cy, step.nodeIds, step.edgeIds);
      break;
    case 'runLayout': {
      const layout = cy.layout({
        name: step.name,
        animate: !reduced,
        animationDuration: reduced ? 0 : 700,
        ...(step.options ?? {}),
      } as any);
      layout.run();
      break;
    }
  }
}
