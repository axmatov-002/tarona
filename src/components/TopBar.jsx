import React from 'react';
import { playMinecraftClick, playMinecraftItemPop } from '../utils/sfx';

export default function TopBar({
  searchQuery,
  setSearchQuery,
  onGenerateSample,
  onUploadClick,
  fileInputRef,
  onFilesSelected,
  isAdminMode,
  onOpenAdmin,
  onExitAdmin
}) {
  return (
    <header className="top-bar">
      <div className="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Disk nomi yoki musiqachi bo'yicha qidiruv..."
        />
        {searchQuery && (
          <button
            className="search-clear"
            onClick={() => {
              playMinecraftClick();
              setSearchQuery('');
            }}
            aria-label="Tozalash"
          >
            &times;
          </button>
        )}
      </div>

      <div className="top-bar-actions">
        {/* Admin Mode Switcher Button */}
        {isAdminMode ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              playMinecraftClick();
              onExitAdmin();
            }}
            title="Pleyerga qaytish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
            </svg>
            <span>PLEYERGA QAYTISH</span>
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-admin-top"
            onClick={() => {
              playMinecraftClick();
              onOpenAdmin('dashboard');
            }}
            title="Admin boshqaruv panelini ochish"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="12" y1="3" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="21"></line>
            </svg>
            <span>ADMIN PANEL</span>
          </button>
        )}

        <button
          className="btn btn-glass"
          onClick={() => {
            playMinecraftItemPop();
            onGenerateSample();
          }}
          title="Minecraft C418 Noteblock Ohangi"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="btn-label-desktop">NOTEBLOCK OHANG</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={(e) => onFilesSelected(e.target.files)}
        />

        <button
          className="btn btn-gradient"
          onClick={() => {
            playMinecraftClick();
            onUploadClick();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>DISK QO'SHISH</span>
        </button>
      </div>
    </header>
  );
}
