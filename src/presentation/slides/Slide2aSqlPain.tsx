import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 2a — the SQL pain.
 * Two realistic questions, two SQL shapes: fixed-depth (big JOIN chain) and
 * variable-depth (WITH RECURSIVE). A single Cypher pattern handles both.
 */

const CHAIN = [
  { label: 'Drug',     sub: 'Metformin',          accent: '#ff7a45' },
  { label: 'Target',   sub: 'AMPK',               accent: '#b39bff' },
  { label: 'Pathway',  sub: 'Insulin signalling', accent: '#5ec8ff' },
  { label: 'Disease',  sub: 'Type 2 Diabetes',    accent: '#ff5d6c' },
  { label: 'Trial',    sub: 'UKPDS',              accent: '#f6c177' },
  { label: 'Evidence', sub: 'paper / label',      accent: '#4fd1a5' },
];

export function Slide2aSqlPain({ config }: { config: SlideConfig }) {
  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1100 }}>
        <SlideTitle
          kicker={config.kicker}
          title={
            <>
              The question is simple.{' '}
              <span style={{ color: 'var(--color-warm)' }}>The SQL isn&rsquo;t.</span>
            </>
          }
          subtitle="Two real questions a graph-shaped domain forces on you — one fixed-depth, one hierarchical."
          small
        />
      </div>

      {/* Chain visual */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 216,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {CHAIN.map((n, i) => (
          <motion.div
            key={n.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div
              style={{
                padding: '6px 10px',
                border: `1px solid ${n.accent}55`,
                background: `${n.accent}14`,
                borderRadius: 8,
                minWidth: 100,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: n.accent,
                  fontWeight: 700,
                }}
              >
                {n.label}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-ink)', fontWeight: 500 }}>
                {n.sub}
              </div>
            </div>
            {i < CHAIN.length - 1 && (
              <span style={{ color: 'var(--color-ink-faint)', fontSize: 13 }}>→</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Code area — left has two SQL shapes, right has one Cypher pattern */}
      <div
        style={{
          position: 'absolute',
          left: '3.5vw',
          right: '3.5vw',
          top: 290,
          bottom: 120,
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: 18,
        }}
      >
        {/* Left column — two SQL blocks stacked (flex: 1 each keeps them equal) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <CodePanel
            tone="cool"
            language="Databricks SQL · fixed depth"
            question="“Evidence supporting Metformin for T2D?”"
            tagline="9 JOINs across 5 link tables"
            tall
            edge={{
              headline: 'graph wins when',
              bullets: [
                '> 4 hops · SQL gets unreadable, Cypher stays one pattern',
                'bidirectional / branching paths · SQL needs UNIONs',
                'schema evolves · a new relation type = rewrite every query',
              ],
            }}
            code={[
              <><KW>SELECT DISTINCT</KW> e.title, e.year</>,
              <><KW>FROM</KW>   main.bio.drugs d</>,
              <>  <KW>JOIN</KW> main.bio.drug_target        <KW>USING</KW>(drug_id)</>,
              <>  <KW>JOIN</KW> main.bio.targets            <KW>USING</KW>(target_id)</>,
              <>  <KW>JOIN</KW> main.bio.target_pathway     <KW>USING</KW>(target_id)</>,
              <>  <KW>JOIN</KW> main.bio.pathways           <KW>USING</KW>(pathway_id)</>,
              <>  <KW>JOIN</KW> main.bio.pathway_disease    <KW>USING</KW>(pathway_id)</>,
              <>  <KW>JOIN</KW> main.bio.diseases ds        <KW>USING</KW>(disease_id)</>,
              <>  <KW>JOIN</KW> main.bio.trial_disease      <KW>USING</KW>(disease_id)</>,
              <>  <KW>JOIN</KW> main.bio.trials             <KW>USING</KW>(trial_id)</>,
              <>  <KW>JOIN</KW> main.bio.evidence e         <KW>USING</KW>(trial_id)</>,
              <><KW>WHERE</KW>  d.name = <STR>&apos;Metformin&apos;</STR></>,
              <>  <KW>AND</KW>  ds.name = <STR>&apos;Type 2 Diabetes&apos;</STR>;</>,
            ]}
          />

          <CodePanel
            tone="cool"
            language="Databricks SQL · unknown depth"
            question="“Which drugs might interact with Metformin through shared biology?”"
            tagline="WITH RECURSIVE · DBR 17 · needs a unified edge table"
            tall
            edge={{
              headline: 'graph wins when',
              bullets: [
                'index-free adjacency · each node knows its neighbours without a lookup',
                'recursive CTEs re-scan edges per iteration · O(rows × iter)',
                'cycle detection is trivial in Cypher, manual in SQL (array-contains trick)',
              ],
            }}
            code={[
              <><CM>-- Databricks Runtime 17.0+ / DBSQL 2025.20+</CM></>,
              <><KW>WITH RECURSIVE</KW> reach(id, hops) <KW>AS</KW> (</>,
              <>  <KW>SELECT</KW> id, <NUM>0</NUM> <KW>FROM</KW> main.bio.nodes <KW>WHERE</KW> name=<STR>&apos;Metformin&apos;</STR></>,
              <>  <KW>UNION ALL</KW></>,
              <>  <KW>SELECT</KW> e.dst_id, r.hops + <NUM>1</NUM></>,
              <>  <KW>FROM</KW> reach r <KW>JOIN</KW> main.bio.edges e <KW>ON</KW> e.src_id = r.id</>,
              <>  <KW>WHERE</KW> r.hops &lt; <NUM>5</NUM></>,
              <>)</>,
              <><KW>SELECT DISTINCT</KW> n.name <KW>FROM</KW> reach <KW>JOIN</KW> main.bio.nodes n <KW>USING</KW>(id)</>,
              <> <KW>WHERE</KW> n.type = <STR>&apos;Drug&apos;</STR> <KW>AND</KW> n.name &lt;&gt; <STR>&apos;Metformin&apos;</STR>;</>,
            ]}
          />
        </div>

        {/* Right column — one Cypher pattern that handles both shapes */}
        <CodePanel
          tone="warm"
          language="Cypher"
          question="one pattern · either shape"
          tagline="the bound lives in the pattern"
          tall
          code={[
            <><CM>// fixed-depth: specific edges + labels</CM></>,
            <><KW>MATCH</KW> (d:<LAB>Drug</LAB> &#123;name:<STR>&quot;Metformin&quot;</STR>&#125;)</>,
            <>      -[:<REL>TARGETS</REL>]-&gt;(:<LAB>Target</LAB>)</>,
            <>      -[:<REL>PARTICIPATES_IN</REL>]-&gt;(:<LAB>Pathway</LAB>)</>,
            <>      -[:<REL>ASSOCIATED_WITH</REL>]-&gt;(:<LAB>Disease</LAB> &#123;name:<STR>&quot;T2D&quot;</STR>&#125;)</>,
            <>      -[:<REL>TESTED_IN</REL>]-&gt;(:<LAB>Trial</LAB>)</>,
            <>      -[:<REL>DESCRIBED_BY</REL>]-&gt;(e:<LAB>Evidence</LAB>)</>,
            <><KW>RETURN DISTINCT</KW> e.title, e.year;</>,
            <> </>,
            <><CM>// drugs that interact via shared biology</CM></>,
            <><KW>MATCH</KW> (d:<LAB>Drug</LAB> &#123;name:<STR>&quot;Metformin&quot;</STR>&#125;)-[*<NUM>1..5</NUM>]-(other:<LAB>Drug</LAB>)</>,
            <><KW>WHERE</KW> other.name &lt;&gt; <STR>&quot;Metformin&quot;</STR></>,
            <><KW>RETURN DISTINCT</KW> other.name;</>,
            <> </>,
            <><CM>// other bound styles:</CM></>,
            <><CM>//   [*]      · unbounded   (risky on dense graphs)</CM></>,
            <><CM>//   [*..3]   · up to 3 hops</CM></>,
            <><CM>//   [*2..]   · 2+ hops</CM></>,
          ]}
        />
      </div>

      {/* Metrics strip */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: '3.5vw',
          right: '3.5vw',
          bottom: 72,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}
      >
        <Metric kicker="joins for fixed depth"  sqlVal="9"              graphVal="0" />
        <Metric kicker="hop bound lives in"     sqlVal="WHERE clause"   graphVal="pattern" />
        <Metric kicker="readability"            sqlVal="imperative"     graphVal="declarative" />
        <Metric kicker="new relation type"      sqlVal="rewrite query"  graphVal="no change" />
      </motion.div>

      {/* Takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 30,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        SQL can do graphs — it just pays for every hop.{' '}
        <span style={{ color: 'var(--color-warm)' }}>
          Traversal is a primitive in Cypher, an escape hatch in SQL.
        </span>
      </motion.div>
    </div>
  );
}

// ------ inline token helpers ------

function KW({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#ff7a45', fontWeight: 600 }}>{children}</span>;
}
function STR({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#4fd1a5' }}>{children}</span>;
}
function LAB({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#b39bff' }}>{children}</span>;
}
function REL({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#5ec8ff' }}>{children}</span>;
}
function NUM({ children }: { children: React.ReactNode }) {
  return <span style={{ color: '#f6c177' }}>{children}</span>;
}
function CM({ children }: { children: React.ReactNode }) {
  return <span style={{ color: 'var(--color-ink-faint)', fontStyle: 'italic' }}>{children}</span>;
}

function CodePanel({
  tone,
  language,
  question,
  tagline,
  code,
  tall,
  edge,
}: {
  tone: 'cool' | 'warm';
  language: string;
  question: string;
  tagline: string;
  code: React.ReactNode[];
  tall?: boolean;
  edge?: { headline: string; bullets: string[] };
}) {
  const accent = tone === 'warm' ? 'var(--color-warm)' : 'var(--color-cool)';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="card"
      style={{
        position: 'relative',
        padding: '10px 12px',
        overflow: 'hidden',
        borderTop: `2px solid ${accent}`,
        background: `linear-gradient(180deg, ${accent}0e, rgba(14,18,24,0.82) 50%)`,
        display: 'flex',
        flexDirection: 'column',
        flex: tall ? 1 : undefined,
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 4,
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accent,
            fontWeight: 700,
          }}
        >
          {language}
        </div>
        <div
          style={{
            fontSize: 10.5,
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-ink-faint)',
            letterSpacing: '0.04em',
            textAlign: 'right',
          }}
        >
          {tagline}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--color-ink-dim)',
          marginBottom: 6,
          lineHeight: 1.3,
          fontStyle: 'italic',
        }}
      >
        {question}
      </div>
      <pre
        style={{
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          lineHeight: 1.4,
          color: 'var(--color-ink)',
          whiteSpace: 'pre',
          flex: 1,
          overflowX: 'auto',
          overflowY: 'auto',
          minHeight: 0,
          paddingBottom: 4,
        }}
      >
        {code.map((line, i) => (
          <div key={i} style={{ display: 'block' }}>
            <span
              style={{
                color: 'var(--color-ink-faint)',
                paddingRight: 10,
                userSelect: 'none',
                display: 'inline-block',
                minWidth: 22,
                textAlign: 'right',
              }}
            >
              {String(i + 1).padStart(2, ' ')}
            </span>
            {line}
          </div>
        ))}
      </pre>
      {edge && <EdgeNote headline={edge.headline} bullets={edge.bullets} />}
    </motion.div>
  );
}

function EdgeNote({ headline, bullets }: { headline: string; bullets: string[] }) {
  return (
    <div
      style={{
        marginTop: 6,
        padding: '7px 9px',
        border: '1px dashed rgba(255,122,69,0.4)',
        borderRadius: 6,
        background: 'rgba(255,122,69,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 8.5,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-warm)',
          fontWeight: 700,
        }}
      >
        ⚡ {headline}
      </div>
      {bullets.map((b, i) => (
        <div
          key={i}
          style={{
            fontSize: 10.5,
            color: 'var(--color-ink-dim)',
            lineHeight: 1.35,
            fontFamily: 'var(--font-display)',
          }}
        >
          <span style={{ color: 'var(--color-warm)', marginRight: 6, fontFamily: 'var(--font-mono)' }}>›</span>
          {b}
        </div>
      ))}
    </div>
  );
}

function Metric({
  kicker,
  sqlVal,
  graphVal,
}: {
  kicker: string;
  sqlVal: string;
  graphVal: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '7px 11px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          fontWeight: 600,
        }}
      >
        {kicker}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 8.5,
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-cool)',
              letterSpacing: '0.14em',
            }}
          >
            SQL
          </span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--color-ink)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sqlVal}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
          <span
            style={{
              fontSize: 8.5,
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-warm)',
              letterSpacing: '0.14em',
            }}
          >
            CYPHER
          </span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--color-ink)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {graphVal}
          </span>
        </div>
      </div>
    </div>
  );
}
