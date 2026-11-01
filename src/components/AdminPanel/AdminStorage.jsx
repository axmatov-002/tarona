import React, { useState, useEffect } from 'react';
import { playMinecraftClick } from '../../utils/sfx';
import { formatBytes } from '../../utils/formatters';
import { musicDB } from '../../services/db';

export default function AdminStorage({
  tracks,
  storageMB,
  onExportBackup,
  onImportBackup,
  onClearAll,
  showToast
}) {
  const [quotaInfo, setQuotaInfo] = useState({ usage: 0, quota: 0, percent: 0 });
  const [isPersisted, setIsPersisted] = useState(false);

  useEffect(() => {
    const checkStorageQuota = async () => {
      const info = await musicDB.getStorageEstimate();
      setQuotaInfo(info);
    };

    const checkPersistence = async () => {
      if (navigator.storage && navigator.storage.persisted) {
        try {
          const persisted = await navigator.storage.persisted();
          setIsPersisted(persisted);
        } catch (e) {
          console.warn(e);
        }
      }
    };

    checkStorageQuota();
    checkPersistence();
  }, [tracks, storageMB]);

  const handleRequestPersistence = async () => {
    playMinecraftClick();
    if (navigator.storage && navigator.storage.persist) {
      try {
        const granted = await navigator.storage.persist();
        setIsPersisted(granted);
        if (granted) {
          showToast("Doimiy xotira (Persistent storage) faollashtirildi!", 'success');
        } else {
          showToast("Brauzer doimiy xotira ruxsatini bermadi", 'info');
        }
      } catch (e) {
        showToast("Ruxsat so'rashda xatolik yuz berdi", 'error');
      }
    }
  };

  // Format type breakdown
  const formatStats = {};
  tracks.forEach((t) => {
    const ext = t.type ? t.type.replace('audio/', '').toUpperCase() : 'MP3';
    formatStats[ext] = formatStats[ext] || { count: 0, size: 0 };
    formatStats[ext].count += 1;
    formatStats[ext].size += t.size || 0;
  });

  return (
    <div className="admin-storage-page">
      {/* Top Banner */}
      <div className="admin-banner-card storage-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <span className="live-dot"></span>
            <span>ENDER CHEST FILE SYSTEM</span>
          </div>
          <h2>ENDER XOTIRA VA ZAXIRA MARKAZI</h2>
          <p>
            Musiqiy fayllaringiz brauzeringizning IndexedDB xavfsiz sandig'ida saqlanadi.
            Ushbu bo'limda xotira holatini tekshirishingiz, zaxira nusxa yaratishingiz va tiklashingiz mumkin.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-split">
        {/* Left: Storage Meter & Quota */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              <h3>XOTIRA KVOTASI VA HOLATI</h3>
            </div>
          </div>

          <div className="storage-meter-details">
            <div className="quota-row">
              <span>Musiqalar egallagan joy:</span>
              <strong className="text-yellow">{storageMB.toFixed(2)} MB</strong>
            </div>

            {quotaInfo.quota > 0 && (
              <>
                <div className="quota-row">
                  <span>Brauzer umumiy kvotasi:</span>
                  <span>{formatBytes(quotaInfo.quota)}</span>
                </div>
                <div className="quota-row">
                  <span>Ishlatilgan jami joy:</span>
                  <span>{formatBytes(quotaInfo.usage)} ({quotaInfo.percent}%)</span>
                </div>

                <div className="admin-progress-bar-wrap">
                  <div
                    className="admin-progress-fill"
                    style={{ width: `${Math.min(100, Math.max(3, quotaInfo.percent))}%` }}
                  ></div>
                </div>
              </>
            )}

            {/* Persistent storage box */}
            <div className="persist-status-card">
              <div className="persist-info">
                <span className="persist-title">DOIMIY XOTIRA (PERSISTENT STORAGE):</span>
                <span className={`persist-badge ${isPersisted ? 'badge-green' : 'badge-yellow'}`}>
                  {isPersisted ? '✅ FAOL (O\'chirilmaydi)' : '⚠️ STANDART (Vaqtinchalik)'}
                </span>
                <p className="persist-desc">
                  Doimiy xotira faollashtirilsa, brauzer disk to'lgan holatda ham musiqalaringizni avtomatik tozalab yubormaydi.
                </p>
              </div>
              {!isPersisted && (
                <button
                  className="btn btn-primary btn-small"
                  onClick={handleRequestPersistence}
                >
                  FAOL QILISH
                </button>
              )}
            </div>

            {/* Format Distribution */}
            <div className="format-dist-wrap">
              <h4>AUDIO FORMATLAR TAQSIMOTI:</h4>
              <div className="format-chips">
                {Object.entries(formatStats).map(([format, data]) => (
                  <div key={format} className="format-chip">
                    <span className="format-name">.{format}</span>
                    <span className="format-count">{data.count} disk</span>
                    <span className="format-size">({formatBytes(data.size)})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Backup & Recovery Hub */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <h3>ZAXIRA VA TIKLASH (BACKUP & RESTORE)</h3>
            </div>
          </div>

          <div className="backup-controls-grid">
            <div className="backup-action-card">
              <div className="backup-card-head">
                <div className="backup-icon gold">💾</div>
                <div>
                  <h4>KUTUBXONA ZAXIRASI (JSON)</h4>
                  <p>Barcha musiqalar ro'yxati, ijrochilar va ma'lumotlarni saqlab olish</p>
                </div>
              </div>
              <button
                className="btn btn-gradient btn-full"
                onClick={() => {
                  playMinecraftClick();
                  onExportBackup();
                }}
              >
                <span>ZAXIRANI YUKLAB OLISH (EXPORT)</span>
              </button>
            </div>

            <div className="backup-action-card">
              <div className="backup-card-head">
                <div className="backup-icon cyan">📥</div>
                <div>
                  <h4>ZAXIRANI QAYTA TIKLASH</h4>
                  <p>Avval eksport qilingan JSON fayldan kutubxonani tiklash</p>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-full"
                onClick={() => {
                  playMinecraftClick();
                  onImportBackup();
                }}
              >
                <span>FAYLNI TANLASH (IMPORT)</span>
              </button>
            </div>

            <div className="backup-action-card danger-card">
              <div className="backup-card-head">
                <div className="backup-icon red">💣</div>
                <div>
                  <h4 className="text-red">TNT TOZALASH (RESET)</h4>
                  <p>IndexedDB bazasidagi barcha treklarni butunlay tozalab tashlash</p>
                </div>
              </div>
              <button
                className="btn btn-danger btn-full"
                onClick={() => {
                  playMinecraftClick();
                  onClearAll();
                }}
              >
                <span>BARCHA MUSIQALARNI O'CHIRISH</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
