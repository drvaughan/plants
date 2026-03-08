import React, { useRef } from 'react';

const MAX_PX = 400; // longest side cap before storing

function processImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      const scale = Math.min(1, MAX_PX / Math.max(w, h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function PlantIcon({ overdue }) {
  const color = overdue ? '#8B4513' : '#2e7d32';
  return (
    <svg
      viewBox="0 0 64 80"
      width="56"
      height="70"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={overdue ? 'Plant needs water' : 'Plant is healthy'}
    >
      {/* Pot */}
      <path d="M18 52 L22 68 L42 68 L46 52 Z" fill="#c1440e" />
      <rect x="16" y="48" width="32" height="6" rx="2" fill="#a33a0c" />
      {/* Soil */}
      <ellipse cx="32" cy="50" rx="14" ry="4" fill="#5d3a1a" />
      {/* Stem */}
      <line x1="32" y1="50" x2="32" y2="28" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf */}
      <path
        d="M32 38 Q20 28 18 18 Q26 22 32 30"
        fill={color}
        opacity="0.9"
      />
      {/* Right leaf */}
      <path
        d="M32 34 Q44 24 46 14 Q38 18 32 26"
        fill={color}
        opacity="0.9"
      />
      {/* Top leaf */}
      <path
        d="M32 28 Q28 16 32 8 Q36 16 32 28"
        fill={color}
      />
    </svg>
  );
}

function RaindropButton({ onClick }) {
  return (
    <button className="water-btn" onClick={onClick} title="Water this plant">
      <svg
        viewBox="0 0 24 30"
        width="28"
        height="35"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Water plant"
      >
        <path
          d="M12 2 C12 2 3 13 3 18 C3 23.5 7 27 12 27 C17 27 21 23.5 21 18 C21 13 12 2 12 2 Z"
          fill="#1e88e5"
        />
        <ellipse cx="9" cy="16" rx="2" ry="3" fill="white" opacity="0.35" transform="rotate(-20 9 16)" />
      </svg>
    </button>
  );
}

export default function PlantCard({ plant, overdue, onWater, onEdit, onDelete, onPhotoUpdate }) {
  const { name, frequency, lastWatered, photo } = plant;
  const fileInputRef = useRef(null);

  const displayDate = lastWatered
    ? new Date(lastWatered + 'T00:00:00').toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Never';

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    try {
      const dataUrl = await processImage(file);
      onPhotoUpdate(dataUrl);
    } catch {
      // silently ignore processing errors
    }
  }

  return (
    <div className={`plant-card ${overdue ? 'overdue' : 'healthy'}`}>
      <div className="plant-card-top">
        <div className="plant-icon-wrap">
          {photo
            ? <img src={photo} alt={name} className="plant-photo" />
            : <PlantIcon overdue={overdue} />
          }
          <button
            className="photo-upload-btn"
            onClick={() => fileInputRef.current.click()}
            title="Upload plant photo"
            aria-label="Upload plant photo"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <RaindropButton onClick={onWater} />
      </div>

      <div className="plant-info">
        <h2 className="plant-name">{name}</h2>
        <div className="plant-detail">
          <span className="detail-label">Every</span>
          <span className="detail-value">{frequency} day{frequency !== 1 ? 's' : ''}</span>
        </div>
        <div className="plant-detail">
          <span className="detail-label">Last watered</span>
          <span className={`detail-value ${overdue ? 'overdue-text' : ''}`}>{displayDate}</span>
        </div>
        {overdue && (
          <div className="overdue-badge">Needs water!</div>
        )}
      </div>

      <div className="plant-actions">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
