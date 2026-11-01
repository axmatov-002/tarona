import React, { useState } from 'react';
import { playMinecraftClick } from '../../utils/sfx';

import AdminDashboard from './AdminDashboard';
import AdminTracks from './AdminTracks';
import AdminStorage from './AdminStorage';
import AdminSettings from './AdminSettings';
import TrackEditModal from './TrackEditModal';

export default function AdminPanel({
  tracks,
  storageMB,
  currentTrack,
  isPlaying,
  adminTab,
  setAdminTab,
  onExitAdmin,
  onPlayTrackById,
  onUpdateTrack,
  onDeleteTrack,
  onToggleFavorite,
  onDownloadTrack,
  onBatchDelete,
  onBatchFavorite,
  onBatchDownload,
  onUploadClick,
  onGenerateSample,
  onExportBackup,
  onImportBackup,
  onClearAll,
  activityLogs,
  onClearLogs,
  showToast
}) {
  const [editingTrack, setEditingTrack] = useState(null);

  const handleOpenEdit = (track) => {
    setEditingTrack(track);
  };

  const handleSaveEdit = async (trackId, updates) => {
    await onUpdateTrack(trackId, updates);
    setEditingTrack(null);
  };

  return (
    <div className="admin-panel-container">
      {/* Admin Top Bar */}
      <header className="admin-header-nav">
        <div className="admin-title-area">
          <div className="command-block-icon" title="Command Block">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="12" y1="3" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="21"></line>
              <line x1="3" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="21" y2="12"></line>
            </svg>
          </div>
          <div className="admin-heading-wrap">
            <div className="admin-header-tag">
              <span className="live-dot"></span>
              <span>ADMINISTRATOR OPERATOR</span>
            </div>
            <h1>BOSHQARUV MARKAZI</h1>
          </div>
        </div>

        {/* Tab Switchers */}
        <nav className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${adminTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              setAdminTab('dashboard');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>DASHBOARD</span>
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'tracks' ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              setAdminTab('tracks');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>DISKLAR BAZASI</span>
            <span className="admin-tab-badge">{tracks.length}</span>
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'storage' ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              setAdminTab('storage');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span>ENDER XOTIRA</span>
          </button>

          <button
            className={`admin-tab-btn ${adminTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              setAdminTab('settings');
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>SOZLAMALAR</span>
          </button>
        </nav>

        {/* Exit Admin Button */}
        <button
          className="btn btn-secondary btn-exit-admin"
          onClick={() => {
            playMinecraftClick();
            onExitAdmin();
          }}
          title="Foydalanuvchi pleyeriga qaytish"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>PLEYERGA QAYTISH</span>
        </button>
      </header>

      {/* Main Tab Content */}
      <div className="admin-tab-content">
        {adminTab === 'dashboard' && (
          <AdminDashboard
            tracks={tracks}
            storageMB={storageMB}
            onUploadClick={onUploadClick}
            onGenerateSample={onGenerateSample}
            onExportBackup={onExportBackup}
            onImportBackup={onImportBackup}
            onClearAll={onClearAll}
            onSwitchTab={setAdminTab}
            activityLogs={activityLogs}
            onClearLogs={onClearLogs}
          />
        )}

        {adminTab === 'tracks' && (
          <AdminTracks
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrackById={onPlayTrackById}
            onEditTrack={handleOpenEdit}
            onDeleteTrack={onDeleteTrack}
            onToggleFavorite={onToggleFavorite}
            onDownloadTrack={onDownloadTrack}
            onBatchDelete={onBatchDelete}
            onBatchFavorite={onBatchFavorite}
            onBatchDownload={onBatchDownload}
            onUploadClick={onUploadClick}
          />
        )}

        {adminTab === 'storage' && (
          <AdminStorage
            tracks={tracks}
            storageMB={storageMB}
            onExportBackup={onExportBackup}
            onImportBackup={onImportBackup}
            onClearAll={onClearAll}
            showToast={showToast}
          />
        )}

        {adminTab === 'settings' && (
          <AdminSettings showToast={showToast} />
        )}
      </div>

      {/* Edit Track Modal */}
      <TrackEditModal
        isOpen={!!editingTrack}
        track={editingTrack}
        onSave={handleSaveEdit}
        onClose={() => setEditingTrack(null)}
      />
    </div>
  );
}
