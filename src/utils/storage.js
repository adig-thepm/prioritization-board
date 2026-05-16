const ITEMS_KEY = 'pb_items';
const METRICS_KEY = 'pb_metrics';

export function loadItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function loadMetrics(defaults) {
  try {
    const raw = localStorage.getItem(METRICS_KEY);
    return raw ? JSON.parse(raw) : defaults;
  } catch {
    return defaults;
  }
}

export function saveMetrics(metrics) {
  localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
}
