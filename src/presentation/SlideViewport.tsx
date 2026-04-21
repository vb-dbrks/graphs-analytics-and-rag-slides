import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 16:9 letterbox viewport. Children render at a fixed virtual resolution
 * (1600x900) and are scaled to fit. Makes absolute positioning in slides
 * reliable regardless of window size.
 */
export function SlideViewport({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const s = Math.min(w / 1600, h / 900);
      setScale(s);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="viewport" style={{ display: 'grid', placeItems: 'center' }}>
      <div
        style={{
          width: 1600,
          height: 900,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          background: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
}
