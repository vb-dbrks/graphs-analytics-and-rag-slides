import type { ComponentType } from 'react';
import { Slide1Hook } from './Slide1Hook';
import { Slide1bDikw } from './Slide1bDikw';
import { Slide2Scenario } from './Slide2Scenario';
import { Slide2aSqlPain } from './Slide2aSqlPain';
import { Slide2bRdfVsLpg } from './Slide2bRdfVsLpg';
import { Slide3DecisionMap } from './Slide3DecisionMap';
import { Slide4WorksVsDoesnt } from './Slide4WorksVsDoesnt';
import { Slide5RealityAtScale } from './Slide5RealityAtScale';
import { Slide6RagVsGraphRag } from './Slide6RagVsGraphRag';
import { Slide7DatabricksLens } from './Slide7DatabricksLens';
import { Slide8DecisionFramework } from './Slide8DecisionFramework';

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
      'Audience take-away so far: interesting visual, but we have not argued for anything yet.',
    ],
    Component: Slide1Hook,
  },
  {
    id: 's1b',
    kicker: '02 · from data to wisdom',
    title: 'From data to wisdom.',
    subtitle: 'Different layers of meaning demand different shapes of data.',
    speakerNotes: [
      'Classic DIKW hierarchy — with "Insight" as the step between Knowledge and Wisdom.',
      'Data → Information: aggregation and context. SQL and the lakehouse do this well.',
      'Knowledge = connected entities. This is where modelling choice starts to matter.',
      'Insight = patterns ACROSS knowledge — multi-hop reasoning. Graphs shine here.',
      'Wisdom = applied judgement. The domain knowledge you still have to encode somewhere.',
      'Frame the rest of the talk as: where in this hierarchy are you trying to reach?',
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
      'Fixed-depth: walk the chain drug → target → pathway → disease → trial → evidence. 9 JOINs, 5 link tables.',
      'Unknown-depth: WITH RECURSIVE for drug-drug interaction via shared biology. Requires DBR 17+.',
      'Cypher collapses both shapes into one pattern — the hop bound lives in the pattern, not in a WHERE.',
      'Two messages: every hop is another JOIN; every new relation type breaks every query that touches it.',
    ],
    Component: Slide2aSqlPain,
  },
  {
    id: 's2b',
    kicker: '05 · modelling choice',
    title: 'Two ways to be a graph.',
    subtitle: 'RDF is about meaning. LPG is about traversal.',
    speakerNotes: [
      'Show where properties live: RDF uses separate triples; LPG inlines them on the node.',
      'Query shape: SPARQL is set-theoretic pattern matching; Cypher reads like ASCII-art of the path.',
      'In-the-wild anchors: SNOMED / Wikidata (RDF); Neo4j / Neptune / most Graph RAG stacks (LPG).',
      'If unsure which you need, start with LPG — the rest of this talk assumes it.',
    ],
    Component: Slide2bRdfVsLpg,
  },
  {
    id: 's3',
    kicker: '06 · decision map',
    title: 'When does a graph actually make sense?',
    subtitle: 'Choose based on workload shape, not domain shape.',
    speakerNotes: [
      'Two axes: relationship complexity × scale / distributed analytics.',
      'Reporting and customer 360 show up in Lakehouse SQL despite being graph-shaped.',
      'Drug-target-pathway reasoning and fraud rings sit firmly in native-graph or hybrid.',
      'Stress: this slide is opinionated — move workloads around as you see fit.',
    ],
    Component: Slide3DecisionMap,
  },
  {
    id: 's4',
    kicker: '07 · what works, what doesn’t',
    title: 'What works. What doesn’t. What’s hybrid.',
    subtitle: 'Graph-friendly workloads are narrower than they feel.',
    speakerNotes: [
      'Three lanes. Cards drift in and sort.',
      'Borderline cases land in hybrid — use this to talk about Graph RAG as a pragmatic middle.',
      'Don’t skip the “better elsewhere” lane — that’s where we save teams from themselves.',
    ],
    Component: Slide4WorksVsDoesnt,
  },
  {
    id: 's5',
    kicker: '08 · reality at scale',
    title: 'Reality at scale',
    subtitle: 'The graph is rarely the source of truth.',
    speakerNotes: [
      'Walk the pipeline: sources → medallion → enrichment → optional graph projection → serving.',
      'Hit each warning callout: duplication, sync lag, modelling overhead, extra infra, language fragmentation.',
      'Frame the graph service as a serving-layer branch, not a replacement.',
    ],
    Component: Slide5RealityAtScale,
  },
  {
    id: 's6',
    kicker: '09 · rag vs graph rag',
    title: 'Traditional RAG vs Graph RAG',
    subtitle:
      'Could this therapy combination create an indirect risk in this pathway context?',
    speakerNotes: [
      'Same question, two retrieval styles.',
      'Left: similarity pulls chunks. Useful, but flat.',
      'Right: entity extraction → multi-hop path → supporting docs. The relationships become the answer scaffold.',
      'Graph RAG wins when connected entities matter more than chunk similarity.',
    ],
    Component: Slide6RagVsGraphRag,
  },
  {
    id: 's7',
    kicker: '10 · databricks lens',
    title: 'How this fits in a Databricks architecture',
    subtitle:
      'Lakehouse for scale and preparation. Graph for specialised relationship-heavy serving.',
    speakerNotes: [
      'Build bottom-up: ingestion, Delta, medallion, extraction, embeddings, governance.',
      'Graph projection is a branch off Gold/Silver curated entities — not a replacement.',
      'Agents and apps consume vector, graph, or both. Policy & lineage live in UC regardless.',
    ],
    Component: Slide7DatabricksLens,
  },
  {
    id: 's8',
    kicker: '11 · decision framework',
    title: 'A simple decision framework',
    subtitle: 'Graphs matter. Graph databases are specialised.',
    speakerNotes: [
      'Three questions, four terminal recommendations.',
      'Hybrid Graph RAG is usually the right starting point — highlight it before returning to equal emphasis.',
      'Close: graphs are everywhere, graph databases shouldn’t be.',
    ],
    Component: Slide8DecisionFramework,
  },
];
