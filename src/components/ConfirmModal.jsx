import React from 'react';
import { playMinecraftClick } from '../utils/sfx';

export default function ConfirmModal({ isOpen, title, desc, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              playMinecraftClick();
              onCancel();
            }}
          >
            BEKOR QILISH
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              playMinecraftClick();
              onConfirm();
            }}
          >
            O'CHIRISH
          </button>
        </div>
      </div>
    </div>
  );
}
