const DECISION_STYLES = {
  'Build now': { bg: '#d1fae5', color: '#065f46' },
  'Validate first': { bg: '#fef3c7', color: '#92400e' },
  'Consider': { bg: '#ede9fe', color: '#4c1d95' },
  'Park it': { bg: '#f1f5f9', color: '#475569' },
};

const QUADRANT_STYLES = {
  'Quick win': { bg: '#d1fae5', color: '#065f46' },
  'Strategic bet': { bg: '#e0e7ff', color: '#3730a3' },
  'Nice-to-have': { bg: '#fef3c7', color: '#92400e' },
  'Avoid': { bg: '#fee2e2', color: '#991b1b' },
};

const TYPE_STYLES = {
  'Feature': { bg: '#eff6ff', color: '#1d4ed8' },
  'Fix': { bg: '#fef2f2', color: '#b91c1c' },
  'Experiment': { bg: '#f0fdf4', color: '#15803d' },
};

export function DecisionBadge({ decision }) {
  const s = DECISION_STYLES[decision] ?? { bg: '#f1f5f9', color: '#475569' };
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{decision}</span>;
}

export function QuadrantBadge({ quadrant }) {
  const s = QUADRANT_STYLES[quadrant] ?? { bg: '#f1f5f9', color: '#475569' };
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{quadrant}</span>;
}

export function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] ?? { bg: '#f1f5f9', color: '#475569' };
  return <span className="badge" style={{ background: s.bg, color: s.color }}>{type}</span>;
}
