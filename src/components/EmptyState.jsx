const SAMPLES = [
  { title: 'Add search bar', type: 'Feature' },
  { title: 'Improve onboarding', type: 'Feature' },
  { title: 'Fix checkout bug', type: 'Fix' },
];

export default function EmptyState({ onAdd, onAddSample, onLoadDemo }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📋</div>
      <h2 className="empty-headline">Turn messy feature ideas into clear product decisions.</h2>
      <p className="empty-sub">Add features, score them, and instantly see what deserves attention.</p>

      <button className="btn btn--primary btn--lg" onClick={onAdd}>
        + Add feature / fix
      </button>

      <div className="sample-section">
        <p className="sample-label">Or try a sample idea:</p>
        <div className="sample-pills">
          {SAMPLES.map(s => (
            <button
              key={s.title}
              className="sample-pill"
              onClick={() => onAddSample(s)}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <button className="btn btn--ghost btn--sm demo-btn" onClick={onLoadDemo}>
        Load demo board
      </button>
    </div>
  );
}
