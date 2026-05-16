import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const QUADRANT_COLORS = {
  'Quick win': '#10b981',
  'Strategic bet': '#6366f1',
  'Nice-to-have': '#f59e0b',
  'Avoid': '#ef4444',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-title">{d.title}</p>
      <p>Value: {d.value?.toFixed(1)}</p>
      <p>Effort: {d.effort}</p>
      <p className="tooltip-quadrant" style={{ color: QUADRANT_COLORS[d.quadrant] }}>{d.quadrant}</p>
    </div>
  );
}

function CustomDot(props) {
  const { cx, cy, payload } = props;
  const color = QUADRANT_COLORS[payload.quadrant] ?? '#6366f1';
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.85} stroke="white" strokeWidth={2} />
    </g>
  );
}

export default function PriorityMatrix({ items, metrics }) {
  const impactMetric = metrics.find(m => m.id === 'impact');
  const userValueMetric = metrics.find(m => m.id === 'userValue');
  const effortMetric = metrics.find(m => m.id === 'effort');

  const data = items.map(item => {
    const impact = impactMetric ? (item.scores[impactMetric.id] ?? 3) : 3;
    const userValue = userValueMetric ? (item.scores[userValueMetric.id] ?? 3) : 3;
    const effort = effortMetric ? (item.scores[effortMetric.id] ?? 3) : 3;
    return {
      title: item.title,
      value: (impact + userValue) / 2,
      effort,
      quadrant: item.quadrant,
    };
  });

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Priority Matrix</h3>
        <div className="quadrant-legend">
          {Object.entries(QUADRANT_COLORS).map(([q, c]) => (
            <span key={q} className="legend-dot-label">
              <span className="legend-dot" style={{ background: c }} />
              {q}
            </span>
          ))}
        </div>
      </div>

      <div className="matrix-labels">
        <span className="matrix-label matrix-label--tl">Quick wins</span>
        <span className="matrix-label matrix-label--tr">Strategic bets</span>
        <span className="matrix-label matrix-label--bl">Nice-to-haves</span>
        <span className="matrix-label matrix-label--br">Avoid</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="effort"
            type="number"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: 'Effort →', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#94a3b8' }}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <YAxis
            dataKey="value"
            type="number"
            domain={[0.5, 5.5]}
            ticks={[1, 2, 3, 4, 5]}
            label={{ value: '← Value', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12, fill: '#94a3b8' }}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
          />
          <ReferenceLine x={3} stroke="#cbd5e1" strokeDasharray="4 4" />
          <ReferenceLine y={3} stroke="#cbd5e1" strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
