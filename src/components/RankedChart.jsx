import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function scoreColor(score) {
  if (score >= 7) return '#10b981';
  if (score >= 4.5) return '#6366f1';
  if (score >= 3) return '#f59e0b';
  return '#ef4444';
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-title">{d.title}</p>
      <p>Score: <strong>{d.score}</strong></p>
      <p>{d.decision}</p>
    </div>
  );
}

export default function RankedChart({ items }) {
  const sorted = [...items].sort((a, b) => b.priorityScore - a.priorityScore);
  const data = sorted.map(item => ({
    title: item.title.length > 22 ? item.title.slice(0, 20) + '…' : item.title,
    fullTitle: item.title,
    score: item.priorityScore,
    decision: item.decision,
  }));

  return (
    <div className="chart-card">
      <div className="chart-card__header">
        <h3>Ranked by Priority Score</h3>
      </div>
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 40 + 40)}>
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 40, left: 10, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
          <XAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis dataKey="title" type="category" width={140} tick={{ fontSize: 12, fill: '#374151' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={scoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
