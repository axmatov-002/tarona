import React from 'react';
import { playMinecraftClick, playMinecraftItemPop } from '../utils/sfx';

export default function EmptyState({
  searchQuery,
  activeTab,
  onUploadClick,
  onGenerateSample
}) {
  let title = "Hali hech qanday disk qo'shilmadi";
  let desc = "O'zingiz yoqtirgan audio disklarni Jukeboxga soling va tinglang!";

  if (searchQuery) {
    title = "Qidiruv bo'yicha disk topilmadi";
    desc = `"${searchQuery}" so'ziga mos keluvchi musiqa diski mavjud emas.`;
  } else if (activeTab === 'favorites') {
    title = "Sevimli disklar ro'yxati bo'sh";
    desc = "Musiqalardagi yurakcha belgisini bosib, ularni sevimlilar safiga qo'shishingiz mumkin.";
  }

  return (
    <div className="empty-state">
      <div className="empty-icon-wrap" title="Bo'sh Jukebox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="9"></circle>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="empty-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            playMinecraftClick();
            onUploadClick();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>DISK YUKLASH</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            playMinecraftItemPop();
            onGenerateSample();
          }}
        >
          <span>NOTEBLOCK OHANG TINGLASH</span>
        </button>
      </div>
    </div>
  );
}
