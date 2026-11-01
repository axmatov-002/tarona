import React, { useState } from 'react';
import { playMinecraftClick } from '../../utils/sfx';

export default function AdminAuthModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    playMinecraftClick();

    const savedPin = localStorage.getItem('musiqa_admin_pin') || '1234';
    if (pin.trim() === savedPin) {
      sessionStorage.setItem('musiqa_admin_auth', 'true');
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickBypass = () => {
    playMinecraftClick();
    sessionStorage.setItem('musiqa_admin_auth', 'true');
    setPin('');
    setError(false);
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box admin-auth-box" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div>
            <h3>QIZIL TOSH XAVFSIZLIK TIZIMI</h3>
            <p className="auth-subtitle">Admin paneliga kirish uchun PIN kodni kiriting</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="admin-pin-input">ADMIN PIN KODI:</label>
            <input
              id="admin-pin-input"
              type="password"
              maxLength={8}
              placeholder="Masalan: 1234"
              value={pin}
              autoFocus
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(false);
              }}
              className={`mc-input ${error ? 'input-error' : ''}`}
            />
            {error && <span className="auth-error-msg">⚠️ Noto'g'ri PIN kod! Qaytadan urinib ko'ring.</span>}
            <span className="auth-hint">Standart PIN kod: <strong>1234</strong></span>
          </div>

          <div className="modal-actions auth-actions">
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
            <button
              type="button"
              className="btn btn-glass"
              onClick={handleQuickBypass}
              title="PIN kodsiz to'g'ridan-to'g'ri kirish"
            >
              PAROLSIZ KIRISH
            </button>
            <button type="submit" className="btn btn-primary">
              KIRISH
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
