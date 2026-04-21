# Graphs are everywhere… but should we actually use one?

A 14-slide React presentation for Databricks RSAs on **graphs, Graph RAG,
and where they actually fit in a Databricks architecture**. Opinionated,
live-animated, and built around a single life-sciences running example
(Metformin / Type 2 Diabetes / UKPDS) that threads through every slide.

## The deck

| # | Slide | Kind |
|---|---|---|
| 01 | Hook — graphs are everywhere (live graph settles; reasoning path lights up) | Cytoscape + Euler physics |
| 02 | From data to wisdom (DIKW) | Reference illustration |
| 03 | The scenario — a research assistant across trials, KB, literature, notes | React Flow |
| 04 | The SQL pain — Databricks SQL 9-JOIN + `WITH RECURSIVE` vs Cypher | Code panels |
| 05 | Two ways to be a graph — RDF vs LPG | Side-by-side + SPARQL/Cypher |
| 06 | **Build an RDF graph** (interactive — add triples, see the graph) | Interactive Cytoscape |
| 07 | **Build an LPG graph** (interactive — nodes with properties, typed edges) | Interactive Cytoscape |
| 08 | Decision map — relationship complexity × scale | SVG + cards |
| 09 | What works, what doesn’t, what’s hybrid | Lane sort |
| 10 | Reality at scale — duplication, sync, ops, language split | Architecture flow |
| 11 | Traditional RAG vs Graph RAG | Split-screen, sync’d animations |
| 12 | Databricks architecture lens | Layered stack + UC spine |
| 13 | A simple decision framework | React Flow decision tree |
| 14 | **Graph RAG is just pathfinding** (interactive — pick two nodes, find path) | Interactive Cytoscape |

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind v4 (CSS-first config via `@theme`)
- Framer Motion for UI animation
- Cytoscape.js 3.33 + `fcose`, `euler` extensions
- `react-cytoscapejs` (presentation slides) + custom `InteractiveGraph` wrapper (playgrounds)
- `@xyflow/react` for the architecture + decision-tree slides
- Express serves the built bundle for the Databricks App

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

**Keyboard:** `←` / `→` navigate, `1`–`9` jump to slide N, `R` replay animation, `N` toggle presenter notes, `M` toggle reduced motion. Deep-link via `?slide=N`.

## Deploy as a Databricks App

The repo is a Databricks Asset Bundle (DAB). The first deploy uploads the
source; the app runtime runs `npm install` → `npm run build` → `node server.js`.

```bash
# 1. configure DAB targets (first time)
databricks bundle validate -t dev

# 2. upload the bundle to your workspace
databricks bundle deploy -t dev

# 3. start the app
databricks apps start graphs-analytics-and-rag-slides
```

The app listens on `$DATABRICKS_APP_PORT` (injected at runtime) and serves
the built `dist/` folder plus `/healthz` for the probe.

### Files that make it an App

- `app.yaml` — runtime command (`npm run start`)
- `databricks.yml` — Asset Bundle config (`dev` + `prod` targets)
- `server.js` — minimal Express static server with SPA fallback

## Project layout

```
src/
  app/App.tsx                    presentation shell
  presentation/                  shell + keyboard + URL state
    PresentationShell.tsx
    SlideViewport.tsx            16:9 letterbox, auto-scale
    SlideRenderer.tsx            framer-motion slide transitions
    slides/                      14 slide components + configs
  components/
    graph/
      GraphScene.tsx             scripted Cytoscape for narrative slides
      InteractiveGraph.tsx       live-state Cytoscape for playgrounds
      graphDatasets.ts           canonical Metformin / T2D graph
      graphStyles.ts             class-driven stylesheet
      cytoscapeSetup.ts          fcose + euler extension registration
    ui/                          nav, progress, callouts, legend
  styles/
    index.css                    Tailwind v4 + @theme tokens
    theme.ts                     colour + typography tokens
public/
  dikw.jpeg                      DIKW illustration (slide 2)
```

## Credits

- DIKW illustration from the Obsidian forum community.
- Built as a field-engineering artefact for Databricks RSAs.
