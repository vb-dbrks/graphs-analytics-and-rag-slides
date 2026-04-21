import { usePresentation } from '@/presentation/presentationStore';

export function ProgressIndicator() {
  const { currentIndex, total } = usePresentation();
  const pct = ((currentIndex + 1) / total) * 100;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 30 }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-warm), var(--color-cool))',
          transition: 'width 400ms ease-out',
        }}
      />
    </div>
  );
}

export function SlideCounter() {
  const { currentIndex, total } = usePresentation();
  return (
    <div
      style={{
        position: 'absolute',
        left: 24,
        bottom: 20,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.14em',
        color: 'var(--color-ink-faint)',
        zIndex: 30,
      }}
    >
      {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </div>
  );
}
