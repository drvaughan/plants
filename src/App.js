import React, { useState, useEffect } from 'react';
import PlantCard from './components/PlantCard';
import PlantModal from './components/PlantModal';
import './App.css';

const STORAGE_KEY = 'house-plants';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function isOverdue(plant) {
  if (!plant.lastWatered) return true;
  const last = new Date(plant.lastWatered);
  last.setHours(0, 0, 0, 0);
  const due = new Date(last);
  due.setDate(due.getDate() + plant.frequency);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today > due;
}

export default function App() {
  const [plants, setPlants] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  }, [plants]);

  function handleSave(data) {
    if (editingPlant) {
      setPlants(prev =>
        prev.map(p => (p.id === editingPlant.id ? { ...p, ...data } : p))
      );
    } else {
      setPlants(prev => [...prev, { id: generateId(), ...data }]);
    }
    setModalOpen(false);
    setEditingPlant(null);
  }

  function handleEdit(plant) {
    setEditingPlant(plant);
    setModalOpen(true);
  }

  function handleDelete(id) {
    setPlants(prev => prev.filter(p => p.id !== id));
  }

  function handleWater(id) {
    const today = new Date().toISOString().split('T')[0];
    setPlants(prev =>
      prev.map(p => (p.id === id ? { ...p, lastWatered: today } : p))
    );
  }

  function handlePhotoUpdate(id, dataUrl) {
    setPlants(prev =>
      prev.map(p => (p.id === id ? { ...p, photo: dataUrl } : p))
    );
  }

  function handleAddNew() {
    setEditingPlant(null);
    setModalOpen(true);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="header-icon">🌿</span>
          <h1>Plant Tracker</h1>
        </div>
        <button className="add-btn" onClick={handleAddNew}>+ Add Plant</button>
      </header>

      <main className="plant-grid">
        {plants.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🪴</span>
            <p>No plants yet. Add your first plant!</p>
          </div>
        )}
        {plants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            overdue={isOverdue(plant)}
            onWater={() => handleWater(plant.id)}
            onEdit={() => handleEdit(plant)}
            onDelete={() => handleDelete(plant.id)}
            onPhotoUpdate={(dataUrl) => handlePhotoUpdate(plant.id, dataUrl)}
          />
        ))}
      </main>

      {modalOpen && (
        <PlantModal
          plant={editingPlant}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditingPlant(null);
          }}
        />
      )}
    </div>
  );
}
