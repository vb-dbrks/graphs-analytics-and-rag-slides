import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 2b — two ways to be a graph.
 * Focuses exclusively on RDF vs LPG. Each pane shows (1) where properties
 * live, (2) query syntax, (3) who uses it in the wild. Bottom line reinforces
 * the one-liner ("meaning vs traversal").
 */

export function Slide2bRdfVsLpg({ config }: { config: SlideConfig }) {
  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1100 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>Two ways to be a graph.</>}
          subtitle="Same information — different assumptions about meaning, identity, and how you'll query."
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 240,
          bottom: 110,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
        }}
      >
        {/* RDF */}
        <Pane
          tone="violet"
          name="RDF"
          tagline="subject → predicate → object"
        >
          <Section heading="Properties live on their own — as triples">
            <Code>
              <Line>
                :<Tok c="warm">Metformin</Tok> :rdfs:type <Tok c="violet">:Drug</Tok> .
              </Line>
              <Line>
                :<Tok c="warm">Metformin</Tok> :launched <Tok c="grounded">1995</Tok> .
              </Line>
              <Line>
                :<Tok c="warm">Metformin</Tok> :class <Tok c="grounded">&quot;Biguanide&quot;</Tok> .
              </Line>
              <Line>
                :<Tok c="warm">Metformin</Tok> :treats <Tok c="violet">:T2Diabetes</Tok> .
              </Line>
              <Comment>// one fact = one triple · predicates are global URIs</Comment>
            </Code>
          </Section>

          <Section heading="Query · SPARQL">
            <Code>
              <Line>
                <Tok c="warm" bold>SELECT</Tok> ?disease
              </Line>
              <Line>
                <Tok c="warm" bold>WHERE</Tok> &#123;
              </Line>
              <Line>
                {'  '}:Metformin :treats ?disease .
              </Line>
              <Line>
                {'  '}?disease a :MetabolicDisease .
              </Line>
              <Line>&#125;</Line>
            </Code>
          </Section>

          <Footer
            bullets={[
              'standards-first · built for interoperability',
              'reasoners can derive new triples from ontologies',
            ]}
            wild={['SNOMED CT', 'Wikidata', 'Gene Ontology', 'schema.org']}
            tone="violet"
          />
        </Pane>

        {/* LPG */}
        <Pane
          tone="warm"
          name="LPG"
          tagline="nodes + edges + inline properties"
        >
          <Section heading="Properties live on the node">
            <Code>
              <Line>
                (m:<Tok c="violet">Drug</Tok> &#123;
              </Line>
              <Line>
                {'  '}name: <Tok c="grounded">&quot;Metformin&quot;</Tok>,
              </Line>
              <Line>
                {'  '}launched: <Tok c="grounded">1995</Tok>,
              </Line>
              <Line>
                {'  '}class: <Tok c="grounded">&quot;Biguanide&quot;</Tok>
              </Line>
              <Line>&#125;)-[:TREATS]-&gt;(d:<Tok c="violet">Disease</Tok>)</Line>
              <Comment>// one node, many properties · edges are typed + directional</Comment>
            </Code>
          </Section>

          <Section heading="Query · Cypher">
            <Code>
              <Line>
                <Tok c="warm" bold>MATCH</Tok> (m:Drug &#123;name: &quot;Metformin&quot;&#125;)
              </Line>
              <Line>
                {'      '}-[:TREATS]-&gt;(d:Disease)
              </Line>
              <Line>
                <Tok c="warm" bold>WHERE</Tok> d.class = <Tok c="grounded">&quot;Metabolic&quot;</Tok>
              </Line>
              <Line>
                <Tok c="warm" bold>RETURN</Tok> d
              </Line>
            </Code>
          </Section>

          <Footer
            bullets={[
              'application-first · flexible schema',
              'query reads like ASCII-art of the traversal',
            ]}
            wild={['Neo4j', 'Neptune', 'TigerGraph', 'most Graph-RAG stacks']}
            tone="warm"
          />
        </Pane>
      </div>

      {/* Bottom punchline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 38,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ color: 'var(--color-violet)' }}>RDF</span> is about meaning ·{' '}
        <span style={{ color: 'var(--color-warm)' }}>LPG</span> is about traversal · most{' '}
        <span style={{ color: 'var(--color-ink)' }}>Graph RAG stacks use LPG</span>.
      </motion.div>
    </div>
  );
}

// ---------- sub-components ----------

function Pane({
  tone,
  name,
  tagline,
  children,
}: {
  tone: 'violet' | 'warm';
  name: string;
  tagline: string;
  children: React.ReactNode;
}) {
  const accent = tone === 'violet' ? 'var(--color-violet)' : 'var(--color-warm)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="card"
      style={{
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        borderTop: `2px solid ${accent}`,
        background: `linear-gradient(180deg, ${accent}0e, rgba(14,18,24,0.82) 50%)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: accent,
            fontWeight: 800,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.04em',
          }}
        >
          {tagline}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div
        style={{
          fontSize: 10,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-dim)',
          fontWeight: 600,
        }}
      >
        {heading}
      </div>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: '10px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        lineHeight: 1.55,
        color: 'var(--color-ink)',
        background: 'rgba(7,9,12,0.55)',
        border: '1px solid var(--color-line)',
        borderRadius: 8,
        whiteSpace: 'pre-wrap',
      }}
    >
      {children}
    </pre>
  );
}

function Line({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function Comment({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ color: 'var(--color-ink-faint)', fontStyle: 'italic', marginTop: 2 }}>{children}</div>
  );
}

function Tok({
  c,
  children,
  bold,
}: {
  c: 'warm' | 'violet' | 'cool' | 'grounded';
  children: React.ReactNode;
  bold?: boolean;
}) {
  const color =
    c === 'warm'
      ? '#ff7a45'
      : c === 'violet'
        ? '#b39bff'
        : c === 'grounded'
          ? '#4fd1a5'
          : '#5ec8ff';
  return <span style={{ color, fontWeight: bold ? 600 : 400 }}>{children}</span>;
}

function Footer({
  bullets,
  wild,
  tone,
}: {
  bullets: string[];
  wild: string[];
  tone: 'violet' | 'warm';
}) {
  const accent = tone === 'violet' ? 'var(--color-violet)' : 'var(--color-warm)';
  return (
    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: 12,
          color: 'var(--color-ink-dim)',
          lineHeight: 1.5,
        }}
      >
        {bullets.map((b) => (
          <li key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '2px 0' }}>
            <span
              style={{
                color: accent,
                marginTop: 2,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
              }}
            >
              ›
            </span>
            {b}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div
          style={{
            fontSize: 9.5,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-ink-faint)',
            fontWeight: 600,
          }}
        >
          in the wild
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {wild.map((w) => (
            <span
              key={w}
              style={{
                padding: '3px 9px',
                border: `1px solid ${accent}45`,
                background: `${accent}12`,
                borderRadius: 999,
                fontSize: 11,
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.03em',
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
