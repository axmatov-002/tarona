import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { musicDB, adminLogger } from './services/db';
import { generateUUID } from './utils/formatters';
import { generateSampleMelodyBlob } from './utils/audioSynthesizer';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HeroSection from './components/HeroSection';
import Dropzone from './components/Dropzone';
import TrackList from './components/TrackList';
import EmptyState from './components/EmptyState';
import PlayerBar from './components/PlayerBar';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';

import AdminPanel from './components/AdminPanel/AdminPanel';
import AdminAuthModal from './components/AdminPanel/AdminAuthModal';

const STORAGE_KEYS = {
  VOLUME: 'musiqa_react_vol',
  LAST_TRACK_ID: 'musiqa_last_track_id',
  LAST_TIME: 'musiqa_last_playback_time',
  SHUFFLE: 'musiqa_last_shuffle',
  REPEAT: 'musiqa_last_repeat'
};

const RATES = [1.0, 1.25, 1.5, 2.0, 0.75];

export default function App() {
  // Audio & Web Audio API Refs
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const backupFileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const currentBlobUrlRef = useRef(null);

  // Library State
  const [tracks, setTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'favorites' | 'recent'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [storageBytes, setStorageBytes] = useState(0);

  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard' | 'tracks' | 'storage' | 'settings'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAdminTab, setPendingAdminTab] = useState('dashboard');
  const [activityLogs, setActivityLogs] = useState(() => adminLogger.getLogs());

  // Playback State
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isShuffle, setIsShuffle] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SHUFFLE) === 'true';
  });
  const [repeatMode, setRepeatMode] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.REPEAT) || 'off';
  });
  const [rateIndex, setRateIndex] = useState(0);

  // UI Feedback State
  const [toasts, setToasts] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    desc: '',
    onConfirm: () => {}
  });

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Initialize and request persistent storage quota
  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  // Web Audio Context Setup on first user gesture
  const initAudioContext = () => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;

      if (audioRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceNodeRef.current = source;
      }

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn('Web Audio Context xatosi:', e);
    }
  };

  // Load Tracks and Restore Last Session
  const loadLibrary = useCallback(async () => {
    try {
      const allTracks = await musicDB.getAllTracks();
      setTracks(allTracks);
      const totalSize = await musicDB.getTotalSize();
      setStorageBytes(totalSize);

      // Restore last playing track if not currently set
      const lastTrackId = localStorage.getItem(STORAGE_KEYS.LAST_TRACK_ID);
      const lastTime = parseFloat(localStorage.getItem(STORAGE_KEYS.LAST_TIME)) || 0;

      if (lastTrackId && allTracks.length > 0) {
        const savedTrack = allTracks.find((t) => t.id === lastTrackId);
        if (savedTrack && savedTrack.blob instanceof Blob) {
          const url = URL.createObjectURL(savedTrack.blob);
          currentBlobUrlRef.current = url;
          setCurrentTrack(savedTrack);
          setDuration(savedTrack.duration || 0);

          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.currentTime = lastTime;
            setCurrentTime(lastTime);
          }
        }
      }
    } catch (err) {
      console.error('Baza yuklashda xatolik:', err);
      showToast('Kutubxonani yuklashda xatolik yuz berdi', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  // Persist Current Playback State across sessions
  useEffect(() => {
    if (currentTrack) {
      localStorage.setItem(STORAGE_KEYS.LAST_TRACK_ID, currentTrack.id);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTime > 0) {
      localStorage.setItem(STORAGE_KEYS.LAST_TIME, currentTime);
    }
  }, [currentTime]);

  // Save on page close/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        localStorage.setItem(STORAGE_KEYS.LAST_TIME, audioRef.current.currentTime);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Filtered & Sorted Tracks (for Main Player View)
  const filteredTracks = useMemo(() => {
    let list = [...tracks];

    if (activeTab === 'favorites') {
      list = list.filter((t) => t.isFavorite);
    } else if (activeTab === 'recent') {
      list = [...list].sort((a, b) => b.addedAt - a.addedAt);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.artist && t.artist.toLowerCase().includes(q))
      );
    }

    if (activeTab !== 'recent') {
      if (sortBy === 'newest') {
        list.sort((a, b) => b.addedAt - a.addedAt);
      } else if (sortBy === 'oldest') {
        list.sort((a, b) => a.addedAt - b.addedAt);
      } else if (sortBy === 'title') {
        list.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'duration') {
        list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      }
    }

    return list;
  }, [tracks, activeTab, searchQuery, sortBy]);

  // Track Playback
  const playTrackByIndex = useCallback(
    async (index) => {
      if (index < 0 || index >= filteredTracks.length) return;
      const track = filteredTracks[index];

      setCurrentTrackIndex(index);
      setCurrentTrack(track);

      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }

      if (track.blob instanceof Blob) {
        const url = URL.createObjectURL(track.blob);
        currentBlobUrlRef.current = url;
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = RATES[rateIndex];
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            initAudioContext();
          } catch (err) {
            console.warn("Avtomatik ijro to'xtatildi:", err);
            setIsPlaying(false);
          }
        }
      } else {
        showToast('Audio fayl topilmadi', 'error');
      }

      // MediaSession API
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: 'Musiqa Hub',
          artwork: [
            {
              src: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=512&auto=format&fit=crop&q=80',
              sizes: '512x512',
              type: 'image/jpeg'
            }
          ]
        });
      }
    },
    [filteredTracks, rateIndex, showToast]
  );

  // Play track by ID (for Admin panel and search results)
  const playTrackById = useCallback(
    async (trackId) => {
      const trackIndex = tracks.findIndex((t) => t.id === trackId);
      if (trackIndex === -1) return;
      const track = tracks[trackIndex];

      setCurrentTrackIndex(trackIndex);
      setCurrentTrack(track);

      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }

      if (track.blob instanceof Blob) {
        const url = URL.createObjectURL(track.blob);
        currentBlobUrlRef.current = url;
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.playbackRate = RATES[rateIndex];
          try {
            await audioRef.current.play();
            setIsPlaying(true);
            initAudioContext();
          } catch (err) {
            console.warn("Avtomatik ijro to'xtatildi:", err);
            setIsPlaying(false);
          }
        }
      } else {
        showToast('Audio fayl topilmadi', 'error');
      }
    },
    [tracks, rateIndex, showToast]
  );

  const togglePlayPause = () => {
    if (!currentTrack) {
      if (filteredTracks.length > 0) {
        playTrackByIndex(0);
      } else {
        showToast('Ijro etish uchun avval musiqa yuklang', 'info');
      }
      return;
    }

    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            initAudioContext();
          })
          .catch((e) => console.error(e));
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const playNext = useCallback(() => {
    if (filteredTracks.length === 0) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      playTrackByIndex(randomIndex);
      return;
    }

    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= filteredTracks.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return;
      }
    }
    playTrackByIndex(nextIndex);
  }, [filteredTracks, isShuffle, currentTrackIndex, repeatMode, playTrackByIndex]);

  const playPrev = useCallback(() => {
    if (filteredTracks.length === 0) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = filteredTracks.length - 1;
    }
    playTrackByIndex(prevIndex);
  }, [filteredTracks, currentTrackIndex, playTrackByIndex]);

  const toggleShuffle = () => {
    setIsShuffle((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SHUFFLE, next);
      showToast(
        next ? 'Aralashtirish rejimi (Shuffle) yoqildi' : "Aralashtirish rejimi o'chirildi",
        'info'
      );
      return next;
    });
  };

  const toggleRepeat = () => {
    let next;
    if (repeatMode === 'off') {
      next = 'all';
      showToast("Barcha qo'shiqlarni qaytarish yoqildi", 'info');
    } else if (repeatMode === 'all') {
      next = 'one';
      showToast("Bitta qo'shiqni qaytarish yoqildi", 'info');
    } else {
      next = 'off';
      showToast("Qaytarish rejimi o'chirildi", 'info');
    }
    setRepeatMode(next);
    localStorage.setItem(STORAGE_KEYS.REPEAT, next);
  };

  const cycleSpeed = () => {
    const nextIndex = (rateIndex + 1) % RATES.length;
    setRateIndex(nextIndex);
    const newRate = RATES[nextIndex];
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const handleSeek = (newTime) => {
    if (audioRef.current && isFinite(newTime)) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      localStorage.setItem(STORAGE_KEYS.LAST_TIME, newTime);
    }
  };

  const handleVolumeChange = (newVol) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    localStorage.setItem(STORAGE_KEYS.VOLUME, clamped);
  };

  const handleToggleMute = () => {
    if (volume > 0) {
      audioRef.current.dataset.lastVol = volume;
      handleVolumeChange(0);
    } else {
      const last = parseFloat(audioRef.current?.dataset?.lastVol) || 0.8;
      handleVolumeChange(last);
    }
  };

  // Upload Processing
  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac', 'audio/flac', 'audio/webm'];
    let addedCount = 0;

    showToast(`${files.length} ta fayl tekshirilmoqda...`, 'info');

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('audio/') && !allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)) {
        continue;
      }

      try {
        const metadata = await extractAudioInfo(file);
        const trackData = {
          id: generateUUID(),
          title: metadata.title,
          artist: metadata.artist,
          genre: 'Minecraft OST',
          duration: metadata.duration,
          size: file.size,
          type: file.type || 'audio/mp3',
          blob: file,
          addedAt: Date.now(),
          isFavorite: false
        };

        await musicDB.saveTrack(trackData);
        addedCount++;
      } catch (err) {
        console.error("Faylni o'qishda xatolik:", file.name, err);
      }
    }

    if (addedCount > 0) {
      showToast(`${addedCount} ta qo'shiq muvaffaqiyatli saqlandi!`, 'success');
      const updatedLogs = adminLogger.addLog(
        "Disk yuklandi",
        `${addedCount} ta yangi musiqa diski xotiraga saqlandi`,
        "success"
      );
      setActivityLogs(updatedLogs);
      await loadLibrary();
    } else {
      showToast("Hech qanday to'g'ri audio fayl tanlanmadi", 'error');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractAudioInfo = (file) => {
    return new Promise((resolve) => {
      let fileName = file.name.replace(/\.[^/.]+$/, '');
      let artist = "Noma'lum ijrochi";
      let title = fileName;

      if (fileName.includes(' - ')) {
        const parts = fileName.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      const tempUrl = URL.createObjectURL(file);
      const tempAudio = new Audio();
      tempAudio.src = tempUrl;

      const finish = (durationVal) => {
        URL.revokeObjectURL(tempUrl);
        resolve({
          title: title || 'Nomsiz musiqa',
          artist: artist || "Noma'lum ijrochi",
          duration: isFinite(durationVal) ? durationVal : 0
        });
      };

      tempAudio.addEventListener('loadedmetadata', () => finish(tempAudio.duration));
      tempAudio.addEventListener('error', () => finish(0));
      setTimeout(() => finish(0), 3000);
    });
  };

  // Generate Sample Tune
  const handleGenerateSample = async () => {
    showToast('Namuna ohang generatsiya qilinmoqda...', 'info');
    try {
      const wavBlob = await generateSampleMelodyBlob();
      const sampleTrack = {
        id: generateUUID(),
        title: 'C418 - Sweden (Noteblock Remix)',
        artist: 'Minecraft Jukebox Studio',
        genre: 'C418 / Noteblock',
        duration: 18,
        size: wavBlob.size,
        type: 'audio/wav',
        blob: wavBlob,
        addedAt: Date.now(),
        isFavorite: true
      };

      await musicDB.saveTrack(sampleTrack);
      const updatedLogs = adminLogger.addLog(
        "Ohang generatsiya qilindi",
        "C418 Noteblock ohangi yaratildi va xotiraga kiritildi",
        "success"
      );
      setActivityLogs(updatedLogs);
      await loadLibrary();
      showToast('Namuna musiqa yaratildi va IndexedDB ga saqlandi!', 'success');

      setCurrentTrack(sampleTrack);
      if (audioRef.current) {
        if (currentBlobUrlRef.current) {
          URL.revokeObjectURL(currentBlobUrlRef.current);
        }
        const url = URL.createObjectURL(wavBlob);
        currentBlobUrlRef.current = url;
        audioRef.current.src = url;
        await audioRef.current.play();
        setIsPlaying(true);
        initAudioContext();
      }
    } catch (e) {
      console.error('Namuna generatsiyasida xatolik:', e);
      showToast('Namuna ohang yaratishda xatolik', 'error');
    }
  };

  // Favorites Toggle
  const handleToggleFavorite = async (trackId) => {
    const isFav = await musicDB.toggleFavorite(trackId);
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: isFav } : t))
    );
    if (currentTrack && currentTrack.id === trackId) {
      setCurrentTrack((prev) => ({ ...prev, isFavorite: isFav }));
    }
    showToast(isFav ? "Sevimlilar ro'yxatiga qo'shildi" : "Sevimlilardan olib tashlandi", 'info');
  };

  // Download Track
  const handleDownloadTrack = (track) => {
    if (!track.blob) return;
    const url = URL.createObjectURL(track.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast(`"${track.title}" yuklab olinmoqda...`, 'info');
  };

  // Delete Track
  const handleDeleteTrack = (track) => {
    setModalState({
      isOpen: true,
      title: "Musiqani o'chirish",
      desc: `Haqiqatan ham "${track.title}" qo'shig'ini xotiradan butunlay o'chirmoqchimisiz?`,
      onConfirm: async () => {
        await musicDB.deleteTrack(track.id);
        if (currentTrack && currentTrack.id === track.id) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
          }
          setCurrentTrack(null);
          setCurrentTrackIndex(-1);
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          localStorage.removeItem(STORAGE_KEYS.LAST_TRACK_ID);
          localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
        }
        const updatedLogs = adminLogger.addLog(
          "Disk o'chirildi",
          `"${track.title}" diski kutubxonadan o'chirildi`,
          "danger"
        );
        setActivityLogs(updatedLogs);
        await loadLibrary();
        setModalState((prev) => ({ ...prev, isOpen: false }));
        showToast("Musiqa o'chirildi", 'info');
      }
    });
  };

  // Clear All
  const handleClearAll = () => {
    setModalState({
      isOpen: true,
      title: "Barcha musiqalarni o'chirish (TNT)",
      desc: "Xotiradagi barcha musiqalar butunlay o'chiriladi. Ushbu amalni ortga qaytarib bo'lmaydi!",
      onConfirm: async () => {
        await musicDB.clearAll();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        localStorage.removeItem(STORAGE_KEYS.LAST_TRACK_ID);
        localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
        const updatedLogs = adminLogger.addLog(
          "TNT Tozalash",
          "Kutubxonadagi barcha musiqalar tozalab tashlandi",
          "danger"
        );
        setActivityLogs(updatedLogs);
        await loadLibrary();
        setModalState((prev) => ({ ...prev, isOpen: false }));
        showToast("Barcha musiqalar o'chirildi", 'info');
      }
    });
  };

  // ==========================================
  // Admin Operations Handlers
  // ==========================================
  const handleOpenAdmin = (targetTab = 'dashboard') => {
    const isPinRequired = localStorage.getItem('musiqa_admin_pin_required') !== 'false';
    const isAuthed = sessionStorage.getItem('musiqa_admin_auth') === 'true';

    if (isPinRequired && !isAuthed) {
      setPendingAdminTab(targetTab);
      setIsAuthModalOpen(true);
    } else {
      setIsAdminMode(true);
      setAdminTab(targetTab);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    setIsAdminMode(true);
    setAdminTab(pendingAdminTab || 'dashboard');
    showToast("Admin boshqaruv tizimiga muvaffaqiyatli kirildi!", 'success');
    const logs = adminLogger.addLog("Kirish muvaffaqiyatli", "Admin tizimiga muvaffaqiyatli kirildi", "info");
    setActivityLogs(logs);
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
  };

  const handleUpdateTrack = async (trackId, updates) => {
    try {
      await musicDB.updateTrack(trackId, updates);
      if (currentTrack && currentTrack.id === trackId) {
        setCurrentTrack((prev) => ({ ...prev, ...updates }));
      }
      const logs = adminLogger.addLog(
        "Tahrirlandi",
        `"${updates.title}" diski ma'lumotlari yangilandi`,
        "info"
      );
      setActivityLogs(logs);
      await loadLibrary();
      showToast("Disk ma'lumotlari muvaffaqiyatli saqlandi!", 'success');
    } catch (err) {
      console.error(err);
      showToast("Saqlashda xatolik yuz berdi", 'error');
    }
  };

  const handleBatchDelete = (ids) => {
    if (!ids || ids.length === 0) return;
    setModalState({
      isOpen: true,
      title: "Tanlangan disklarni o'chirish",
      desc: `Haqiqatan ham tanlangan ${ids.length} ta diskni xotiradan butunlay o'chirmoqchimisiz?`,
      onConfirm: async () => {
        await musicDB.deleteMultiple(ids);
        if (currentTrack && ids.includes(currentTrack.id)) {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
          }
          setCurrentTrack(null);
          setCurrentTrackIndex(-1);
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          localStorage.removeItem(STORAGE_KEYS.LAST_TRACK_ID);
          localStorage.removeItem(STORAGE_KEYS.LAST_TIME);
        }
        const logs = adminLogger.addLog(
          "Ommaviy o'chirildi",
          `${ids.length} ta disk xotiradan o'chirildi`,
          "danger"
        );
        setActivityLogs(logs);
        await loadLibrary();
        setModalState((prev) => ({ ...prev, isOpen: false }));
        showToast(`${ids.length} ta disk muvaffaqiyatli o'chirildi`, 'info');
      }
    });
  };

  const handleBatchFavorite = async (ids) => {
    if (!ids || ids.length === 0) return;
    try {
      for (const id of ids) {
        const track = await musicDB.getTrack(id);
        if (track && !track.isFavorite) {
          track.isFavorite = true;
          await musicDB.saveTrack(track);
        }
      }
      const logs = adminLogger.addLog(
        "Ommaviy sevimlilar",
        `${ids.length} ta disk sevimlilar ro'yxatiga qo'shildi`,
        "success"
      );
      setActivityLogs(logs);
      await loadLibrary();
      showToast(`${ids.length} ta disk sevimlilarga qo'shildi!`, 'success');
    } catch (e) {
      showToast("Amalni bajarishda xatolik yuz berdi", 'error');
    }
  };

  const handleBatchDownload = (ids) => {
    if (!ids || ids.length === 0) return;
    const selectedTracks = tracks.filter((t) => ids.includes(t.id));
    selectedTracks.forEach((track, i) => {
      setTimeout(() => {
        handleDownloadTrack(track);
      }, i * 350);
    });
  };

  // Export JSON metadata backup
  const handleExportBackup = () => {
    try {
      const exportData = {
        app: 'Musiqa Hub (Minecraft Edition)',
        version: '2.0',
        exportedAt: new Date().toISOString(),
        totalTracks: tracks.length,
        tracks: tracks.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          genre: t.genre || 'Minecraft OST',
          duration: t.duration,
          size: t.size,
          type: t.type,
          addedAt: t.addedAt,
          isFavorite: t.isFavorite
        }))
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().slice(0, 10);
      a.download = `musiqa_hub_backup_${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      const logs = adminLogger.addLog(
        "Zaxira eksport qilindi",
        `${tracks.length} ta disk metama'lumotlari JSON formatda eksport qilindi`,
        "success"
      );
      setActivityLogs(logs);
      showToast("Kutubxona zaxirasi JSON fayl sifatida yuklab olindi!", 'success');
    } catch (err) {
      console.error(err);
      showToast("Zaxiralashda xatolik yuz berdi", 'error');
    }
  };

  const handleImportBackup = () => {
    backupFileInputRef.current?.click();
  };

  const handleBackupFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const importedTracks = Array.isArray(parsed) ? parsed : parsed.tracks;
        if (!Array.isArray(importedTracks)) {
          showToast("Noto'g'ri JSON zaxira fayli formati", 'error');
          return;
        }

        let updatedCount = 0;
        for (const item of importedTracks) {
          if (!item.id || !item.title) continue;
          const existing = await musicDB.getTrack(item.id);
          if (existing) {
            existing.title = item.title;
            existing.artist = item.artist || existing.artist;
            existing.genre = item.genre || existing.genre;
            existing.isFavorite = item.isFavorite ?? existing.isFavorite;
            await musicDB.saveTrack(existing);
            updatedCount++;
          }
        }

        const logs = adminLogger.addLog(
          "Zaxira tiklandi",
          `${updatedCount} ta disk metama'lumotlari zaxiradan yangilandi`,
          "success"
        );
        setActivityLogs(logs);
        await loadLibrary();
        showToast(`${updatedCount} ta disk ma'lumotlari yangilandi!`, 'success');
      } catch (err) {
        console.error(err);
        showToast("JSON faylini o'qishda xatolik yuz berdi", 'error');
      }
    };
    reader.readAsText(file);
    if (backupFileInputRef.current) {
      backupFileInputRef.current.value = '';
    }
  };

  const handleClearLogs = () => {
    adminLogger.clearLogs();
    setActivityLogs([]);
    showToast("Admin harakatlar tarixi tozalandi", 'info');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (audioRef.current) {
          const next = Math.min(
            audioRef.current.duration || 0,
            audioRef.current.currentTime + 5
          );
          handleSeek(next);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (audioRef.current) {
          const next = Math.max(0, audioRef.current.currentTime - 5);
          handleSeek(next);
        }
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolumeChange(volume + 0.05);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolumeChange(volume - 0.05);
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // MediaSession Handlers
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
      navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    }
  });

  const sectionTitle =
    activeTab === 'favorites'
      ? "Sevimlilar ro'yxati"
      : activeTab === 'recent'
      ? "Yaqinda qo'shilganlar"
      : "Barcha musiqalar";

  const storageMB = storageBytes / (1024 * 1024);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        adminTab={adminTab}
        onOpenAdmin={handleOpenAdmin}
        onExitAdmin={handleExitAdmin}
        totalCount={tracks.length}
        favCount={tracks.filter((t) => t.isFavorite).length}
        storageMB={storageMB}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onGenerateSample={handleGenerateSample}
          onUploadClick={() => fileInputRef.current?.click()}
          fileInputRef={fileInputRef}
          onFilesSelected={handleFilesUpload}
          isAdminMode={isAdminMode}
          onOpenAdmin={handleOpenAdmin}
          onExitAdmin={handleExitAdmin}
        />

        {isAdminMode ? (
          /* Admin Panel View */
          <AdminPanel
            tracks={tracks}
            storageMB={storageMB}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            onExitAdmin={handleExitAdmin}
            onPlayTrackById={playTrackById}
            onUpdateTrack={handleUpdateTrack}
            onDeleteTrack={handleDeleteTrack}
            onToggleFavorite={handleToggleFavorite}
            onDownloadTrack={handleDownloadTrack}
            onBatchDelete={handleBatchDelete}
            onBatchFavorite={handleBatchFavorite}
            onBatchDownload={handleBatchDownload}
            onUploadClick={() => fileInputRef.current?.click()}
            onGenerateSample={handleGenerateSample}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onClearAll={handleClearAll}
            activityLogs={activityLogs}
            onClearLogs={handleClearLogs}
            showToast={showToast}
          />
        ) : (
          /* User / Player View */
          <div className="content-scrollable">
            <HeroSection
              onPlayAll={() =>
                filteredTracks.length > 0
                  ? playTrackByIndex(0)
                  : showToast('Ijro etish uchun avval musiqa yuklang', 'info')
              }
              onUploadClick={() => fileInputRef.current?.click()}
              isPlaying={isPlaying}
              analyserNode={analyserRef.current}
            />

            <Dropzone
              onFilesDrop={handleFilesUpload}
              onUploadClick={() => fileInputRef.current?.click()}
            />

            {filteredTracks.length > 0 ? (
              <TrackList
                tracks={filteredTracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sectionTitle={sectionTitle}
                onPlayTrack={playTrackByIndex}
                onToggleFavorite={handleToggleFavorite}
                onDownloadTrack={handleDownloadTrack}
                onDeleteTrack={handleDeleteTrack}
                onClearAll={handleClearAll}
              />
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                activeTab={activeTab}
                onUploadClick={() => fileInputRef.current?.click()}
                onGenerateSample={handleGenerateSample}
              />
            )}
          </div>
        )}
      </main>

      {/* Hidden File Input for Backup Import */}
      <input
        type="file"
        ref={backupFileInputRef}
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleBackupFileSelected}
      />

      {/* Persistent Bottom Player Bar */}
      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        bufferedPercent={bufferedPercent}
        volume={volume}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        playbackRate={RATES[rateIndex]}
        onTogglePlayPause={togglePlayPause}
        onNext={playNext}
        onPrev={playPrev}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onCycleSpeed={cycleSpeed}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onToggleMute={handleToggleMute}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Native HTML Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onDurationChange={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onProgress={() => {
          if (
            audioRef.current &&
            audioRef.current.buffered.length > 0 &&
            audioRef.current.duration
          ) {
            const bufferedEnd = audioRef.current.buffered.end(
              audioRef.current.buffered.length - 1
            );
            setBufferedPercent((bufferedEnd / audioRef.current.duration) * 100);
          }
        }}
        onEnded={() => {
          if (repeatMode === 'one') {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            playNext();
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Admin Auth PIN Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Toasts */}
      <Toast toasts={toasts} />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        desc={modalState.desc}
        onConfirm={modalState.onConfirm}
        onCancel={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
