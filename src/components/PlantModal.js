import React, { useState } from 'react';

export default function PlantModal({ plant, onSave, onClose }) {
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState(plant?.name ?? '');
  const [frequency, setFrequency] = useState(plant?.frequency ?? 7);
  const [lastWatered, setLastWatered] = useState(plant?.lastWatered ?? today);
  const [nameError, setNameError] = useState('');

  function handleFreqChange(delta) {
    setFrequency(prev => Math.min(28, Math.max(1, prev + delta)));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Plant name is required.');
      return;
    }
    onSave({ name: name.trim(), frequency, lastWatered });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{plant ? 'Edit Plant' : 'Add Plant'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="plant-name">Plant Name</label>
            <input
              id="plant-name"
              type="text"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              placeholder="e.g. Monstera"
              autoFocus
            />
            {nameError && <span className="field-error">{nameError}</span>}
          </div>

          <div className="form-group">
            <label>Watering Frequency</label>
            <div className="freq-control">
              <button
                type="button"
                className="freq-btn"
                onClick={() => handleFreqChange(-1)}
                disabled={frequency <= 1}
                aria-label="Decrease frequency"
              >
                −
              </button>
              <span className="freq-value">
                {frequency} day{frequency !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                className="freq-btn"
                onClick={() => handleFreqChange(1)}
                disabled={frequency >= 28}
                aria-label="Increase frequency"
              >
                +
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="last-watered">Last Watered</label>
            <input
              id="last-watered"
              type="date"
              value={lastWatered}
              max={today}
              onChange={e => setLastWatered(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">
              {plant ? 'Save Changes' : 'Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
