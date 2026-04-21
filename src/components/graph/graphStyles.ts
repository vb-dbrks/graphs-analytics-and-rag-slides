import type { StylesheetCSS } from 'cytoscape';
import { theme } from '@/styles/theme';

export type GraphStylesheet = StylesheetCSS[];

const base = theme.colors;
const nt = theme.nodeType;

/**
 * Class-driven styling. Base mode uses short labels INSIDE the node for
 * dense scenes; any node tagged with `.label-below` shows its full name
 * underneath in a quieter grey — cleaner, reads like the Cytoscape Tolkien
 * demo.
 */
export const graphStylesheet = ([
  // ---------- Base node ----------
  {
    selector: 'node',
    style: {
      'background-color': base.bgElev,
      'background-opacity': 0.95,
      'border-width': 1.5,
      'border-color': base.lineStrong,
      'label': 'data(shortLabel)',
      'color': base.ink,
      'font-family': theme.typography.display,
      'font-size': 11,
      'font-weight': 700,
      'text-valign': 'center',
      'text-halign': 'center',
      'text-outline-width': 0,
      'width': 44,
      'height': 44,
      'shape': 'round-rectangle',
      'transition-property': 'background-color, border-color, border-width, opacity, width, height',
      'transition-duration': 400,
      'transition-timing-function': 'ease-in-out',
    },
  },

  // Full-name label below node — used on hook / wide scenes
  {
    selector: 'node.label-below',
    style: {
      'label': 'data(label)',
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 8,
      'color': base.inkDim,
      'font-size': 10.5,
      'font-weight': 500,
      'text-background-color': base.bg,
      'text-background-opacity': 0.55,
      'text-background-padding': 3,
      'text-background-shape': 'round-rectangle',
      'text-wrap': 'wrap',
      'text-max-width': 120,
    },
  },

  // ---------- Type-specific shapes + colours ----------
  { selector: 'node.node-compound',        style: { 'shape': 'round-rectangle', 'background-color': nt.compound,        'border-color': nt.compound, 'width': 52, 'height': 52 } },
  { selector: 'node.node-target',          style: { 'shape': 'round-diamond',   'background-color': nt.target,          'border-color': nt.target, 'width': 50, 'height': 50 } },
  { selector: 'node.node-pathway',         style: { 'shape': 'round-hexagon',   'background-color': nt.pathway,         'border-color': nt.pathway, 'width': 50, 'height': 50 } },
  { selector: 'node.node-disease',         style: { 'shape': 'round-triangle',  'background-color': nt.disease,         'border-color': nt.disease, 'width': 50, 'height': 50 } },
  { selector: 'node.node-trial',           style: { 'shape': 'round-tag',       'background-color': nt.trial,           'border-color': nt.trial, 'width': 48, 'height': 48 } },
  { selector: 'node.node-cohort',          style: { 'shape': 'round-octagon',   'background-color': nt.cohort,          'border-color': nt.cohort, 'width': 48, 'height': 48 } },
  { selector: 'node.node-document',        style: { 'shape': 'round-rectangle', 'background-color': nt.document,        'border-color': nt.document, 'width': 40, 'height': 48 } },
  { selector: 'node.node-chunk',           style: { 'shape': 'round-rectangle', 'background-color': nt.chunk,           'border-color': nt.chunk, 'width': 28, 'height': 34 } },
  { selector: 'node.node-vector_index',    style: { 'shape': 'round-rectangle', 'background-color': nt.vector_index,    'border-color': nt.vector_index, 'width': 54, 'height': 38 } },
  { selector: 'node.node-lakehouse_table', style: { 'shape': 'round-rectangle', 'background-color': nt.lakehouse_table, 'border-color': nt.lakehouse_table, 'width': 62, 'height': 38 } },
  { selector: 'node.node-graph_projection',style: { 'shape': 'round-hexagon',   'background-color': nt.graph_projection,'border-color': nt.graph_projection, 'width': 54, 'height': 50 } },
  { selector: 'node.node-agent',           style: { 'shape': 'round-pentagon',  'background-color': nt.agent,           'border-color': nt.agent, 'width': 52, 'height': 52 } },
  { selector: 'node.node-question',        style: { 'shape': 'ellipse',         'background-color': nt.question,        'border-color': nt.question, 'color': '#0a0c10', 'width': 54, 'height': 54 } },
  { selector: 'node.node-answer',          style: { 'shape': 'ellipse',         'background-color': nt.answer,          'border-color': nt.answer, 'width': 54, 'height': 54 } },
  { selector: 'node.node-platform',        style: { 'shape': 'round-rectangle', 'background-color': base.bgElev,        'border-color': base.lineStrong } },

  // ---------- Edges ----------
  {
    selector: 'edge',
    style: {
      'width': 1.4,
      'line-color': base.lineStrong,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': base.lineStrong,
      'arrow-scale': 0.85,
      'opacity': 0.7,
      'transition-property': 'line-color, target-arrow-color, width, opacity',
      'transition-duration': 400,
      'transition-timing-function': 'ease-in-out',
    },
  },

  // ---------- Dim / emphasis classes ----------
  { selector: '.node-dim', style: { 'opacity': 0.18 } },
  { selector: '.edge-dim', style: { 'opacity': 0.08 } },
  {
    selector: '.node-active',
    style: {
      'border-width': 3,
      'width': 60,
      'height': 60,
    },
  },
  {
    selector: '.node-path',
    style: {
      'border-color': base.cool,
      'border-width': 3,
      'overlay-color': base.cool,
      'overlay-opacity': 0.14,
      'overlay-padding': 8,
    },
  },
  {
    selector: '.node-neighbour',
    style: {
      'border-color': base.warm,
      'border-width': 2,
    },
  },
  {
    selector: '.edge-path',
    style: {
      'line-color': base.cool,
      'target-arrow-color': base.cool,
      'width': 3,
      'opacity': 1,
    },
  },
  {
    selector: '.edge-active',
    style: {
      'line-color': base.warm,
      'target-arrow-color': base.warm,
      'width': 2.4,
      'opacity': 1,
    },
  },
  {
    selector: '.edge-animated',
    style: {
      'line-dash-pattern': [6, 4],
      'line-dash-offset': 0,
      'line-style': 'dashed',
      'line-color': base.cool,
      'target-arrow-color': base.cool,
      'width': 2.2,
    },
  },

  // Cluster visuals (rarely used — gives subtle per-cluster border hint)
  { selector: '.cluster-rag',      style: { 'border-color': base.violet } },
  { selector: '.cluster-vector',   style: { 'border-color': base.cool } },
  { selector: '.cluster-entities', style: { 'border-color': base.warm } },
] as unknown as StylesheetCSS[]);
