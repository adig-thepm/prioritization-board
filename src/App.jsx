import { useState, useEffect } from 'react';
import { enrichItem, DEFAULT_METRICS, DEMO_ITEMS } from './utils/scoring';
import { loadItems, saveItems, loadMetrics, saveMetrics } from './utils/storage';
import { nanoid } from './utils/nanoid';
import EmptyState from './components/EmptyState';
import ItemModal from './components/ItemModal';
import MetricsModal from './components/MetricsModal';
import SummaryCards from './components/SummaryCards';
import PriorityMatrix from './components/PriorityMatrix';
import RankedChart from './components/RankedChart';
import ItemTable from './components/ItemTable';
import './App.css';

export default function App() {
  const [metrics, setMetrics] = useState(() => loadMetrics(DEFAULT_METRICS));
  const [rawItems, setRawItems] = useState(() => loadItems());
  const [showItemModal, setShowItemModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sampleInitial, setSampleInitial] = useState(null);

  const items = rawItems.map(item => enrichItem(item, metrics));

  useEffect(() => { saveItems(rawItems); }, [rawItems]);
  useEffect(() => { saveMetrics(metrics); }, [metrics]);

  function openAdd(initial) {
    setSampleInitial(initial ?? null);
    setEditingItem(null);
    setShowItemModal(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setSampleInitial(null);
    setShowItemModal(true);
  }

  function handleSave({ title, type, scores }) {
    if (editingItem) {
      setRawItems(prev => prev.map(i =>
        i.id === editingItem.id ? { ...i, title, type, scores } : i
      ));
    } else {
      setRawItems(prev => [...prev, { id: nanoid(), title, type, scores }]);
    }
    setShowItemModal(false);
    setEditingItem(null);
    setSampleInitial(null);
  }

  function handleDelete(id) {
    setRawItems(prev => prev.filter(i => i.id !== id));
  }

  function handleLoadDemo() {
    const demoWithIds = DEMO_ITEMS.map(item => ({ id: nanoid(), ...item }));
    setRawItems(demoWithIds);
  }

  function handleSaveMetrics(newMetrics) {
    setMetrics(newMetrics);
    setShowMetricsModal(false);
  }

  const hasItems = rawItems.length > 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <div>
              <h1 className="app-name">Priority Board</h1>
              <p className="app-subtitle">Score features. See tradeoffs. Decide faster.</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn btn--ghost btn--sm" onClick={() => setShowMetricsModal(true)}>
            ⚙ Customize framework
          </button>
          <button className="btn btn--primary" onClick={() => openAdd()}>
            + Add feature / fix
          </button>
        </div>
      </header>

      <main className="main">
        {!hasItems ? (
          <EmptyState
            onAdd={() => openAdd()}
            onAddSample={(s) => openAdd(s)}
            onLoadDemo={handleLoadDemo}
          />
        ) : (
          <div className="dashboard">
            <SummaryCards items={items} />
            <div className="charts-grid">
              <PriorityMatrix items={items} metrics={metrics} />
              <RankedChart items={items} />
            </div>
            <ItemTable
              items={items}
              metrics={metrics}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      {showItemModal && (
        <ItemModal
          metrics={metrics}
          onSave={handleSave}
          onClose={() => { setShowItemModal(false); setEditingItem(null); setSampleInitial(null); }}
          initial={editingItem ?? sampleInitial}
        />
      )}

      {showMetricsModal && (
        <MetricsModal
          metrics={metrics}
          onSave={handleSaveMetrics}
          onClose={() => setShowMetricsModal(false)}
        />
      )}
    </div>
  );
}
