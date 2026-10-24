"use client";

/**
 * States-deck TTS speech player.
 */
export function playStatesSpeech(
  text: string,
  _enabled?: boolean,
  onEnd?: () => void
): void {
  const cleaned = text.replace(/\s{2,}/g, " ").trim();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  utterance.pitch = 1.05;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}
