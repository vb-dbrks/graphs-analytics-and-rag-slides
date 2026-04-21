import type { ComponentType } from 'react';
import { Slide1Hook } from './Slide1Hook';
import { Slide1bDikw } from './Slide1bDikw';
import { Slide2Scenario } from './Slide2Scenario';
import { Slide2aSqlPain } from './Slide2aSqlPain';
import { Slide2bRdfVsLpg } from './Slide2bRdfVsLpg';
import { Slide5aRdfPlayground } from './Slide5aRdfPlayground';
import { Slide5bLpgPlayground } from './Slide5bLpgPlayground';
import { Slide3DecisionMap } from './Slide3DecisionMap';
import { Slide4WorksVsDoesnt } from './Slide4WorksVsDoesnt';
import { Slide5RealityAtScale } from './Slide5RealityAtScale';
import { Slide6RagVsGraphRag } from './Slide6RagVsGraphRag';
import { Slide7DatabricksLens } from './Slide7DatabricksLens';
import { Slide8DecisionFramework } from './Slide8DecisionFramework';
import { Slide11Playground } from './Slide11Playground';

export type SlideConfig = {
  id: string;
  title: string;
  kicker?: string;
  subtitle?: string;
  speakerNotes: string[];
  Component: ComponentType<{ config: SlideConfig; replayKey: number; reducedMotion: boolean }>;
};

