/**
 * IndexedDB storage engine for Musiqa Hub (React)
 * Safely stores audio blobs and metadata persistently in the browser
 */

const DB_NAME = 'MusiqaHub_React_DB';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

class MusicDB {
  constructor() {
    this.db = null;
  }

  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('addedAt', 'addedAt', { unique: false });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('isFavorite', 'isFavorite', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB xatolik:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async saveTrack(track) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(track);

      request.onsuccess = () => resolve(track);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getAllTracks() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async getTrack(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async deleteTrack(id) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async toggleFavorite(id) {
    await this.init();
    const track = await this.getTrack(id);
    if (!track) return null;

    track.isFavorite = !track.isFavorite;
    await this.saveTrack(track);
    return track.isFavorite;
  }

  async clearAll() {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async updateTrack(id, updates) {
    await this.init();
    const track = await this.getTrack(id);
    if (!track) throw new Error('Disk topilmadi');

    const updatedTrack = { ...track, ...updates };
    await this.saveTrack(updatedTrack);
    return updatedTrack;
  }

  async deleteMultiple(ids) {
    if (!ids || ids.length === 0) return true;
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      ids.forEach((id) => {
        store.delete(id);
      });

      tx.oncomplete = () => resolve(true);
      tx.onerror = (e) => reject(e.target.error);
    });
  }

  async getTotalSize() {
    const tracks = await this.getAllTracks();
    let totalBytes = 0;
    for (const t of tracks) {
      if (t.size) {
        totalBytes += t.size;
      } else if (t.blob && t.blob.size) {
        totalBytes += t.blob.size;
      }
    }
    return totalBytes;
  }

  async getStorageEstimate() {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
          percent: estimate.quota ? ((estimate.usage / estimate.quota) * 100).toFixed(1) : 0
        };
      } catch (e) {
        console.warn('Storage estimate xatoligi:', e);
      }
    }
    return { usage: 0, quota: 0, percent: 0 };
  }
}

export const musicDB = new MusicDB();

// Admin Activity Logger
const LOGS_STORAGE_KEY = 'musiqa_admin_logs';
export const adminLogger = {
  getLogs() {
    try {
      const raw = localStorage.getItem(LOGS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  addLog(action, detail, type = 'info') {
    try {
      const logs = this.getLogs();
      const newEntry = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        action,
        detail,
        type, // 'info' | 'success' | 'warn' | 'danger'
        timestamp: Date.now()
      };
      const updated = [newEntry, ...logs].slice(0, 50); // Keep last 50
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },
  clearLogs() {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  }
};
