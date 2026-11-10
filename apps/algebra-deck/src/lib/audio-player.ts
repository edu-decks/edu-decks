"use client";

/**
 * Algebra-deck TTS speech player.
 */
export function playAlgebraSpeech(
  text: string,
  _enabled?: boolean,
  onEnd?: () => void
): void {
  const cleaned = text
    .replace(/(\d)([xy])/g, "$1 $2")
    .replace(/−/g, " minus ")
    .replace(/≤/g, " is less than or equal to ")
    .replace(/≥/g, " is greater than or equal to ")
    .replace(/</g, " is less than ")
    .replace(/>/g, " is greater than ")
    .replace(/²/g, " squared")
    .replace(/³/g, " cubed")
    .replace(/½/g, "one half")
    .replace(/÷/g, " divided by ")
    .replace(/×/g, " times ")
    .replace(/·/g, " times ")
    .replace(/=/g, " equals ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
}
