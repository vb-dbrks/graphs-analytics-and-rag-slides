import { AnimatePresence, motion } from 'framer-motion';
import type { ComponentType } from 'react';
import { usePresentation } from './presentationStore';
import type { SlideConfig } from './slides/slideConfigs';

export function SlideRenderer({ slides }: { slides: SlideConfig[] }) {
  const { currentIndex, direction, replayToken, reducedMotion } = usePresentation();
  const slide = slides[currentIndex];
  const Slide: ComponentType<{ config: SlideConfig; replayKey: number; reducedMotion: boolean }> =
    slide.Component;

  const variants = reducedMotion
    ? { enter: { opacity: 1 }, centre: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ opacity: 0, x: d * 36 }),
        centre: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: -d * 36 }),
      };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slide.id + ':' + replayToken}
        custom={direction}
        variants={variants as any}
        initial="enter"
        animate="centre"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.22, 0.9, 0.28, 1] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Slide config={slide} replayKey={replayToken} reducedMotion={reducedMotion} />
      </motion.div>
    </AnimatePresence>
  );
}
