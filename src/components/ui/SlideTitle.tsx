import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function SlideTitle({
  kicker,
  title,
  subtitle,
  align = 'left',
  small = false,
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  small?: boolean;
}) {
  const base = { opacity: 0, y: 12 };
  const shown = { opacity: 1, y: 0 };
  const transition = { duration: 0.55, ease: [0.22, 0.9, 0.28, 1] as [number, number, number, number] };

  return (
    <div style={{ textAlign: align }}>
      {kicker && (
        <motion.div
          initial={base}
          animate={shown}
          transition={transition}
          className="pill"
          style={{ color: 'var(--color-warm)', borderColor: 'rgba(255,122,69,0.35)', marginBottom: 18 }}
        >
          <span className="pill-dot" />
          {kicker}
        </motion.div>
      )}
      <motion.h1
        initial={base}
        animate={shown}
        transition={{ ...transition, delay: 0.06 }}
        className="slide-heading"
        style={{
          fontSize: small ? 'clamp(28px, 3.4vw, 52px)' : 'clamp(38px, 5vw, 74px)',
          color: 'var(--color-ink)',
          marginBottom: 16,
          maxWidth: small ? '30ch' : '22ch',
        }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={base}
          animate={shown}
          transition={{ ...transition, delay: 0.14 }}
          style={{
            fontSize: small ? 16 : 20,
            color: 'var(--color-ink-dim)',
            lineHeight: 1.5,
            maxWidth: 62 + 'ch',
            fontWeight: 400,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
