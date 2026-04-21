import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function CalloutPanel({
  visible,
  title,
  body,
  tone = 'cool',
  style,
}: {
  visible: boolean;
  title: ReactNode;
  body?: ReactNode;
  tone?: 'warm' | 'cool' | 'good' | 'danger';
  style?: React.CSSProperties;
}) {
  const accent =
    tone === 'warm' ? 'var(--color-warm)'
    : tone === 'good' ? 'var(--color-grounded)'
    : tone === 'danger' ? 'var(--color-danger)'
    : 'var(--color-cool)';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="card"
          style={{
            padding: '14px 16px',
            borderLeft: `3px solid ${accent}`,
            maxWidth: 380,
            ...style,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 6,
              fontWeight: 500,
            }}
          >
            {title}
          </div>
          {body && (
            <div style={{ color: 'var(--color-ink)', fontSize: 14, lineHeight: 1.5 }}>
              {body}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
