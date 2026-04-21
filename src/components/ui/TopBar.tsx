import { usePresentation } from '@/presentation/presentationStore';

export function TopBar() {
  const { presenterMode, reducedMotion } = usePresentation();
  return (
    <div
      style={{
        position: 'absolute',
        top: 14,
        left: 24,
        right: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
        }}
      >
        graphs · graph rag · databricks architecture
      </div>
      <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
        {presenterMode && <span className="kbd" style={{ color: 'var(--color-warm)' }}>presenter</span>}
        {reducedMotion && <span className="kbd" style={{ color: 'var(--color-cool)' }}>reduced-motion</span>}
        <span className="kbd">← → nav</span>
        <span className="kbd">R replay</span>
        <span className="kbd">N notes</span>
      </div>
    </div>
  );
}
