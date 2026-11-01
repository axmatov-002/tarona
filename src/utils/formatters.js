/**
 * Formatter utilities for time, dates, and file sizes
 */

export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function formatDateWithTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month} ${hours}:${minutes}`;
}

export function formatTotalDuration(seconds) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '0 daq';
  const hours = Math.floor(seconds / 3600);
  const remainingSecs = seconds % 3600;
  const mins = Math.floor(remainingSecs / 60);
  const secs = Math.floor(remainingSecs % 60);

  if (hours > 0) {
    return `${hours} soat ${mins} daq`;
  }
  if (mins > 0) {
    return `${mins} daq ${secs} son`;
  }
  return `${secs} soniya`;
}

export function generateUUID() {
  return 'track_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}
