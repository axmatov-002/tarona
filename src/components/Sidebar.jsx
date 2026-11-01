import React from 'react';
import { playMinecraftClick } from '../utils/sfx';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isAdminMode,
  adminTab,
  onOpenAdmin,
  onExitAdmin,
  totalCount,
  favCount,
  storageMB,
  onUploadClick
}) {
  const percentage = Math.min(100, Math.max(3, (storageMB / 500) * 100));

  const handleTab = (tab) => {
    playMinecraftClick();
    if (isAdminMode) {
      onExitAdmin();
    }
    setActiveTab(tab);
  };

  const handleAdminSubTab = (tab) => {
    playMinecraftClick();
    onOpenAdmin(tab);
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo">
          <div className="logo-icon" title="Minecraft Jukebox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="12" y1="12" x2="12.01"></line>
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
          className={`nav-item ${!isAdminMode && activeTab === 'all' ? 'active' : ''}`}
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
          className={`nav-item ${!isAdminMode && activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => handleTab('favorites')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span>SEVIMLI DISKLAR</span>
          <span className="badge">{favCount}</span>
        </button>

        <button
          className={`nav-item ${!isAdminMode && activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => handleTab('recent')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>YAQINDA QO'SHILGAN</span>
        </button>

        {/* Administration Section */}
        <p className="nav-label nav-label-admin">
          <span>BOSHQARUV</span>
          <span className="admin-status-pill">OP</span>
        </p>

        <button
          className={`nav-item nav-item-admin ${isAdminMode && adminTab === 'dashboard' ? 'active-admin' : ''}`}
          onClick={() => handleAdminSubTab('dashboard')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            <circle cx="12" cy="12" r="3"></circle>
            <line x1="12" y1="3" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="21"></line>
          </svg>
          <span>ADMIN DASHBOARD</span>
        </button>

        <button
          className={`nav-item nav-item-admin ${isAdminMode && adminTab === 'tracks' ? 'active-admin' : ''}`}
          onClick={() => handleAdminSubTab('tracks')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="9"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>DISKLAR BAZASI</span>
          <span className="badge badge-admin">{totalCount}</span>
        </button>

        <button
          className={`nav-item nav-item-admin ${isAdminMode && adminTab === 'storage' ? 'active-admin' : ''}`}
          onClick={() => handleAdminSubTab('storage')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span>ENDER XOTIRA</span>
        </button>

        <button
          className={`nav-item nav-item-admin ${isAdminMode && adminTab === 'settings' ? 'active-admin' : ''}`}
          onClick={() => handleAdminSubTab('settings')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>SOZLAMALAR</span>
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
