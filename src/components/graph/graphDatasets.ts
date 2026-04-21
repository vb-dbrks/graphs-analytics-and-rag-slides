import type { ElementDefinition } from 'cytoscape';

export type NodeType =
  | 'compound'
  | 'target'
  | 'pathway'
  | 'disease'
  | 'trial'
  | 'cohort'
  | 'document'
  | 'chunk'
  | 'vector_index'
  | 'lakehouse_table'
  | 'graph_projection'
  | 'agent'
  | 'question'
  | 'answer'
  | 'platform';

export type EdgeType =
  | 'TARGETS'
  | 'PARTICIPATES_IN'
  | 'ASSOCIATED_WITH'
  | 'TESTED_IN'
  | 'DESCRIBED_BY'
  | 'CHUNKED_INTO'
  | 'INDEXED_IN'
  | 'PROJECTED_TO'
  | 'QUERIES'
  | 'RETRIEVES'
  | 'TRAVERSES'
  | 'SUPPORTS'
  | 'ANSWERS'
  | 'FEEDS'
  | 'CONTRAINDICATES';

type NodeData = {
  id: string;
  label: string;
  type: NodeType;
  shortLabel?: string;
  description?: string;
  cluster?: string;
  importance?: number;
};

type EdgeData = {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: EdgeType;
  weight?: number;
};

type DatasetElement =
  | { group?: 'nodes'; data: NodeData; classes?: string; position?: { x: number; y: number } }
  | { group: 'edges'; data: EdgeData; classes?: string };

function n(
  id: string,
  label: string,
  type: NodeType,
  extras: Partial<NodeData> & { x?: number; y?: number; classes?: string } = {},
): DatasetElement {
  const { x, y, classes, ...rest } = extras;
  const el: DatasetElement = {
    data: { id, label, type, ...rest },
    classes: `node-base node-${type}${classes ? ' ' + classes : ''}`,
  };
  if (x !== undefined && y !== undefined) (el as any).position = { x, y };
  return el;
}

function e(
  id: string,
  source: string,
  target: string,
  type: EdgeType,
  extras: Partial<EdgeData> & { classes?: string } = {},
): DatasetElement {
  const { classes, ...rest } = extras;
  return {
    group: 'edges',
    data: { id, source, target, type, label: type.replace(/_/g, ' ').toLowerCase(), ...rest },
    classes: `edge-base edge-${type.toLowerCase()}${classes ? ' ' + classes : ''}`,
  };
}

/**
 * Canonical life-sciences graph using real, audience-recognisable entities.
 * Three common chronic conditions — Type 2 Diabetes, Hypertension, High
 * Cholesterol — each with its typical drug · target · pathway · trial chain.
 *
 * Reused across slides 1 and wherever we need the "full story" graph.
 */
