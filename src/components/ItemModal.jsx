import { useState, useEffect } from 'react';
import ScorePills from './ScorePills';

const TYPES = ['Feature', 'Fix', 'Experiment'];

export default function ItemModal({ metrics, onSave, onClose, initial }) {
  const defaultScores = Object.fromEntries(metrics.map(m => [m.id, 3]));

  const [title, setTitle] = useState(initial?.title ?? '');
  const [type, setType] = useState(initial?.type ?? 'Feature');
  const [scores, setScores] = useState(initial?.scores ?? defaultScores);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), type, scores });
  }

  function setScore(id, val) {
    setScores(s => ({ ...s, [id]: val }));
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{initial ? 'Edit item' : 'Add feature / fix'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="field">
            <label>Title</label>
            <input
              autoFocus
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Add search bar"
              required
            />
          </div>

          <div className="field">
            <label>Type</label>
            <div className="type-selector">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`type-btn${type === t ? ' type-btn--active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="metrics-section">
            {metrics.map(metric => (
              <div key={metric.id} className="field">
                <label>
                  {metric.name}
                  <span className="metric-direction">
                    {metric.direction === 'lower' ? '↓ lower is better' : '↑ higher is better'}
                  </span>
                </label>
                <p className="helper-text">{metric.helper}</p>
                <ScorePills
                  value={scores[metric.id] ?? 3}
                  onChange={val => setScore(metric.id, val)}
                />
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">
              {initial ? 'Save changes' : 'Add to board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