export const slides: SlideConfig[] = [
  {
    id: 's1',
    kicker: '01 · hook',
    title: 'Graphs are everywhere… but should we actually use one?',
    subtitle:
      'A practical look at graphs, Graph RAG, and architecture trade-offs in the Databricks world.',
    speakerNotes: [
      'Opening line: graph-shaped domains do not automatically justify graph databases.',
      'Show the connected life-sci graph self-organise — make it feel alive before we question it.',
      'End with the retrieval path lit up: the payoff is always a grounded answer.',
    ],
    Component: Slide1Hook,
  },
  {
    id: 's1b',
    kicker: '02 · from data to wisdom',
    title: 'From data to wisdom.',
    subtitle: 'Different layers of meaning demand different shapes of data.',
    speakerNotes: [
      'Classic DIKW hierarchy with Insight between Knowledge and Wisdom.',
      'Data → Information: aggregation and context. SQL and the lakehouse do this well.',
      'Knowledge = connected entities. This is where modelling choice starts to matter.',
      'Insight = patterns across knowledge. Graphs shine here.',
      'Wisdom = applied judgement.',
    ],
    Component: Slide1bDikw,
  },
  {
    id: 's2',
    kicker: '03 · the scenario',
    title: 'Meet the research assistant.',
    subtitle:
      'A life-sciences knowledge copilot spanning structured trials, curated ontologies, literature, and clinical notes.',
    speakerNotes: [
      'Ground everything in one concrete use case — a pharma R&D knowledge assistant.',
      'Four question shapes: mechanism, evidence, safety, repurposing — each traverses different data.',
      'Data estate: Delta trials, biomedical KB, literature PDFs, clinical notes.',
      'Frame the rest of the talk as answering: "what does this assistant cost us if we do it in SQL?"',
    ],
    Component: Slide2Scenario,
  },
  {
    id: 's2a',
    kicker: '04 · the sql pain',
    title: 'The question is simple. The SQL isn’t.',
    subtitle:
      'Two real questions a graph-shaped domain forces on you — one fixed-depth, one hierarchical.',
    speakerNotes: [
      'Fixed-depth: walk drug → target → pathway → disease → trial → evidence. 9 JOINs, 5 link tables.',
      'Unknown-depth: WITH RECURSIVE for drug-drug interaction via shared biology. Requires DBR 17+.',
      'Cypher collapses both shapes — the hop bound lives in the pattern, not in a WHERE clause.',
    ],
    Component: Slide2aSqlPain,
  },
  {
    id: 's2b',
    kicker: '05 · modelling choice',
    title: 'Two ways to be a graph.',
    subtitle: 'RDF is about meaning. LPG is about traversal.',
    speakerNotes: [
      'Show where properties live: RDF uses separate triples; LPG inlines them.',
      'Query shape: SPARQL is set-theoretic; Cypher reads like ASCII-art of the path.',
      'In-the-wild: SNOMED / Wikidata (RDF); Neo4j / Neptune / Graph RAG stacks (LPG).',
    ],
    Component: Slide2bRdfVsLpg,
  },
  {
    id: 's5a',
    kicker: '06 · build an rdf graph',
    title: 'Build an RDF graph.',
    subtitle: 'Every triple adds two nodes and one labelled edge. Predicates are first-class.',
    speakerNotes: [
      'Live demo — add a triple, watch the graph grow.',
      'Stress: every property is its own triple. "Metformin launched 1995" is a separate edge.',
      'Load the preset and talk about: predicates carry the meaning; identity is the URI.',
    ],
    Component: Slide5aRdfPlayground,
  },
  {
    id: 's5b',
    kicker: '07 · build an lpg graph',
    title: 'Build an LPG graph.',
    subtitle: 'Nodes carry their own properties. Edges are typed and directional.',
    speakerNotes: [
      'Same domain, different shape — properties live on the node, not as separate edges.',
      'Hover a node to reveal its property object — this is what Cypher MATCH patterns bind to.',
      'Land the payoff: most Graph RAG stacks (Neo4j, Neptune) use LPG for exactly this ergonomics.',
    ],
    Component: Slide5bLpgPlayground,
  },
  {
    id: 's3',
    kicker: '08 · decision map',
    title: 'When does a graph actually make sense?',
    subtitle: 'Choose based on workload shape, not domain shape.',
    speakerNotes: [
      'Two axes: relationship complexity × scale / distributed analytics.',
      'Reporting and customer 360 show up in Lakehouse SQL despite being graph-shaped.',
      'Drug-target-pathway and fraud rings sit in native-graph or hybrid.',
    ],
    Component: Slide3DecisionMap,
  },
  {
    id: 's4',
    kicker: '09 · what works, what doesn’t',
    title: 'What works. What doesn’t. What’s hybrid.',
    subtitle: 'Graph-friendly workloads are narrower than they feel.',
    speakerNotes: [
      'Three lanes: graph-friendly, hybrid, better elsewhere.',
      'Borderline cases land in hybrid — Graph RAG as the pragmatic middle.',
      'Don’t skip the "better elsewhere" lane — that’s where we save teams from themselves.',
    ],
    Component: Slide4WorksVsDoesnt,
  },
  {
    id: 's5',
    kicker: '10 · reality at scale',
    title: 'Reality at scale',
    subtitle: 'The graph is rarely the source of truth.',
    speakerNotes: [
      'Walk the pipeline: sources → medallion → enrichment → optional graph projection → serving.',
      'Hit each warning callout: duplication, sync lag, modelling overhead, extra infra, language split.',
      'Frame the graph service as a serving-layer branch, not a replacement.',
    ],
    Component: Slide5RealityAtScale,
  },
  {
    id: 's6',
    kicker: '11 · rag vs graph rag',
    title: 'Traditional RAG vs Graph RAG',
    subtitle:
      'Could this therapy combination create an indirect risk in this pathway context?',
    speakerNotes: [
      'Same question, two retrieval styles.',
      'Left: similarity pulls chunks. Useful, but flat.',
      'Right: entity extraction → multi-hop path → supporting docs. The relationships become the scaffold.',
    ],
    Component: Slide6RagVsGraphRag,
  },
  {
    id: 's7',
    kicker: '12 · databricks lens',
    title: 'How this fits in a Databricks architecture',
    subtitle:
      'Lakehouse for scale and preparation. Graph for specialised relationship-heavy serving.',
    speakerNotes: [
      'Stack bottom-up: ingestion, Delta, medallion, extraction, embeddings, governance.',
      'Graph projection is a branch off Gold/Silver curated entities — not a replacement.',
      'Agents and apps consume vector, graph, or both. Policy & lineage live in UC regardless.',
    ],
    Component: Slide7DatabricksLens,
  },
  {
    id: 's8',
    kicker: '13 · decision framework',
    title: 'A simple decision framework',
    subtitle: 'Graphs matter. Graph databases are specialised.',
    speakerNotes: [
      'Three questions, four terminal recommendations.',
      'Hybrid Graph RAG is usually the right starting point.',
      'Close: graphs are everywhere, graph databases shouldn’t be.',
    ],
    Component: Slide8DecisionFramework,
  },
  {
    id: 's11',
    kicker: '14 · try it yourself',
    title: 'Graph RAG is just pathfinding.',
    subtitle: 'Pick any two nodes. Watch the assistant walk the path.',
    speakerNotes: [
      'End-of-deck playground. Live demo.',
      'Run "question → answer" preset for the classic Graph-RAG traversal.',
      'Run "Metformin → T2D" to show the mechanism chain (drug → target → pathway → disease).',
      'If a path doesn’t exist, that’s useful signal too — the graph tells you honestly what it can’t answer.',
    ],
    Component: Slide11Playground,
  },
];