export const canonicalLifeSci: ElementDefinition[] = [
  // Retrieval wrapper
  n('q',  'User question', 'question', { shortLabel: '?',  description: 'How does this drug actually treat this disease?', cluster: 'rag' }),
  n('ag', 'Agent',         'agent',    { shortLabel: 'AI', description: 'Retrieval + reasoning agent.', cluster: 'rag' }),
  n('ans','Answer',        'answer',   { shortLabel: '✓',  description: 'Grounded, explainable answer.', cluster: 'rag' }),

  // Drugs
  n('metformin',     'Metformin',     'compound', { shortLabel: 'MET', description: 'First-line type 2 diabetes therapy.', cluster: 'drugs', importance: 3 }),
  n('lisinopril',    'Lisinopril',    'compound', { shortLabel: 'LIS', description: 'ACE inhibitor, hypertension.',        cluster: 'drugs' }),
  n('atorvastatin',  'Atorvastatin',  'compound', { shortLabel: 'ATO', description: 'Statin for high cholesterol.',        cluster: 'drugs' }),

  // Molecular targets
  n('ampk',  'AMPK',              'target', { shortLabel: 'AMPK',  description: 'Cellular energy sensor.',           cluster: 'targets', importance: 2 }),
  n('ace',   'ACE',               'target', { shortLabel: 'ACE',   description: 'Angiotensin-converting enzyme.',    cluster: 'targets' }),
  n('hmgcr', 'HMG-CoA Reductase', 'target', { shortLabel: 'HMGCR', description: 'Rate-limiting step of cholesterol synthesis.', cluster: 'targets' }),

  // Pathways
  n('insulin_sig',  'Insulin signalling',    'pathway', { shortLabel: 'INS',  description: 'Glucose uptake and storage.',        cluster: 'pathways', importance: 2 }),
  n('raas',         'RAAS',                  'pathway', { shortLabel: 'RAAS', description: 'Renin–Angiotensin–Aldosterone.',     cluster: 'pathways' }),
  n('mevalonate',   'Mevalonate pathway',    'pathway', { shortLabel: 'MEV',  description: 'Cholesterol biosynthesis.',          cluster: 'pathways' }),

  // Diseases
  n('t2d', 'Type 2 Diabetes', 'disease', { shortLabel: 'T2D', description: 'Insulin resistance + hyperglycaemia.', cluster: 'diseases', importance: 2 }),
  n('htn', 'Hypertension',    'disease', { shortLabel: 'HTN', description: 'Chronically elevated blood pressure.', cluster: 'diseases' }),
  n('hld', 'High Cholesterol','disease', { shortLabel: 'HLD', description: 'Hyperlipidaemia / dyslipidaemia.',     cluster: 'diseases' }),

  // Trials
  n('ukpds', 'UKPDS trial', 'trial', { shortLabel: 'UK', description: 'Landmark T2D outcomes trial.',         cluster: 'trials' }),
  n('hope',  'HOPE trial',  'trial', { shortLabel: 'HO', description: 'Cardiovascular outcomes, ACE-I.',      cluster: 'trials' }),
  n('fours', '4S trial',    'trial', { shortLabel: '4S', description: 'Scandinavian statin survival study.',  cluster: 'trials' }),

  // ----- Edges -----
  // retrieval wrapper
  e('e_q_ag',      'q',           'ag',           'QUERIES'),
  e('e_ag_met',    'ag',          'metformin',    'RETRIEVES'),
  // drug → target
  e('e_met_ampk',  'metformin',   'ampk',         'TARGETS'),
  e('e_lis_ace',   'lisinopril',  'ace',          'TARGETS'),
  e('e_ato_hmgcr', 'atorvastatin','hmgcr',        'TARGETS'),
  // target → pathway
  e('e_ampk_ins',  'ampk',        'insulin_sig',  'PARTICIPATES_IN'),
  e('e_ace_raas',  'ace',         'raas',         'PARTICIPATES_IN'),
  e('e_hmgcr_mev', 'hmgcr',       'mevalonate',   'PARTICIPATES_IN'),
  // pathway → disease
  e('e_ins_t2d',   'insulin_sig', 't2d',          'ASSOCIATED_WITH'),
  e('e_raas_htn',  'raas',        'htn',          'ASSOCIATED_WITH'),
  e('e_mev_hld',   'mevalonate',  'hld',          'ASSOCIATED_WITH'),
  // drug → trial
  e('e_met_uk',    'metformin',   'ukpds',        'TESTED_IN'),
  e('e_lis_hope',  'lisinopril',  'hope',         'TESTED_IN'),
  e('e_ato_4s',    'atorvastatin','fours',        'TESTED_IN'),
  // trial → evidence → answer (evidence chain)
  e('e_uk_ans',    'ukpds',       'ans',          'SUPPORTS'),
  e('e_ins_ans',   'insulin_sig', 'ans',          'SUPPORTS'),
];

/**
 * The illustrative reasoning path we highlight on Slide 1 and reference
 * on Slide 6 — the Graph-RAG traversal for "How does Metformin treat T2D?".
 */
