import React from 'react';
import { formatTime, formatBytes, formatDate } from '../utils/formatters';
import { playMinecraftClick } from '../utils/sfx';

export default function TrackList({
  tracks,
  currentTrack,
  isPlaying,
  sortBy,
  setSortBy,
  sectionTitle,
  onPlayTrack,
  onToggleFavorite,
  onDownloadTrack,
  onDeleteTrack,
  onClearAll
}) {
  return (
    <section className="tracks-section">
      <div className="tracks-header">
        <div className="tracks-header-title">
          <h2>{sectionTitle}</h2>
          <span className="tracks-count">{tracks.length} TA DISK</span>
        </div>

        <div className="tracks-controls">
          <div className="sort-selector">
            <label htmlFor="sort-select">SARALASH:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => {
                playMinecraftClick();
                setSortBy(e.target.value);
              }}
            >
              <option value="newest">Yangi disklar</option>
              <option value="oldest">Avvalgi disklar</option>
              <option value="title">Nomi (A-Z)</option>
              <option value="duration">Davomiyligi</option>
            </select>
          </div>

          {tracks.length > 0 && (
            <button
              className="btn-icon-danger"
              onClick={() => {
                playMinecraftClick();
                onClearAll();
              }}
              title="Barcha disklarni o'chirish (TNT)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <div className="track-list-header">
          <div className="col-index">#</div>
          <div className="col-title">DISK NOMI</div>
          <div className="col-date">QO'SHILGAN</div>
          <div className="col-size">HAJMI</div>
          <div className="col-duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="col-actions">AMALLAR</div>
        </div>

        <div className="tracks-list">
          {tracks.map((track, index) => {
            const isCurrent = currentTrack && currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={track.id}
                className={`track-row ${isCurrent ? 'active' : ''}`}
                onClick={() => {
                  playMinecraftClick();
                  onPlayTrack(index);
                }}
              >
                <div className="col-index">
                  <span className="track-num">{index + 1}</span>
                  <button className="row-play-btn" aria-label="Ijro">
                    {isCurrentPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    )}
                  </button>
                </div>

                <div className="col-title">
                  <div className="track-cover-mini" title="Minecraft Music Disc">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="9"></circle>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <div className="track-info-wrap">
                    <span className="track-name" title={track.title}>
                      {track.title}
                    </span>
                    <span className="track-artist-sub" title={track.artist}>
                      {track.artist}
                    </span>
                  </div>
                </div>

                <div className="col-date">{formatDate(track.addedAt)}</div>
                <div className="col-size">{formatBytes(track.size)}</div>
                <div className="col-duration">{formatTime(track.duration || 0)}</div>

                <div className="col-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`action-btn fav-btn ${track.isFavorite ? 'is-favorite' : ''}`}
                    title={track.isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                    onClick={() => {
                      playMinecraftClick();
                      onToggleFavorite(track.id);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill={track.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  <button
                    className="action-btn download-btn"
                    title="Inventarga yuklab olish"
                    onClick={() => {
                      playMinecraftClick();
                      onDownloadTrack(track);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>

                  <button
                    className="action-btn delete-btn"
                    title="O'chirish"
                    onClick={() => {
                      playMinecraftClick();
                      onDeleteTrack(track);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
