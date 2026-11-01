import React from 'react';
import { playMinecraftClick, playMinecraftItemPop } from '../../utils/sfx';
import { formatBytes, formatTotalDuration, formatDateWithTime } from '../../utils/formatters';

export default function AdminDashboard({
  tracks,
  storageMB,
  onUploadClick,
  onGenerateSample,
  onExportBackup,
  onImportBackup,
  onClearAll,
  onSwitchTab,
  activityLogs,
  onClearLogs
}) {
  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const favCount = tracks.filter((t) => t.isFavorite).length;
  const avgSize = tracks.length > 0 ? (storageMB * 1024 * 1024) / tracks.length : 0;
  const storagePercentage = Math.min(100, (storageMB / 500) * 100);

  // Calculate artist distribution
  const artistCounts = {};
  tracks.forEach((t) => {
    const artist = t.artist || "Noma'lum ijrochi";
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  });

  const sortedArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      {/* Top Banner */}
      <div className="admin-banner-card">
        <div className="banner-content">
          <div className="banner-badge">
            <span className="live-dot"></span>
            <span>COMMAND BLOCK MONITORING</span>
          </div>
          <h2>MINECRAFT JUKEBOX BOSHQARUV TIZIMI</h2>
          <p>
            Barcha musiqalarni to'liq nazorat qilish, metama'lumotlarni tahrirlash,
            Ender xotirani boshqarish va tizim diagnostikasi.
          </p>
        </div>
        <div className="banner-actions">
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
            <span>YANGI DISK QO'SHISH</span>
          </button>
          <button
            className="btn btn-glass"
            onClick={() => {
              playMinecraftItemPop();
              onGenerateSample();
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>NOTEBLOCK OHANG</span>
          </button>
        </div>
      </div>

      {/* 6 Voxel Statistics Cards */}
      <div className="admin-stats-grid">
        {/* Card 1: Total Discs */}
        <div
          className="admin-stat-card"
          onClick={() => {
            playMinecraftClick();
            onSwitchTab('tracks');
          }}
          title="Barcha disklarni ko'rish"
        >
          <div className="stat-card-icon icon-gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">JAMI DISKLAR</span>
            <div className="stat-value">{tracks.length}</div>
            <span className="stat-hint text-yellow">Kutubxonadagi audio fayllar</span>
          </div>
        </div>

        {/* Card 2: Ender Storage */}
        <div
          className="admin-stat-card"
          onClick={() => {
            playMinecraftClick();
            onSwitchTab('storage');
          }}
          title="Xotira ma'lumotlari"
        >
          <div className="stat-card-icon icon-diamond">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">ENDER XOTIRA</span>
            <div className="stat-value">{storageMB.toFixed(1)} MB</div>
            <div className="stat-meter-wrap">
              <div className="stat-meter-fill" style={{ width: `${storagePercentage}%` }}></div>
            </div>
            <span className="stat-hint text-cyan">500 MB kvotadan {storagePercentage.toFixed(0)}%</span>
          </div>
        </div>

        {/* Card 3: Total Duration */}
        <div className="admin-stat-card">
          <div className="stat-card-icon icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">JAMI DAVOMIYLIK</span>
            <div className="stat-value">{formatTotalDuration(totalDuration)}</div>
            <span className="stat-hint text-green">Uzluksiz ijro vaqti</span>
          </div>
        </div>

        {/* Card 4: Favorites */}
        <div className="admin-stat-card">
          <div className="stat-card-icon icon-redstone">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">SEVIMLI DISKLAR</span>
            <div className="stat-value">{favCount}</div>
            <span className="stat-hint text-red">
              {tracks.length > 0 ? `${((favCount / tracks.length) * 100).toFixed(0)}% sevimlilarda` : '0%'}
            </span>
          </div>
        </div>

        {/* Card 5: Average Size */}
        <div className="admin-stat-card">
          <div className="stat-card-icon icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">O'RTACHA HAJM</span>
            <div className="stat-value">{formatBytes(avgSize)}</div>
            <span className="stat-hint text-dim">Bitta disk uchun o'rtacha</span>
          </div>
        </div>

        {/* Card 6: System Status */}
        <div className="admin-stat-card">
          <div className="stat-card-icon icon-xp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div className="stat-card-info">
            <span className="stat-label">TIZIM HOLATI</span>
            <div className="stat-value status-online">ONLAYN</div>
            <span className="stat-hint text-green">IndexedDB & Web Audio aktiv</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Top Artists & Quick Management */}
      <div className="admin-dashboard-split">
        {/* Left: Top Artists Distribution */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3>YETAKCHI IJROCHILAR (TOP ARTISTS)</h3>
            </div>
            <span className="badge">{Object.keys(artistCounts).length} IJROCHI</span>
          </div>

          <div className="artist-distribution-list">
            {sortedArtists.length > 0 ? (
              sortedArtists.map(([artist, count]) => {
                const percent = Math.round((count / tracks.length) * 100);
                return (
                  <div key={artist} className="artist-dist-item">
                    <div className="artist-dist-header">
                      <span className="artist-dist-name">{artist}</span>
                      <span className="artist-dist-badge">
                        {count} disk ({percent}%)
                      </span>
                    </div>
                    <div className="artist-dist-bar-wrap">
                      <div className="artist-dist-bar-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data-hint">Hozircha ijrochilar mavjud emas. Yangi musiqalar qo'shing!</p>
            )}
          </div>
        </div>

        {/* Right: Quick Command Hub */}
        <div className="admin-panel-box">
          <div className="panel-box-header">
            <div className="panel-box-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <h3>TEZKOR BOSHQARUV AMALLARI</h3>
            </div>
          </div>

          <div className="quick-actions-list">
            <button
              className="quick-action-btn"
              onClick={() => {
                playMinecraftClick();
                onSwitchTab('tracks');
              }}
            >
              <div className="quick-action-icon gold">🎵</div>
              <div className="quick-action-text">
                <strong>Disklarni boshqarish jadvali</strong>
                <span>Nomlarni o'zgartirish, sevimliga qo'shish va saralash</span>
              </div>
              <span className="quick-arrow">➜</span>
            </button>

            <button
              className="quick-action-btn"
              onClick={() => {
                playMinecraftClick();
                onExportBackup();
              }}
            >
              <div className="quick-action-icon cyan">💾</div>
              <div className="quick-action-text">
                <strong>Kutubxona zaxirasini yuklab olish</strong>
                <span>JSON formatdagi metama'lumotlarni saqlash</span>
              </div>
              <span className="quick-arrow">➜</span>
            </button>

            <button
              className="quick-action-btn"
              onClick={() => {
                playMinecraftClick();
                onImportBackup();
              }}
            >
              <div className="quick-action-icon green">📥</div>
              <div className="quick-action-text">
                <strong>Zaxirani qayta tiklash</strong>
                <span>Avval eksport qilingan JSON faylni yuklash</span>
              </div>
              <span className="quick-arrow">➜</span>
            </button>

            <button
              className="quick-action-btn danger-action"
              onClick={() => {
                playMinecraftClick();
                onClearAll();
              }}
            >
              <div className="quick-action-icon red">💥</div>
              <div className="quick-action-text">
                <strong>TNT Tozalash (Factory Reset)</strong>
                <span>Kutubxonadagi barcha treklarni butunlay tozalash</span>
              </div>
              <span className="quick-arrow">➜</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Activity Log (Tarix) */}
      <div className="admin-panel-box">
        <div className="panel-box-header">
          <div className="panel-box-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <h3>ADMIN HARAKATLAR TARIXI (ACTIVITY LOG)</h3>
          </div>
          {activityLogs.length > 0 && (
            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                playMinecraftClick();
                onClearLogs();
              }}
            >
              TARIXNI TOZALASH
            </button>
          )}
        </div>

        <div className="activity-logs-container">
          {activityLogs.length > 0 ? (
            activityLogs.map((log) => (
              <div key={log.id} className={`log-row type-${log.type}`}>
                <span className="log-time">{formatDateWithTime(log.timestamp)}</span>
                <span className="log-badge">{log.action}</span>
                <span className="log-detail">{log.detail}</span>
              </div>
            ))
          ) : (
            <p className="no-data-hint">Hozircha hech qanday boshqaruv amallari qayd etilmagan.</p>
          )}
        </div>
      </div>
    </div>
  );
}
