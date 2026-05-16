import { useState, Fragment } from 'react';
import { DecisionBadge, QuadrantBadge, TypeBadge } from './Badges';

function ScoreCell({ value }) {
  return <span className="score-cell">{value}</span>;
}

export default function ItemTable({ items, metrics, onEdit, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const sorted = [...items].sort((a, b) => b.priorityScore - a.priorityScore);

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div className="chart-card table-card">
      <div className="chart-card__header">
        <h3>All items</h3>
        <span className="item-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="table-wrapper">
        <table className="priority-table">
          <thead>
            <tr>
              <th>Feature / Fix</th>
              <th>Type</th>
              {metrics.map(m => <th key={m.id}>{m.name}</th>)}
              <th>Score</th>
              <th>Decision</th>
              <th>Quadrant</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => (
              <Fragment key={item.id}>
                <tr className="table-row" onClick={() => toggleExpand(item.id)} style={{ cursor: 'pointer' }}>
                  <td className="table-title">
                    <span className="expand-arrow">{expandedId === item.id ? '▾' : '▸'}</span>
                    {item.title}
                  </td>
                  <td><TypeBadge type={item.type} /></td>
                  {metrics.map(m => (
                    <td key={m.id}><ScoreCell value={item.scores[m.id] ?? 3} /></td>
                  ))}
                  <td>
                    <span className="priority-score" style={{ color: scoreColor(item.priorityScore) }}>
                      {item.priorityScore}
                    </span>
                  </td>
                  <td><DecisionBadge decision={item.decision} /></td>
                  <td><QuadrantBadge quadrant={item.quadrant} /></td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="action-btns">
                      <button className="icon-btn icon-btn--edit" onClick={() => onEdit(item)} title="Edit">✎</button>
                      <button className="icon-btn icon-btn--danger" onClick={() => onDelete(item.id)} title="Delete">✕</button>
                    </div>
                  </td>
                </tr>
                {expandedId === item.id && (
                  <tr className="expanded-row">
                    <td colSpan={5 + metrics.length}>
                      <div className="explanation">
                        <span className="explanation-icon">💡</span>
                        {item.explanation}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function scoreColor(score) {
  if (score >= 7) return '#059669';
  if (score >= 4.5) return '#6366f1';
  if (score >= 3) return '#d97706';
  return '#ef4444';
}
