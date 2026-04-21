import { createContext, useContext } from 'react';

export type AnimationPhase = 'idle' | 'enter' | 'build' | 'emphasise' | 'settle';

export type PresentationState = {
  currentIndex: number;
  total: number;
  direction: 1 | -1;
  reducedMotion: boolean;
  presenterMode: boolean;
  replayToken: number;
  animationPhase: AnimationPhase;
};

export type PresentationActions = {
  next: () => void;
  prev: () => void;
  goTo: (i: number) => void;
  replay: () => void;
  toggleReducedMotion: () => void;
  togglePresenter: () => void;
};

export type PresentationContextValue = PresentationState & PresentationActions;

export const PresentationContext = createContext<PresentationContextValue | null>(null);

export function usePresentation(): PresentationContextValue {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error('usePresentation must be used inside <PresentationShell>');
  return ctx;
}
