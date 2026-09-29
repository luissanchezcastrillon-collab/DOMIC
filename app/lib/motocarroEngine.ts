"use client";

/**
 * Mixkit — “Funny magic zoom” (2624)
 * https://mixkit.co/free-sound-effects/zoom/
 */
const SOUND_SRC = "/sounds/funny-magic.mp3";

export function createMotocarroEngine() {
  let audio: HTMLAudioElement | null = null;
  let fadeId: number | null = null;

  function ensure() {
    if (!audio) {
      audio = new Audio(SOUND_SRC);
      audio.preload = "auto";
      audio.volume = 0.85;
    }
    return audio;
  }

  function clearFade() {
    if (fadeId != null) {
      window.clearInterval(fadeId);
      fadeId = null;
    }
  }

  async function start() {
    const el = ensure();
    clearFade();
    try {
      el.pause();
      el.currentTime = 0;
      el.volume = 0.85;
      await el.play();
    } catch {
      /* autoplay bloqueado */
    }
  }

  function stop(fadeMs = 250) {
    if (!audio) return;
    const el = audio;
    clearFade();
    if (fadeMs <= 0) {
      el.pause();
      return;
    }
    const startVol = el.volume;
    const steps = 6;
    const stepMs = fadeMs / steps;
    let i = 0;
    fadeId = window.setInterval(() => {
      i += 1;
      el.volume = Math.max(0, startVol * (1 - i / steps));
      if (i >= steps) {
        clearFade();
        el.pause();
        el.volume = startVol;
      }
    }, stepMs);
  }

  return { start, stop };
}
