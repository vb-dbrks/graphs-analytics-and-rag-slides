import { motion } from 'framer-motion';
import { SlideTitle } from '@/components/ui/SlideTitle';
import type { SlideConfig } from './slideConfigs';

/**
 * Slide 1b — DIKW (Data → Information → Knowledge → Insight → Wisdom).
 * Uses an external illustration that shows the progression as an evolving
 * graph (points → typed points → connected → highlighted → path). Ties the
 * framing straight into the talk's graph-shaped thesis.
 */

type Level = {
  id: string;
  name: string;
  definition: string;
  example: string;
  accent: string;
};

const LEVELS: Level[] = [
  {
    id: 'data',
    name: 'Data',
    definition: 'raw, context-free facts',
    example: 'Glucose: 180 mg/dL · Dose: 500 mg · Trial ID: NCT00123',
    accent: '#8e98a8',
  },
  {
    id: 'information',
    name: 'Information',
    definition: 'data in context',
    example: 'Across 3,867 patients, Metformin lowered blood sugar ~25% more than placebo.',
    accent: '#5ec8ff',
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    definition: 'information + understanding',
    example: 'Metformin treats Type 2 Diabetes by acting on a cellular sugar-control pathway.',
    accent: '#ff7a45',
  },
  {
    id: 'insight',
    name: 'Insight',
    definition: 'patterns across knowledge',
    example: 'Other drugs on the same pathway also show weight-loss benefit — a repurposing lead.',
    accent: '#4fd1a5',
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    definition: 'applied judgement · the why and when',
    example: 'First-line for Type 2 Diabetes — skip if the patient has kidney disease.',
    accent: '#b39bff',
  },
];

export function Slide1bDikw({ config }: { config: SlideConfig }) {
  return (
    <div className="slide-safe" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ maxWidth: 1100 }}>
        <SlideTitle
          kicker={config.kicker}
          title={<>From data to wisdom.</>}
          subtitle="Each step adds structure. The shape of your data has to keep up."
          small
        />
      </div>

      {/* Illustration — five-panel DIKW progression as an evolving graph */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          left: '5vw',
          right: '5vw',
          top: 225,
          height: 260,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/dikw.jpeg"
          alt="DIKW hierarchy — Data, Information, Knowledge, Insight, Wisdom shown as a progressively connected graph"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            border: '1px solid var(--color-line-strong)',
            borderRadius: 8,
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)',
          }}
        />
      </motion.div>

      {/* Five columns of descriptions aligned under the image panels */}
      <div
        style={{
          position: 'absolute',
          left: '5vw',
          right: '5vw',
          top: 510,
          bottom: 120,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}
      >
        {LEVELS.map((lvl, i) => (
          <motion.div
            key={lvl.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.45 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              borderTop: `2px solid ${lvl.accent}`,
              paddingTop: 10,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: lvl.accent,
                fontWeight: 700,
              }}
            >
              {lvl.name}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: 'var(--color-ink-faint)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.02em',
                lineHeight: 1.4,
              }}
            >
              {lvl.definition}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--color-ink-dim)',
                lineHeight: 1.45,
                marginTop: 2,
              }}
            >
              {lvl.example}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          bottom: 42,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--color-ink-dim)',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ color: 'var(--color-cool)' }}>Tables</span> serve data and information ·{' '}
        <span style={{ color: 'var(--color-warm)' }}>graphs</span> make knowledge tractable ·{' '}
        <span style={{ color: 'var(--color-grounded)' }}>Graph RAG</span> is how you climb toward{' '}
        <span style={{ color: 'var(--color-violet)' }}>insight and wisdom</span>.
      </motion.div>
    </div>
  );
}
