export default function SummaryCards({ items }) {
  const total = items.length;
  const top = items.length ? [...items].sort((a, b) => b.priorityScore - a.priorityScore)[0] : null;
  const quickWins = items.filter(i => i.quadrant === 'Quick win').length;
  const needsValidation = items.filter(i => i.decision === 'Validate first').length;

  const cards = [
    { label: 'Total items', value: total, sub: 'on the board' },
    { label: 'Top priority', value: top?.title ?? '—', sub: top ? `Score ${top.priorityScore}` : 'No items yet', highlight: true },
    { label: 'Quick wins', value: quickWins, sub: 'high value, low effort' },
    { label: 'Needs validation', value: needsValidation, sub: 'low confidence' },
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.label} className={`summary-card${card.highlight ? ' summary-card--highlight' : ''}`}>
          <p className="summary-card__label">{card.label}</p>
          <p className="summary-card__value">{card.value}</p>
          <p className="summary-card__sub">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
