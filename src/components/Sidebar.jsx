import React from 'react';
import { playMinecraftClick } from '../utils/sfx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalCount,
  favCount,
  storageMB,
  onUploadClick
}) {
  const percentage = Math.min(100, Math.max(3, (storageMB / 500) * 100));

  const handleTab = (tab) => {
    playMinecraftClick();
    setActiveTab(tab);
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon" title="Minecraft Jukebox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="12" y1="12" x2="12" y2="12.01"></line>
            </svg>
          </div>
          <span className="brand-name">
            JUKE<span>BOX</span>
            <span className="react-pill">MC</span>
          </span>
        </div>
      </div>

      <nav className="nav-menu">
        <p className="nav-label">INVENTAR</p>
        <button
          className={`nav-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleTab('all')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>BARCHA DISKLAR</span>
          <span className="badge">{totalCount}</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTab('favorites')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>SEVIMLI DISKLAR</span>
          <span className="badge">{favCount}</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTab('recent')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>YAQINDA OSHILGAN</span>
        </button>
      </nav>

      {/* Crafting / Upload station */}
      <div className="sidebar-upload-card">
        <div className="upload-card-content">
          <div className="upload-icon-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <h4>DISK YUKLASH</h4>
          <p>MP3, WAV, OGG fayllarni Jukeboxga solish</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              playMinecraftClick();
              onUploadClick();
            }}
          >
            <span>FAYL TANLASH</span>
          </button>
        </div>
      </div>

      {/* Ender Chest Storage */}
      <div className="storage-info">
        <div className="storage-label">
          <span>ENDER XOTIRA:</span>
          <span>{storageMB.toFixed(1)} MB</span>
        </div>
        <div className="storage-bar">
          <div className="storage-progress" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="storage-hint">Brauzeringizda doimiy saqlanadi</p>
      </div>
    </aside>
  );
}
