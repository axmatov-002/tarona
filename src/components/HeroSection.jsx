import React, { useEffect, useRef } from 'react';
import { playMinecraftClick } from '../utils/sfx';

export default function HeroSection({
  onPlayAll,
  onUploadClick,
  isPlaying,
  analyserNode
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (analyserNode && isPlaying) {
        const bufferLength = 16;
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(dataArray);

        const barWidth = canvas.width / bufferLength;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i * 2] || 0;
          // Step height into 6 discrete pixel blocks (Minecraft pixel block style)
          const blocksCount = Math.floor((val / 255) * 6);
          const blockHeight = 6;
          const gap = 2;

          for (let b = 0; b < blocksCount; b++) {
            // Gradient from green to redstone red for top peak
            let color = '#55ff55'; // lime
            if (b >= 3) color = '#ffff55'; // yellow
            if (b >= 5) color = '#ff5555'; // redstone

            ctx.fillStyle = color;
            ctx.fillRect(
              i * barWidth + 2,
              canvas.height - (b + 1) * (blockHeight + gap),
              barWidth - 4,
              blockHeight
            );
          }
        }
      } else {
        // Ambient idle pixel redstone lamps
        const time = Date.now() * 0.003;
        const barCount = 16;
        const barWidth = canvas.width / barCount;

        for (let i = 0; i < barCount; i++) {
          const blocks = Math.floor(((Math.sin(time + i * 0.5) * 0.5 + 0.5) * 3) + 1);
          for (let b = 0; b < blocks; b++) {
            ctx.fillStyle = '#1e381e';
            ctx.fillRect(
              i * barWidth + 2,
              canvas.height - (b + 1) * 8,
              barWidth - 4,
              6
            );
          }
        }
      }
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, analyserNode]);

  return (
    <section className="hero-section">
      <div className="hero-bg-glow"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="live-dot"></span> JUKEBOX VA NOTTE BLOKLARI
        </div>
        <h1 className="hero-title">X_terminal</h1>
        <p className="hero-desc">
          O'zingiz yoqtirgan audio disklarni Jukeboxga soling! Barcha disklaringiz brauzer xotirasida xavfsiz saqlanadi va xohlagan paytingizda yangraydi.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={() => {
              playMinecraftClick();
              onPlayAll();
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>DISKLARNI CHALISH</span>
          </button>
          <button
            className="btn btn-secondary btn-large"
            onClick={() => {
              playMinecraftClick();
              onUploadClick();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <span>YANGI DISK QO'SHISH</span>
          </button>
        </div>
      </div>

      {/* Minecraft Jukebox with Floating Music Notes */}
      <div className="hero-visualizer-container">
        <div className="minecraft-jukebox-wrap">
          <div
            className={`minecraft-jukebox ${isPlaying ? 'playing' : ''}`}
            onClick={() => {
              playMinecraftClick();
              onPlayAll();
            }}
            title="Minecraft Jukebox"
          >
            <div className="jukebox-slot">
              <div className="mc-disc"></div>
            </div>
          </div>

          <div className="mc-note-particles">
            <span className="mc-note note-1">♫</span>
            <span className="mc-note note-2">♪</span>
            <span className="mc-note note-3">♬</span>
          </div>
        </div>

        <canvas ref={canvasRef} width="210" height="44" id="hero-canvas"></canvas>
      </div>
    </section>
  );
}
