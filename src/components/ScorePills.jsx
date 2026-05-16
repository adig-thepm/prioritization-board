export default function ScorePills({ value, onChange }) {
  return (
    <div className="score-pills">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`pill${value === n ? ' pill--active' : ''}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
