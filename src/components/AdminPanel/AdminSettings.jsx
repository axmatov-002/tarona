import React, { useState } from 'react';
import { playMinecraftClick } from '../../utils/sfx';

export default function AdminSettings({ showToast }) {
  const [pinLockEnabled, setPinLockEnabled] = useState(() => {
    return localStorage.getItem('musiqa_admin_pin_required') !== 'false';
  });
  const [currentPin, setCurrentPin] = useState(() => {
    return localStorage.getItem('musiqa_admin_pin') || '1234';
  });
  const [newPin, setNewPin] = useState('');

  const [sfxEnabled, setSfxEnabled] = useState(() => {
    return localStorage.getItem('musiqa_sfx_enabled') !== 'false';
  });

  const [autoNext, setAutoNext] = useState(() => {
    return localStorage.getItem('musiqa_auto_next') !== 'false';
  });

  const handleTogglePinLock = (enabled) => {
    playMinecraftClick();
    setPinLockEnabled(enabled);
    localStorage.setItem('musiqa_admin_pin_required', enabled ? 'true' : 'false');
    showToast(
      enabled ? "Admin PIN kodi himoyasi yoqildi" : "Admin PIN kodi himoyasi o'chirildi",
      'info'
    );
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    playMinecraftClick();
    if (!newPin || newPin.length < 4) {
      showToast("PIN kod kamida 4 ta belgidan iborat bo'lishi kerak", 'error');
      return;
    }
    localStorage.setItem('musiqa_admin_pin', newPin.trim());
    setCurrentPin(newPin.trim());
    setNewPin('');
    showToast("Admin PIN kodi muvaffaqiyatli o'zgartirildi!", 'success');
  };

  const handleToggleSfx = (val) => {
    playMinecraftClick();
    setSfxEnabled(val);
    localStorage.setItem('musiqa_sfx_enabled', val ? 'true' : 'false');
    showToast(val ? "Minecraft ovoz effektlari yoqildi" : "Minecraft ovozlari o'chirildi", 'info');
  };

  const handleToggleAutoNext = (val) => {
    playMinecraftClick();
    setAutoNext(val);
    localStorage.setItem('musiqa_auto_next', val ? 'true' : 'false');
    showToast(
      val ? "Navbatdagi musiqaga avtomatik o'tish yoqildi" : "Avtomatik o'tish o'chirildi",
      'info'
    );
  };

  return (
    <div className="admin-settings-page">
      <div className="admin-banner-card settings-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <span className="live-dot"></span>
            <span>REDSTONE CONTROL PANEL</span>
          </div>
          <h2>TIZIM VA ADMIN SOZLAMALARI</h2>
          <p>
            Admin xavfsizligi, audio pleyer xususiyatlari va dastur diagnostikasini
            istalgan vaqtda sozlang.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-split">
        {/* Left: Security Settings */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <h3>ADMIN XAVFSIZLIGI (REDSTONE LOCK)</h3>
            </div>
          </div>

          <div className="settings-content-wrap">
            {/* PIN required toggle */}
            <div className="setting-row">
              <div className="setting-info">
                <strong>PIN kod bilan kirish:</strong>
                <span>Admin panelga kirishda xavfsizlik kodini so'rash</span>
              </div>
              <label className="mc-switch">
                <input
                  type="checkbox"
                  checked={pinLockEnabled}
                  onChange={(e) => handleTogglePinLock(e.target.checked)}
                />
                <span className="mc-slider"></span>
              </label>
            </div>

            {/* Change PIN Form */}
            <form onSubmit={handleChangePin} className="change-pin-form">
              <label htmlFor="new-pin-input">YANGI PIN KOD O'RNATISH:</label>
              <div className="pin-input-row">
                <input
                  id="new-pin-input"
                  type="password"
                  placeholder="Yangi PIN (kamida 4 ta belgi)..."
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="mc-input"
                  maxLength={10}
                />
                <button type="submit" className="btn btn-primary">
                  SAQLASH
                </button>
              </div>
              <span className="auth-hint">Hozirgi faol PIN: <strong>{currentPin}</strong></span>
            </form>
          </div>
        </div>

        {/* Right: Audio & General System Settings */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <h3>PLEYER VA OVOZ SOZLAMALARI</h3>
            </div>
          </div>

          <div className="settings-content-wrap">
            <div className="setting-row">
              <div className="setting-info">
                <strong>Minecraft Ovoz Effektlari (SFX):</strong>
                <span>Tugmalarni bosganda yog'och va buyum tovushlarini chiqarish</span>
              </div>
              <label className="mc-switch">
                <input
                  type="checkbox"
                  checked={sfxEnabled}
                  onChange={(e) => handleToggleSfx(e.target.checked)}
                />
                <span className="mc-slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <strong>Avtomatik Navbatdagi Musiqa:</strong>
                <span>Musiqa tugaganda avtomatik keyingisiga o'tish</span>
              </div>
              <label className="mc-switch">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={(e) => handleToggleAutoNext(e.target.checked)}
                />
                <span className="mc-slider"></span>
              </label>
            </div>

            {/* System Info Diagnostics */}
            <div className="system-diag-box">
              <h4>TIZIM DIAGNOSTIKASI:</h4>
              <div className="diag-row">
                <span>Dastur versiyasi:</span>
                <span className="text-yellow">Musiqa Hub v2.0 (Minecraft Edition)</span>
              </div>
              <div className="diag-row">
                <span>Brauzer Audio API:</span>
                <span className="text-green">Web Audio API (Active)</span>
              </div>
              <div className="diag-row">
                <span>Ma'lumotlar bazasi:</span>
                <span className="text-cyan">IndexedDB Persistent Engine v1</span>
              </div>
              <div className="diag-row">
                <span>PWA Service Worker:</span>
                <span className="text-green">Faol (Offline kesh)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
