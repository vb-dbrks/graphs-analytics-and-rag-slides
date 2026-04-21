import { theme } from '@/styles/theme';
import type { NodeType } from '@/components/graph/graphDatasets';

const SHAPE_SVG: Record<string, (color: string) => JSX.Element> = {
  compound: (c) => <rect x={2} y={4} width={14} height={10} rx={3} fill={c} />,
  target: (c) => (
    <polygon points="9,2 16,9 9,16 2,9" fill={c} />
  ),
  pathway: (c) => (
    <polygon points="4,4 14,4 17,9 14,14 4,14 1,9" fill={c} />
  ),
  disease: (c) => <polygon points="9,2 17,15 1,15" fill={c} />,
  trial: (c) => <rect x={2} y={5} width={14} height={8} rx={4} fill={c} />,
  document: (c) => <rect x={4} y={2} width={10} height={14} rx={2} fill={c} />,
  chunk: (c) => <rect x={5} y={5} width={8} height={8} rx={2} fill={c} />,
  vector_index: (c) => <rect x={2} y={5} width={14} height={8} rx={2} fill={c} />,
  lakehouse_table: (c) => <rect x={1} y={6} width={16} height={6} rx={1} fill={c} />,
  graph_projection: (c) => <polygon points="4,4 14,4 17,9 14,14 4,14 1,9" fill={c} />,
  agent: (c) => <polygon points="9,2 17,7 14,16 4,16 1,7" fill={c} />,
  question: (c) => <circle cx={9} cy={9} r={6} fill={c} />,
  answer: (c) => <circle cx={9} cy={9} r={6} fill={c} />,
  cohort: (c) => <polygon points="5,3 13,3 17,9 13,15 5,15 1,9" fill={c} />,
  platform: (c) => <rect x={2} y={5} width={14} height={8} rx={2} fill={c} />,
};

export function LegendSwatch({ type, label }: { type: NodeType; label: string }) {
  const color = theme.nodeType[type];
  const drawer = SHAPE_SVG[type] ?? SHAPE_SVG.platform;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden>
        {drawer(color)}
      </svg>
      <span style={{ fontSize: 11, color: 'var(--color-ink-dim)', letterSpacing: '0.02em' }}>
        {label}
      </span>
    </div>
  );
}

export function Legend({
  items,
  style,
}: {
  items: Array<{ type: NodeType; label: string }>;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-faint)',
          marginBottom: 4,
        }}
      >
        Legend
      </div>
      {items.map((it) => (
        <LegendSwatch key={it.type + it.label} type={it.type} label={it.label} />
      ))}
    </div>
  );
}
