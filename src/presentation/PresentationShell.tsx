import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import {
  PresentationContext,
  type AnimationPhase,
  type PresentationState,
} from './presentationStore';

type Action =
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goTo'; index: number }
  | { type: 'replay' }
  | { type: 'toggleReducedMotion' }
  | { type: 'togglePresenter' }
  | { type: 'phase'; phase: AnimationPhase };

function reducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'next': {
      const next = Math.min(state.currentIndex + 1, state.total - 1);
      if (next === state.currentIndex) return state;
      return { ...state, currentIndex: next, direction: 1, animationPhase: 'enter', replayToken: state.replayToken + 1 };
    }
    case 'prev': {
      const prev = Math.max(state.currentIndex - 1, 0);
      if (prev === state.currentIndex) return state;
      return { ...state, currentIndex: prev, direction: -1, animationPhase: 'enter', replayToken: state.replayToken + 1 };
    }
    case 'goTo': {
      const clamped = Math.max(0, Math.min(action.index, state.total - 1));
      if (clamped === state.currentIndex) return state;
      return {
        ...state,
        currentIndex: clamped,
        direction: clamped > state.currentIndex ? 1 : -1,
        animationPhase: 'enter',
        replayToken: state.replayToken + 1,
      };
    }
    case 'replay':
      return { ...state, replayToken: state.replayToken + 1, animationPhase: 'enter' };
    case 'toggleReducedMotion':
      return { ...state, reducedMotion: !state.reducedMotion };
    case 'togglePresenter':
      return { ...state, presenterMode: !state.presenterMode };
    case 'phase':
      return { ...state, animationPhase: action.phase };
  }
}

function readInitialIndex(total: number): number {
  try {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('slide');
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(n - 1, total - 1));
  } catch {
    return 0;
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PresentationShell({
  total,
  children,
}: {
  total: number;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, (): PresentationState => ({
    currentIndex: readInitialIndex(total),
    total,
    direction: 1,
    reducedMotion: prefersReducedMotion(),
    presenterMode: false,
    replayToken: 0,
    animationPhase: 'enter',
  }));

  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const prev = useCallback(() => dispatch({ type: 'prev' }), []);
  const goTo = useCallback((i: number) => dispatch({ type: 'goTo', index: i }), []);
  const replay = useCallback(() => dispatch({ type: 'replay' }), []);
  const toggleReducedMotion = useCallback(() => dispatch({ type: 'toggleReducedMotion' }), []);
  const togglePresenter = useCallback(() => dispatch({ type: 'togglePresenter' }), []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          next();
          return;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev();
          return;
        case 'Home':
          e.preventDefault();
          goTo(0);
          return;
        case 'End':
          e.preventDefault();
          goTo(total - 1);
          return;
        case 'r':
        case 'R':
          e.preventDefault();
          replay();
          return;
        case 'n':
        case 'N':
          e.preventDefault();
          togglePresenter();
          return;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleReducedMotion();
          return;
      }
      if (/^[1-9]$/.test(e.key)) {
        const n = parseInt(e.key, 10) - 1;
        if (n < total) goTo(n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, goTo, replay, togglePresenter, toggleReducedMotion, total]);

  // Keep URL in sync.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('slide', String(state.currentIndex + 1));
      window.history.replaceState(null, '', url.toString());
    } catch {
      /* no-op */
    }
  }, [state.currentIndex]);

  const value = useMemo(
    () => ({ ...state, next, prev, goTo, replay, toggleReducedMotion, togglePresenter }),
    [state, next, prev, goTo, replay, toggleReducedMotion, togglePresenter],
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}
