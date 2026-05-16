export function computePriorityScore(scores, metrics) {
  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
  if (totalWeight === 0) return 0;

  let weightedSum = 0;
  for (const metric of metrics) {
    const raw = scores[metric.id] ?? 3;
    const normalized = metric.direction === 'lower' ? 6 - raw : raw;
    weightedSum += normalized * metric.weight;
  }

  const score = (weightedSum / totalWeight) * 2;
  return Math.round(score * 10) / 10;
}

export function computeDecision(item, metrics) {
  const score = item.priorityScore;
  const confidenceMetric = metrics.find(m => m.id === 'confidence');
  const confidence = confidenceMetric ? (item.scores[confidenceMetric.id] ?? 3) : 3;

  if (confidence <= 2 && score >= 5) return 'Validate first';
  if (score >= 7) return 'Build now';
  if (score >= 4.5) return 'Consider';
  return 'Park it';
}

export function computeQuadrant(item, metrics) {
  const impactMetric = metrics.find(m => m.id === 'impact');
  const userValueMetric = metrics.find(m => m.id === 'userValue');
  const effortMetric = metrics.find(m => m.id === 'effort');

  const impact = impactMetric ? (item.scores[impactMetric.id] ?? 3) : 3;
  const userValue = userValueMetric ? (item.scores[userValueMetric.id] ?? 3) : 3;
  const effort = effortMetric ? (item.scores[effortMetric.id] ?? 3) : 3;

  const value = (impact + userValue) / 2;

  if (value >= 4 && effort <= 2) return 'Quick win';
  if (value >= 4 && effort >= 4) return 'Strategic bet';
  if (value < 4 && effort <= 2) return 'Nice-to-have';
  return 'Avoid';
}

export function generateExplanation(item, metrics) {
  const score = item.priorityScore;
  const decision = item.decision;
  const quadrant = item.quadrant;

  const effortMetric = metrics.find(m => m.id === 'effort');
  const effort = effortMetric ? (item.scores[effortMetric.id] ?? 3) : 3;
  const confidenceMetric = metrics.find(m => m.id === 'confidence');
  const confidence = confidenceMetric ? (item.scores[confidenceMetric.id] ?? 3) : 3;

  if (quadrant === 'Quick win') {
    return 'This is a quick win: high value, strong impact, and relatively low effort. Move it up the queue.';
  }
  if (decision === 'Validate first') {
    return 'Promising idea, but confidence is low. Run a quick experiment or gather user data before committing.';
  }
  if (decision === 'Build now' && quadrant === 'Strategic bet') {
    return 'Strong candidate for the roadmap. High value, but expect significant effort — plan accordingly.';
  }
  if (decision === 'Build now') {
    return 'Top priority. High value, manageable effort, and solid confidence. Get this on the next sprint.';
  }
  if (decision === 'Consider' && effort >= 4) {
    return 'Worth considering, but heavy effort may limit throughput. Break it down or validate scope first.';
  }
  if (decision === 'Consider') {
    return 'Decent score but not urgent. Keep it visible and revisit when the roadmap has space.';
  }
  if (quadrant === 'Avoid') {
    return 'High effort with limited value. Probably not worth prioritizing — unless assumptions change.';
  }
  return 'Low score across key metrics. Park it for now and revisit if priorities shift.';
}

export function enrichItem(item, metrics) {
  const priorityScore = computePriorityScore(item.scores, metrics);
  const withScore = { ...item, priorityScore };
  const decision = computeDecision(withScore, metrics);
  const quadrant = computeQuadrant(withScore, metrics);
  const explanation = generateExplanation({ ...withScore, decision, quadrant }, metrics);
  return { ...withScore, decision, quadrant, explanation };
}

export const DEFAULT_METRICS = [
  { id: 'impact', name: 'Impact', weight: 35, direction: 'higher', helper: 'How much will this move product or business goals?' },
  { id: 'effort', name: 'Effort', weight: 25, direction: 'lower', helper: 'How expensive or complex is this to build?' },
  { id: 'userValue', name: 'User Value', weight: 25, direction: 'higher', helper: 'How useful or pain-relieving is this for users?' },
  { id: 'confidence', name: 'Confidence', weight: 15, direction: 'higher', helper: 'How sure are we about this?' },
];

export const DEMO_ITEMS = [
  { title: 'Add search bar', type: 'Feature', scores: { impact: 4, effort: 2, userValue: 5, confidence: 4 } },
  { title: 'Improve onboarding', type: 'Feature', scores: { impact: 5, effort: 3, userValue: 5, confidence: 3 } },
  { title: 'Fix checkout bug', type: 'Fix', scores: { impact: 5, effort: 1, userValue: 5, confidence: 5 } },
  { title: 'Add second commercial roll', type: 'Experiment', scores: { impact: 3, effort: 4, userValue: 2, confidence: 2 } },
  { title: 'Redesign settings page', type: 'Feature', scores: { impact: 2, effort: 4, userValue: 3, confidence: 4 } },
  { title: 'Add dark mode', type: 'Feature', scores: { impact: 3, effort: 3, userValue: 4, confidence: 5 } },
];
