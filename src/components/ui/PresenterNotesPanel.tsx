import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '@/presentation/presentationStore';
import type { SlideConfig } from '@/presentation/slides/slideConfigs';

export function PresenterNotesPanel({ slides }: { slides: SlideConfig[] }) {
  const { presenterMode, currentIndex } = usePresentation();
  const slide = slides[currentIndex];
  return (
    <AnimatePresence>
      {presenterMode && (
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            width: 340,
            maxHeight: '72vh',
            overflowY: 'auto',
            zIndex: 40,
          }}
          className="card"
        >
          <div style={{ padding: '16px 18px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.16em',
                color: 'var(--color-warm)',
                marginBottom: 8,
                textTransform: 'uppercase',
              }}
            >
              Presenter notes · slide {currentIndex + 1}
            </div>
            <div style={{ color: 'var(--color-ink)', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
              {slide.title}
            </div>
            <ul className="presenter-notes" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {slide.speakerNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--color-ink-faint)' }}>
              <span className="kbd">N</span> hide · <span className="kbd">R</span> replay ·{' '}
              <span className="kbd">M</span> reduced motion
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
