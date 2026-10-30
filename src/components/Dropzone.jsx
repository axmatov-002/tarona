import React, { useState } from 'react';
import { playMinecraftClick } from '../utils/sfx';

export default function Dropzone({ onFilesDrop, onUploadClick }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      onFilesDrop(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        playMinecraftClick();
        onUploadClick();
      }}
    >
      <div className="dropzone-border">
        <svg className="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="7" width="20" height="14" rx="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <div className="dropzone-text">
          <h3>Musiqa fayllarini Jukeboxga tashlang</h3>
          <p>
            yoki inventardan tanlash uchun <span className="highlight">fayl tanlang</span> (ko'p disklarni birdan yuklash mumkin)
          </p>
        </div>
      </div>
    </div>
  );
}