export const graphRagPath = {
  nodes: ['q', 'ag', 'metformin', 'ampk', 'insulin_sig', 't2d', 'ukpds', 'ans'],
  edges: ['e_q_ag', 'e_ag_met', 'e_met_ampk', 'e_ampk_ins', 'e_ins_t2d', 'e_met_uk', 'e_uk_ans', 'e_ins_ans'],
};

/** Equivalent "vector-only" path (kept for parity; slide 6 uses its own panes). */
export const vectorRagPath = {
  nodes: ['q', 'ag', 'ans'],
  edges: ['e_q_ag'],
};

// ---------- Architecture dataset (Slides 5, 7) — preset layout ----------
export const architectureDataset: ElementDefinition[] = [
  n('src_cdc', 'CDC streams',     'platform', { x: 120, y: 150, cluster: 'sources',    shortLabel: 'CDC' }),
  n('src_db',  'OLTP / app DBs',  'platform', { x: 120, y: 260, cluster: 'sources',    shortLabel: 'OLTP' }),
  n('src_doc', 'Docs / PDFs / HL7','platform',{ x: 120, y: 370, cluster: 'sources',    shortLabel: 'Docs' }),

  n('bronze',  'Bronze',          'lakehouse_table', { x: 340, y: 150, cluster: 'medallion', shortLabel: 'Bronze' }),
  n('silver',  'Silver',          'lakehouse_table', { x: 340, y: 260, cluster: 'medallion', shortLabel: 'Silver' }),
  n('gold',    'Gold',            'lakehouse_table', { x: 340, y: 370, cluster: 'medallion', shortLabel: 'Gold' }),

  n('parse', 'Entity extraction',  'platform', { x: 560, y: 190, cluster: 'enrich', shortLabel: 'Parse' }),
  n('emb',   'Embeddings',         'platform', { x: 560, y: 310, cluster: 'enrich', shortLabel: 'Emb' }),
  n('gov',   'UC / lineage / ACL', 'platform', { x: 560, y: 430, cluster: 'enrich', shortLabel: 'Gov' }),

  n('vix2', 'Vector index',          'vector_index',      { x: 790, y: 240,  cluster: 'serving', shortLabel: 'Vec' }),
  n('gp',   'Graph projection',      'graph_projection',  { x: 790, y: 360,  cluster: 'serving', shortLabel: 'GP' }),
  n('ngx',  'Native graph service',  'graph_projection',  { x: 950, y: 360,  cluster: 'serving', shortLabel: 'Graph' }),

  n('agents', 'Agents & apps', 'agent', { x: 1140, y: 300, cluster: 'consumers', shortLabel: 'Agents' }),

  e('a_e1', 'src_cdc', 'bronze', 'FEEDS'),
  e('a_e2', 'src_db',  'bronze', 'FEEDS'),
  e('a_e3', 'src_doc', 'bronze', 'FEEDS'),
  e('a_e4', 'bronze',  'silver', 'FEEDS'),
  e('a_e5', 'silver',  'gold',   'FEEDS'),
  e('a_e6', 'silver',  'parse',  'FEEDS'),
  e('a_e7', 'silver',  'emb',    'FEEDS'),
  e('a_e8', 'gold',    'gov',    'FEEDS'),
  e('a_e9', 'emb',     'vix2',   'INDEXED_IN'),
  e('a_e10', 'parse',  'gp',     'PROJECTED_TO'),
  e('a_e11', 'gp',     'ngx',    'PROJECTED_TO'),
  e('a_e12', 'vix2',   'agents', 'RETRIEVES'),
  e('a_e13', 'ngx',    'agents', 'RETRIEVES'),
  e('a_e14', 'gov',    'agents', 'SUPPORTS'),
];

export const datasets = {
  canonical: canonicalLifeSci,
  architecture: architectureDataset,
} as const;

export type DatasetKey = keyof typeof datasets;
