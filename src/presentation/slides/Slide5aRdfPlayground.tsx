import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ElementDefinition } from 'cytoscape';
import { SlideTitle } from '@/components/ui/SlideTitle';
import { InteractiveGraph } from '@/components/graph/InteractiveGraph';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 5a — Build an RDF graph (interactive).
 * Every triple the user adds produces two nodes (subject, object) and one
 * labelled edge (predicate). Audience sees that in RDF, every property /
 * relationship is its own edge.
 */

type Triple = { id: string; subject: string; predicate: string; object: string };

const PRESET: Triple[] = [
  { id: 't1', subject: 'Metformin', predicate: 'rdfs:type',      object: 'Drug' },
  { id: 't2', subject: 'Metformin', predicate: 'launched',       object: '1995' },
  { id: 't3', subject: 'Metformin', predicate: 'class',          object: 'Biguanide' },
  { id: 't4', subject: 'Metformin', predicate: 'targets',        object: 'AMPK' },
  { id: 't5', subject: 'AMPK',      predicate: 'participatesIn', object: 'Insulin signalling' },
  { id: 't6', subject: 'Metformin', predicate: 'treats',         object: 'Type 2 Diabetes' },
];

function slug(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'x';
}

function triplesToElements(triples: Triple[]): ElementDefinition[] {
  const nodeIds = new Set<string>();
  const els: ElementDefinition[] = [];
  triples.forEach((t) => {
    const sId = slug(t.subject);
    const oId = slug(t.object);
    if (!nodeIds.has(sId)) {
      els.push({
        data: { id: sId, label: t.subject, shortLabel: t.subject },
        classes: 'node-base label-below rdf-node',
      });
      nodeIds.add(sId);
    }
    if (!nodeIds.has(oId)) {
      els.push({
        data: { id: oId, label: t.object, shortLabel: t.object },
        classes: 'node-base label-below rdf-node',
      });
      nodeIds.add(oId);
    }
    els.push({
      data: { id: t.id, source: sId, target: oId, label: t.predicate },
      classes: 'edge-base edge-rdf',
    });
  });
  return els;
}

export function Slide5aRdfPlayground({ config }: { config: SlideConfig }) {
  const [triples, setTriples] = useState<Triple[]>(PRESET);
  const [subject, setSubject] = useState('');
  const [predicate, setPredicate] = useState('');
  const [object, setObject] = useState('');

  const elements = useMemo(() => triplesToElements(triples), [triples]);

  const add = () => {
    if (!subject.trim() || !predicate.trim() || !object.trim()) return;
    setTriples((prev) => [
      ...prev,
      { id: `t_${Date.now()}`, subject: subject.trim(), predicate: predicate.trim(), object: object.trim() },
    ]);
    setSubject('');
    setPredicate('');
    setObject('');
  };

  const remove = (id: string) => setTriples((prev) => prev.filter((t) => t.id !== id));
  const reset = () => setTriples([]);
  const loadPreset = () => setTriples(PRESET);

  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1080 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>Build an RDF graph.</>}
          subtitle="Each triple adds two nodes and one labelled edge. Predicates are first-class."
          small
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: '4vw',
          right: '4vw',
          top: 230,
          bottom: 100,
          display: 'grid',
          gridTemplateColumns: '360px 320px 1fr',
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Left — input + controls */}
        <div
          className="card"
          style={{
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            borderTop: '2px solid var(--color-violet)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-violet)',
              fontWeight: 700,
            }}
          >
            Add a triple
          </div>
          <FieldLabel label="Subject" />
          <Input value={subject} onChange={setSubject} placeholder="Metformin" onEnter={add} />
          <FieldLabel label="Predicate" />
          <Input value={predicate} onChange={setPredicate} placeholder="targets" onEnter={add} />
          <FieldLabel label="Object" />
          <Input value={object} onChange={setObject} placeholder="AMPK" onEnter={add} />

          <button type="button" onClick={add} style={primaryBtnStyle('var(--color-violet)')}>
            + add triple
          </button>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button type="button" onClick={loadPreset} style={ghostBtnStyle()}>
              load Metformin example
            </button>
            <button type="button" onClick={reset} style={ghostBtnStyle()}>
              clear
            </button>
          </div>
        </div>

        {/* Middle — list of triples */}
        <div
          className="card"
          style={{
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-faint)',
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Triples ({triples.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AnimatePresence initial={false}>
              {triples.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: '6px 8px',
                    background: 'rgba(179,155,255,0.06)',
                    border: '1px solid var(--color-line)',
                    borderLeft: '2px solid var(--color-violet)',
                    borderRadius: 6,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--color-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: 'var(--color-warm)' }}>{t.subject}</span>{' '}
                    <span style={{ color: 'var(--color-ink-faint)' }}>—</span>{' '}
                    <span style={{ color: 'var(--color-cool)' }}>{t.predicate}</span>{' '}
                    <span style={{ color: 'var(--color-ink-faint)' }}>→</span>{' '}
                    <span style={{ color: 'var(--color-grounded)' }}>{t.object}</span>
                  </span>
                  <button type="button" onClick={() => remove(t.id)} style={removeBtnStyle()} title="Remove">
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {triples.length === 0 && (
              <div style={emptyHintStyle()}>empty — add a triple or load the preset.</div>
            )}
          </div>
        </div>

        {/* Right — graph */}
        <div
          className="card"
          style={{
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 14,
              zIndex: 5,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-violet)',
              fontWeight: 700,
            }}
          >
            RDF graph
          </div>
          <InteractiveGraph elements={elements} fitPadding={40} />
        </div>
      </div>

      {/* Bottom takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 40,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        Every fact is its own triple · no inlined properties ·{' '}
        <span style={{ color: 'var(--color-violet)' }}>the predicate carries the meaning</span>.
      </motion.div>
    </div>
  );
}

// ---------- UI helpers ----------

function FieldLabel({ label }: { label: string }) {
  return (
    <div
      style={{
        fontSize: 9.5,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--color-ink-faint)',
        fontWeight: 600,
        marginTop: 2,
      }}
    >
      {label}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onEnter?: () => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter?.();
      }}
      placeholder={placeholder}
      style={{
        padding: '7px 10px',
        background: 'rgba(7,9,12,0.75)',
        border: '1px solid var(--color-line)',
        borderRadius: 6,
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        outline: 'none',
      }}
    />
  );
}

function primaryBtnStyle(accent: string): React.CSSProperties {
  return {
    marginTop: 6,
    padding: '9px 12px',
    background: `${accent}20`,
    border: `1px solid ${accent}`,
    borderRadius: 6,
    color: accent,
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    letterSpacing: '0.06em',
    fontWeight: 600,
    cursor: 'pointer',
  };
}

function ghostBtnStyle(): React.CSSProperties {
  return {
    flex: 1,
    padding: '7px 10px',
    background: 'transparent',
    border: '1px solid var(--color-line)',
    borderRadius: 6,
    color: 'var(--color-ink-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10.5,
    letterSpacing: '0.04em',
    cursor: 'pointer',
  };
}

function removeBtnStyle(): React.CSSProperties {
  return {
    padding: '0 6px',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-ink-faint)',
    fontSize: 16,
    cursor: 'pointer',
    lineHeight: 1,
  };
}

function emptyHintStyle(): React.CSSProperties {
  return {
    padding: '10px 8px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--color-ink-faint)',
    fontStyle: 'italic',
  };
}
