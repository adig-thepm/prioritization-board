import { useState } from 'react';
import { nanoid } from '../utils/nanoid';

export default function MetricsModal({ metrics, onSave, onClose }) {
  const [local, setLocal] = useState(metrics.map(m => ({ ...m })));
  const [error, setError] = useState('');

  function update(id, field, value) {
    setLocal(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  }

  function addMetric() {
    setLocal(prev => [...prev, {
      id: nanoid(),
      name: 'New metric',
      weight: 10,
      direction: 'higher',
      helper: '',
    }]);
  }

  function remove(id) {
    setLocal(prev => prev.filter(m => m.id !== id));
  }

  function handleSave() {
    const totalWeight = local.reduce((s, m) => s + Number(m.weight), 0);
    if (totalWeight === 0) { setError('Total weight must be greater than 0.'); return; }
    const invalid = local.find(m => !m.name.trim());
    if (invalid) { setError('All metrics must have a name.'); return; }
    onSave(local.map(m => ({ ...m, weight: Number(m.weight) })));
  }

  const totalWeight = local.reduce((s, m) => s + Number(m.weight || 0), 0);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal modal--wide">
        <div className="modal-header">
          <h2>Customize scoring framework</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="helper-text" style={{ marginBottom: 16 }}>
            Rename metrics, adjust weights, or flip direction. Weights don't need to sum to 100.
          </p>

          <div className="metrics-editor">
            {local.map((m, i) => (
              <div key={m.id} className="metric-row">
                <div className="metric-row-fields">
                  <input
                    className="input input--sm"
                    value={m.name}
                    onChange={e => update(m.id, 'name', e.target.value)}
                    placeholder="Metric name"
                  />
                  <input
                    className="input input--sm input--weight"
                    type="number"
                    min="0"
                    max="100"
                    value={m.weight}
                    onChange={e => update(m.id, 'weight', e.target.value)}
                  />
                  <select
                    className="select"
                    value={m.direction}
                    onChange={e => update(m.id, 'direction', e.target.value)}
                  >
                    <option value="higher">↑ Higher is better</option>
                    <option value="lower">↓ Lower is better</option>
                  </select>
                  <button className="icon-btn icon-btn--danger" onClick={() => remove(m.id)} disabled={local.length <= 1}>✕</button>
                </div>
                <input
                  className="input input--sm"
                  value={m.helper}
                  onChange={e => update(m.id, 'helper', e.target.value)}
                  placeholder="Helper text (optional)"
                  style={{ marginTop: 6 }}
                />
              </div>
            ))}
          </div>

          <button className="btn btn--ghost" style={{ marginTop: 12 }} onClick={addMetric}>
            + Add metric
          </button>

          <p className="weight-total" style={{ marginTop: 12 }}>
            Total weight: <strong>{totalWeight}</strong>
          </p>

          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>Save framework</button>
        </div>
      </div>
    </div>
  );
}
