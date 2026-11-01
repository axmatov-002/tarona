import React, { useState, useMemo } from 'react';
import { playMinecraftClick } from '../../utils/sfx';
import { formatBytes, formatTime, formatDate } from '../../utils/formatters';

const GENRE_FILTERS = [
  'all',
  'C418 / Noteblock',
  'Minecraft OST',
  'Chiptune (8-bit)',
  'Synthwave',
  'Lo-Fi',
  'Pop',
  'Rock / Metal',
  'Elektron / EDM',
  'Boshqa'
];

export default function AdminTracks({
  tracks,
  currentTrack,
  isPlaying,
  onPlayTrackById,
  onEditTrack,
  onDeleteTrack,
  onToggleFavorite,
  onDownloadTrack,
  onBatchDelete,
  onBatchFavorite,
  onBatchDownload,
  onUploadClick
}) {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [favFilter, setFavFilter] = useState('all'); // 'all' | 'favorites' | 'non-favorites'
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtered & Sorted Tracks
  const processedTracks = useMemo(() => {
    let result = [...tracks];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.artist && t.artist.toLowerCase().includes(q)) ||
          (t.genre && t.genre.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      result = result.filter((t) => (t.genre || 'Minecraft OST') === selectedGenre);
    }

    // Favorite filter
    if (favFilter === 'favorites') {
      result = result.filter((t) => t.isFavorite);
    } else if (favFilter === 'non-favorites') {
      result = result.filter((t) => !t.isFavorite);
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => b.addedAt - a.addedAt);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.addedAt - b.addedAt);
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'artist') {
      result.sort((a, b) => (a.artist || '').localeCompare(b.artist || ''));
    } else if (sortBy === 'duration') {
      result.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sortBy === 'size') {
      result.sort((a, b) => (b.size || 0) - (a.size || 0));
    }

    return result;
  }, [tracks, search, selectedGenre, favFilter, sortBy]);

  // Selection logic
  const isAllSelected =
    processedTracks.length > 0 &&
    processedTracks.every((t) => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    playMinecraftClick();
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedTracks.map((t) => t.id));
    }
  };

  const toggleSelectOne = (id) => {
    playMinecraftClick();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="admin-tracks-page">
      {/* Top Filter & Action Bar */}
      <div className="admin-tracks-controls-bar">
        <div className="admin-search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Disk nomi, ijrochi yoki janr bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mc-input admin-search-input"
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => {
                playMinecraftClick();
                setSearch('');
              }}
            >
              &times;
            </button>
          )}
        </div>

        <div className="admin-filter-selectors">
          {/* Genre select */}
          <div className="admin-select-wrap">
            <label htmlFor="admin-genre-select">JANR:</label>
            <select
              id="admin-genre-select"
              value={selectedGenre}
              onChange={(e) => {
                playMinecraftClick();
                setSelectedGenre(e.target.value);
              }}
              className="mc-select"
            >
              <option value="all">Barcha janrlar</option>
              {GENRE_FILTERS.filter((g) => g !== 'all').map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Fav filter */}
          <div className="admin-select-wrap">
            <label htmlFor="admin-fav-select">HOLAT:</label>
            <select
              id="admin-fav-select"
              value={favFilter}
              onChange={(e) => {
                playMinecraftClick();
                setFavFilter(e.target.value);
              }}
              className="mc-select"
            >
              <option value="all">Barchasi</option>
              <option value="favorites">Faqat sevimlilar</option>
              <option value="non-favorites">Oddiy disklar</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="admin-select-wrap">
            <label htmlFor="admin-sort-select">SARALASH:</label>
            <select
              id="admin-sort-select"
              value={sortBy}
              onChange={(e) => {
                playMinecraftClick();
                setSortBy(e.target.value);
              }}
              className="mc-select"
            >
              <option value="newest">Yangi qo'shilganlar</option>
              <option value="oldest">Avvalgi disklar</option>
              <option value="title">Nomi (A-Z)</option>
              <option value="artist">Ijrochi (A-Z)</option>
              <option value="duration">Davomiyligi bo'yicha</option>
              <option value="size">Fayl hajmi bo'yicha</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              playMinecraftClick();
              onUploadClick();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>QO'SHISH</span>
          </button>
        </div>
      </div>

      {/* Batch Operations Bar (active when >= 1 item selected) */}
      {selectedIds.length > 0 && (
        <div className="admin-batch-bar">
          <div className="batch-selection-info">
            <span className="batch-badge">{selectedIds.length} TA TANLANDI</span>
            <span>Kutubxonadagi {tracks.length} ta diskdan</span>
          </div>

          <div className="batch-actions">
            <button
              className="btn btn-glass btn-small"
              onClick={() => {
                playMinecraftClick();
                onBatchFavorite(selectedIds);
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>SEVIMLI QILISH</span>
            </button>

            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                playMinecraftClick();
                onBatchDownload(selectedIds);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>YUKLAB OLISH</span>
            </button>

            <button
              className="btn btn-danger btn-small"
              onClick={() => {
                playMinecraftClick();
                onBatchDelete(selectedIds);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>O'CHIRISH (TNT)</span>
            </button>

            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                playMinecraftClick();
                setSelectedIds([]);
              }}
            >
              BEKOR QILISH
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Data Table */}
      <div className="table-container admin-table-container">
        <div className="admin-table-header">
          <div className="col-checkbox">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              title="Barchasini tanlash"
              className="mc-checkbox"
            />
          </div>
          <div className="col-index">#</div>
          <div className="col-info">DISK NOMI VA IJROCHI</div>
          <div className="col-genre">JANR / TEG</div>
          <div className="col-date">QO'SHILGAN</div>
          <div className="col-size">HAJMI</div>
          <div className="col-duration">DAVOMIYLIGI</div>
          <div className="col-fav">SEVIMLI</div>
          <div className="col-actions">AMALLAR</div>
        </div>

        <div className="admin-table-body">
          {processedTracks.length > 0 ? (
            processedTracks.map((track, index) => {
              const isCurrent = currentTrack && currentTrack.id === track.id;
              const isCurrentPlaying = isCurrent && isPlaying;
              const isSelected = selectedIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  className={`admin-table-row ${isCurrent ? 'active' : ''} ${
                    isSelected ? 'selected-row' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <div className="col-checkbox" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(track.id)}
                      className="mc-checkbox"
                    />
                  </div>

                  {/* Index / Play Button */}
                  <div className="col-index">
                    <button
                      className={`row-play-btn-admin ${isCurrentPlaying ? 'playing' : ''}`}
                      onClick={() => {
                        playMinecraftClick();
                        onPlayTrackById(track.id);
                      }}
                      title={isCurrentPlaying ? "To'xtatish" : 'Ijro etish'}
                    >
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
                    <span className="row-index-num">{index + 1}</span>
                  </div>

                  {/* Title & Artist */}
                  <div className="col-info">
                    <div className="admin-track-cover">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="9"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </div>
                    <div className="admin-track-text">
                      <strong className="track-title-text" title={track.title}>
                        {track.title}
                      </strong>
                      <span className="track-artist-text" title={track.artist}>
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  {/* Genre Tag */}
                  <div className="col-genre">
                    <span className="genre-pill">{track.genre || 'Minecraft OST'}</span>
                  </div>

                  {/* Date */}
                  <div className="col-date">{formatDate(track.addedAt)}</div>

                  {/* Size */}
                  <div className="col-size">{formatBytes(track.size)}</div>

                  {/* Duration */}
                  <div className="col-duration">{formatTime(track.duration || 0)}</div>

                  {/* Favorite Toggle */}
                  <div className="col-fav">
                    <button
                      className={`fav-star-btn ${track.isFavorite ? 'is-fav' : ''}`}
                      onClick={() => {
                        playMinecraftClick();
                        onToggleFavorite(track.id);
                      }}
                      title={track.isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                    >
                      <svg viewBox="0 0 24 24" fill={track.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-actions">
                    <button
                      className="btn-action-edit"
                      onClick={() => {
                        playMinecraftClick();
                        onEditTrack(track);
                      }}
                      title="Tahrirlash"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>

                    <button
                      className="btn-action-download"
                      onClick={() => {
                        playMinecraftClick();
                        onDownloadTrack(track);
                      }}
                      title="Yuklab olish"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>

                    <button
                      className="btn-action-delete"
                      onClick={() => {
                        playMinecraftClick();
                        onDeleteTrack(track);
                      }}
                      title="O'chirish"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="admin-table-empty">
              <p>Qidiruv bo'yicha hech qanday disk topilmadi.</p>
              {search && (
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => {
                    playMinecraftClick();
                    setSearch('');
                    setSelectedGenre('all');
                    setFavFilter('all');
                  }}
                >
                  Filtrlarni bekor qilish
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
