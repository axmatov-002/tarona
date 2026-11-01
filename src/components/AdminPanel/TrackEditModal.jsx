import React, { useState, useEffect } from 'react';
import { playMinecraftClick } from '../../utils/sfx';
import { formatBytes, formatTime } from '../../utils/formatters';

const GENRE_OPTIONS = [
  'C418 / Noteblock',
  'Minecraft OST',
  'Chiptune (8-bit)',
  'Synthwave',
  'Lo-Fi',
  'Pop',
  'Rock / Metal',
  'Elektron / EDM',
  'Klassik / Instrumental',
  'Boshqa'
];

export default function TrackEditModal({ isOpen, track, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [newAudioFile, setNewAudioFile] = useState(null);

  useEffect(() => {
    if (track) {
      setTitle(track.title || '');
      setArtist(track.artist || '');
      setGenre(track.genre || 'Minecraft OST');
      setIsFavorite(!!track.isFavorite);
      setNewAudioFile(null);
    }
  }, [track]);

  if (!isOpen || !track) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    playMinecraftClick();

    const updates = {
      title: title.trim() || 'Nomsiz disk',
      artist: artist.trim() || "Noma'lum ijrochi",
      genre: genre || 'Minecraft OST',
      isFavorite
    };

    if (newAudioFile) {
      updates.blob = newAudioFile;
      updates.size = newAudioFile.size;
      updates.type = newAudioFile.type || 'audio/mp3';
    }

    onSave(track.id, updates);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      playMinecraftClick();
      setNewAudioFile(file);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box track-edit-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-pixel">
          <div className="modal-title-wrap">
            <div className="modal-icon-disc">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="9"></circle>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div>
              <h3>DISK MA'LUMOTLARINI TAHRIRLASH</h3>
              <p className="modal-subtitle">ID: {track.id}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Yopish">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="track-edit-form">
          <div className="form-group">
            <label htmlFor="edit-title">DISK NOMI (TITLE):</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Qo'shiq nomini kiriting..."
              className="mc-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-artist">IJROCHI (ARTIST):</label>
            <input
              id="edit-artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Ijrochi yoki musiqachi ismi..."
              className="mc-input"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="edit-genre">JANR / TOIFA:</label>
              <select
                id="edit-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="mc-select"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="mc-checkbox-label">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="mc-checkbox"
                />
                <span className="checkbox-custom"></span>
                <span>SEVIMLI DISK</span>
              </label>
            </div>
          </div>

          {/* Current File Info */}
          <div className="track-meta-preview">
            <div className="meta-item">
              <span className="meta-key">HAJMI:</span>
              <span className="meta-val">
                {newAudioFile ? `${formatBytes(newAudioFile.size)} (Yangi fayl)` : formatBytes(track.size)}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-key">DAVOMIYLIGI:</span>
              <span className="meta-val">{formatTime(track.duration || 0)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-key">FORMAT:</span>
              <span className="meta-val">{track.type || 'audio/mp3'}</span>
            </div>
          </div>

          {/* Audio file replace */}
          <div className="form-group">
            <label>AUDIO FAYLNI ALMASHTIRISH (IXTIYORIY):</label>
            <div className="file-replace-wrap">
              <input
                type="file"
                id="audio-replace-input"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={handleAudioChange}
              />
              <label htmlFor="audio-replace-input" className="btn btn-secondary btn-file-picker">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>{newAudioFile ? newAudioFile.name : 'YANGI AUDIO TANLASH'}</span>
              </label>
              {newAudioFile && (
                <button
                  type="button"
                  className="btn btn-icon-danger"
                  onClick={() => setNewAudioFile(null)}
                  title="Tanlovni bekor qilish"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                playMinecraftClick();
                onClose();
              }}
            >
              BEKOR QILISH
            </button>
            <button type="submit" className="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>SAQLASH</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
