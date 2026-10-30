/**
 * Minecraft Noteblock & C418 Style Music Synthesizer
 * Generates cozy 8-bit / noteblock ambient chime tune as WAV Blob
 */

export async function generateSampleMelodyBlob() {
  const sampleRate = 44100;
  const durationSeconds = 18;
  const numChannels = 2;
  const offlineCtx = new OfflineAudioContext(numChannels, sampleRate * durationSeconds, sampleRate);

  // Minecraft "Wet Hands / Sweden" inspired soothing pentatonic progression (F# Minor / A Major)
  // Notes in Hz: A3, B3, C#4, E4, F#4, A4, B4, C#5, E5
  const notes = [220.00, 246.94, 277.18, 329.63, 369.99, 440.00, 493.88, 554.37, 659.25];

  // Cozy chord pads (like peaceful Minecraft dawn)
  const chordProgression = [
    { time: 0, chords: [146.83, 220.00, 277.18] }, // D Major
    { time: 4.5, chords: [164.81, 246.94, 329.63] }, // E Minor
    { time: 9.0, chords: [185.00, 277.18, 369.99] }, // F# Minor
    { time: 13.5, chords: [220.00, 277.18, 329.63] } // A Major
  ];

  chordProgression.forEach(({ time, chords }) => {
    chords.forEach((freq) => {
      // Soft square / sine blend for cozy vintage synth
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.07, time + 0.6);
      gain.gain.linearRampToValueAtTime(0.04, time + 3.8);
      gain.gain.linearRampToValueAtTime(0, time + 4.5);

      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(time);
      osc.stop(time + 4.5);
    });
  });

  // Noteblock Harp / Pluck Lead
  const melodyPattern = [
    { t: 0.5, note: 440.00 }, // A4
    { t: 1.2, note: 554.37 }, // C#5
    { t: 2.0, note: 659.25 }, // E5
    { t: 3.2, note: 493.88 }, // B4
    { t: 5.0, note: 369.99 }, // F#4
    { t: 5.8, note: 440.00 }, // A4
    { t: 6.6, note: 554.37 }, // C#5
    { t: 7.8, note: 493.88 }, // B4
    { t: 9.5, note: 554.37 }, // C#5
    { t: 10.3, note: 659.25 }, // E5
    { t: 11.2, note: 739.99 }, // F#5
    { t: 12.4, note: 554.37 }, // C#5
    { t: 14.0, note: 440.00 }, // A4
    { t: 14.8, note: 493.88 }, // B4
    { t: 15.6, note: 554.37 }, // C#5
    { t: 16.5, note: 440.00 }  // A4
  ];

  melodyPattern.forEach(({ t, note }) => {
    // Note block pluck simulation: sine + fast decay triangle
    const osc1 = offlineCtx.createOscillator();
    const osc2 = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(note, t);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note * 2, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(offlineCtx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.95);
    osc2.stop(t + 0.95);
  });

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWavBlob(renderedBuffer);
}

function audioBufferToWavBlob(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8);
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt "
  setUint32(16);
  setUint16(1); // PCM
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);

  setUint32(0x61746164); // "data"
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}
