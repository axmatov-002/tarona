import React, { useRef, useState } from 'react';
import { formatTime } from '../utils/formatters';
import { playMinecraftClick } from '../utils/sfx';

export default function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  bufferedPercent,
  volume,
  repeatMode,
  isShuffle,
  playbackRate,
  onTogglePlayPause,
  onNext,
  onPrev,
  onToggleShuffle,
  onToggleRepeat,
  onCycleSpeed,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFavorite
}) {
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(0);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const handleProgressMouseDown = (e) => {
    playMinecraftClick();
    handleSeek(e);

    const onMouseMove = (ev) => handleSeek(ev);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const targetTime = (clickX / rect.width) * duration;
    onSeek(targetTime);
  };

  const handleProgressMouseMove = (e) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverX(clickX);
    setHoverTime((clickX / rect.width) * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverTime(null);
  };

  const handleVolumeMouseDown = (e) => {
    handleVolChange(e);

    const onMouseMove = (ev) => handleVolChange(ev);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleVolChange = (e) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newVol = clickX / rect.width;
    onVolumeChange(newVol);
  };

  return (
    <footer className="player-bar">
      {/* Left Track Info */}
      <div className="player-track-info">
        <div className="track-art-wrap">
          <div className="track-art" title="Minecraft Jukebox Disc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className={`equalizer-bars-mini ${isPlaying ? 'playing' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="track-meta">
          <h4 className="track-title" title={currentTrack?.title || "Disk tanlanmagan"}>
            {currentTrack?.title || "Disk tanlanmagan"}
          </h4>
          <p className="track-artist" title={currentTrack?.artist || 'Diskni bosib tinglang'}>
            {currentTrack?.artist || 'Diskni bosib tinglang'}
          </p>
        </div>

        {currentTrack && (
          <button
            className={`btn-fav-player ${currentTrack.isFavorite ? 'is-favorite' : ''}`}
            title={currentTrack.isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
            onClick={() => {
              playMinecraftClick();
              onToggleFavorite(currentTrack.id);
            }}
            aria-label="Sevimlilar"
          >
            <svg viewBox="0 0 24 24" fill={currentTrack.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        )}
      </div>

      {/* Center Controls & Minecraft XP Bar */}
      <div className="player-center">
        <div className="player-controls">
          <button
            className={`ctrl-btn ${isShuffle ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              onToggleShuffle();
            }}
            title="Tasodifiy ijro (Shuffle)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
          </button>

          <button
            className="ctrl-btn"
            onClick={() => {
              playMinecraftClick();
              onPrev();
            }}
            title="Oldingi disk"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="19 20 9 12 19 4 19 20"></polygon>
              <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="3"></line>
            </svg>
          </button>

          <button
            className="ctrl-btn play-pause-btn"
            onClick={() => {
              playMinecraftClick();
              onTogglePlayPause();
            }}
            title={isPlaying ? 'Pauza' : 'Ijro'}
          >
            {isPlaying ? (
              <svg className="pause-icon" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          <button
            className="ctrl-btn"
            onClick={() => {
              playMinecraftClick();
              onNext();
            }}
            title="Keyingi disk"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 4 15 12 5 20 5 4"></polygon>
              <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3"></line>
            </svg>
          </button>

          <button
            className={`ctrl-btn ${repeatMode !== 'off' ? 'active' : ''}`}
            onClick={() => {
              playMinecraftClick();
              onToggleRepeat();
            }}
            title={`Qaytarish: ${repeatMode === 'one' ? 'Bitta disk' : repeatMode === 'all' ? 'Barcha disklar' : "O'chiq"}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </button>
        </div>

        {/* Minecraft Experience Progress Bar */}
        <div className="progress-bar-container">
          <span className="time-label">{formatTime(currentTime)}</span>
          <div
            className="progress-slider-wrap"
            ref={progressRef}
            onMouseDown={handleProgressMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
            title="Minecraft XP Bar"
          >
            {hoverTime !== null && (
              <div className="progress-tooltip" style={{ left: `${hoverX}px` }}>
                {formatTime(hoverTime)}
              </div>
            )}
            <div className="progress-buffered" style={{ width: `${bufferedPercent}%` }}></div>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            <div className="progress-thumb" style={{ left: `${progressPercent}%` }}></div>
          </div>
          <span className="time-label">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right Controls (Volume, Speed) */}
      <div className="player-right">
        <div className="speed-selector">
          <button
            className="btn-text-badge"
            onClick={() => {
              playMinecraftClick();
              onCycleSpeed();
            }}
            title="Ijro tezligi"
          >
            {playbackRate.toFixed(1)}x
          </button>
        </div>

        <div className="volume-container">
          <button
            className="ctrl-btn"
            onClick={() => {
              playMinecraftClick();
              onToggleMute();
            }}
            title="Ovoz (Redstone Power)"
          >
            {volume <= 0.01 ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>

          <div
            className="volume-slider-wrap"
            ref={volumeRef}
            onMouseDown={handleVolumeMouseDown}
          >
            <div className="volume-fill" style={{ width: `${volume * 100}%` }}></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
