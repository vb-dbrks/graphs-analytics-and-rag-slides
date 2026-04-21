import { usePresentation } from '@/presentation/presentationStore';

export function NavigationControls() {
  const { prev, next, replay, currentIndex, total } = usePresentation();
  return (
    <div
      style={{
        position: 'absolute',
        right: 24,
        bottom: 20,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        zIndex: 30,
      }}
    >
      <button
        type="button"
        onClick={replay}
        title="Replay animation (R)"
        className="rounded-lg border border-line px-3 py-1.5 text-[12px] font-mono text-ink-dim hover:text-ink hover:border-line-strong transition-colors"
        style={{ background: 'rgba(14,18,24,0.7)' }}
      >
        replay
      </button>
      <button
        type="button"
        onClick={prev}
        disabled={currentIndex === 0}
        title="Previous (←)"
        className="rounded-lg border border-line px-3 py-1.5 text-ink-dim hover:text-ink hover:border-line-strong disabled:opacity-30 transition-colors"
        style={{ background: 'rgba(14,18,24,0.7)' }}
      >
        ←
      </button>
      <button
        type="button"
        onClick={next}
        disabled={currentIndex >= total - 1}
        title="Next (→)"
        className="rounded-lg border border-line px-3 py-1.5 text-ink-dim hover:text-ink hover:border-line-strong disabled:opacity-30 transition-colors"
        style={{ background: 'rgba(14,18,24,0.7)' }}
      >
        →
      </button>
    </div>
  );
}
