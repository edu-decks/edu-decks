"use client";

import { useState, useEffect } from "react";
import {
  useWakeLock,
  useAudio,
  useDeckHistory,
  SessionStats,
  DeckAppShell,
  useDeckGestures,
} from "@decks/core";
import { useStatesSettings } from "@/hooks/use-states-settings";
import { generateStatesCard } from "@/lib/card-generator";
import { playStatesSpeech } from "@/lib/audio-player";
import type { StatesCard as StatesCardType } from "@/lib/types";

import { StatesCard } from "@/components/states-card";
import { AppSettings } from "@/components/app-settings";
import { TopicSelector } from "@/components/topic-selector";
import { QuizDisplay } from "@/components/quiz-display";

export default function StatesDeckPage() {
  const [hydrated, setHydrated] = useState(false);

  // Settings
  const settings = useStatesSettings();

  // UI state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Audio & screen wake-lock
  const { speak, playChime } = useAudio(playStatesSpeech);
  useWakeLock(settings.keepScreenAwake);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // ── Deck history ────────────────────────────────────────────────────────────
  const {
    currentProblem: currentCard,
    cardCount,
    isFlipped,
    slideDirection,
    handlePrevCard,
    handleNextCard,
    handleCardTap,
  } = useDeckHistory<StatesCardType>({
    generateNext: () =>
      generateStatesCard({
        activeRegions: settings.activeRegions,
        activeModes: settings.activeModes,
      }),
    autoPlayAudio: settings.autoPlayAudio,
    isQuizActive,
    speak: (card, flipped) =>
      speak(flipped ? card.backSpeechText : card.frontSpeechText, true),
    hydrated,
    isItemValid: (card) =>
      settings.activeRegions.includes(card.region) &&
      settings.activeModes.includes(card.mode),
    validationKey: JSON.stringify({
      regions: settings.activeRegions,
      modes: settings.activeModes,
    }),
  });

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!settings.showTimer || isQuizActive) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.showTimer, isQuizActive]);

  // ── Gesture & keyboard ───────────────────────────────────────────────────
  const { handlePointerDown, handlePointerUp, notifyMenuClosed } =
    useDeckGestures({
      onNext: handleNextCard,
      onPrev: handlePrevCard,
      onTap: handleCardTap,
      isMenuOpen: isQuizActive || isSettingsOpen || isTopicSelectorOpen,
    });

  const handleTopicSelectorOpenChange = (open: boolean) => {
    if (!open) notifyMenuClosed();
    setIsTopicSelectorOpen(open);
  };

  const handleSettingsOpenChange = (open: boolean) => {
    if (!open) notifyMenuClosed();
    setIsSettingsOpen(open);
  };

  if (!hydrated) return null;

  return (
    <DeckAppShell
      isLocked={settings.isLocked}
      onUnlock={() => settings.setIsLocked(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      topRightControls={
        <>
          <TopicSelector
            activeRegions={settings.activeRegions}
            onRegionToggle={settings.handleRegionToggle}
            onRegionSelectExclusive={settings.handleRegionSelectExclusive}
            onSelectAllRegions={settings.handleSelectAllRegions}
            activeModes={settings.activeModes}
            onModeToggle={settings.handleModeToggle}
            onModeSelectExclusive={settings.handleModeSelectExclusive}
            showStateOutline={settings.showStateOutline}
            onShowStateOutlineChange={settings.setShowStateOutline}
            quizOptionCount={settings.quizOptionCount}
            onQuizOptionCountChange={settings.setQuizOptionCount}
            onStartQuiz={() => setIsQuizActive(true)}
            open={isTopicSelectorOpen}
            onOpenChange={handleTopicSelectorOpenChange}
          />
          <AppSettings
            showCardCount={settings.showCardCount}
            onShowCardCountChange={settings.setShowCardCount}
            showTimer={settings.showTimer}
            onShowTimerChange={settings.setShowTimer}
            autoPlayAudio={settings.autoPlayAudio}
            onAutoPlayAudioChange={settings.setAutoPlayAudio}
            keepScreenAwake={settings.keepScreenAwake}
            onKeepScreenAwakeChange={settings.setKeepScreenAwake}
            open={isSettingsOpen}
            onOpenChange={handleSettingsOpenChange}
            onLockApp={() => settings.setIsLocked(true)}
          />
        </>
      }
      bottomStats={
        settings.showCardCount || settings.showTimer ? (
          <SessionStats
            cardCount={cardCount}
            timeElapsed={timeElapsed}
            showCardCount={settings.showCardCount}
            showTimer={settings.showTimer}
            position="bottom-center"
          />
        ) : undefined
      }
      quizOverlay={
        isQuizActive ? (
          <QuizDisplay
            activeRegions={settings.activeRegions}
            activeModes={settings.activeModes}
            showStateOutline={settings.showStateOutline}
            onToggleStateOutline={() =>
              settings.setShowStateOutline(!settings.showStateOutline)
            }
            optionCount={settings.quizOptionCount}
            autoPlayAudio={settings.autoPlayAudio}
            onSpeak={(text, onEnd) => speak(text, true, onEnd)}
            onPlayChime={playChime}
            onExit={() => setIsQuizActive(false)}
          />
        ) : undefined
      }
    >
      {currentCard && (
        <StatesCard
          key={currentCard.id}
          card={currentCard}
          isFlipped={isFlipped}
          slideDirection={slideDirection}
          showStateOutline={settings.showStateOutline}
          onToggleStateOutline={() =>
            settings.setShowStateOutline(!settings.showStateOutline)
          }
          onSpeak={(text) => speak(text, true)}
        />
      )}
    </DeckAppShell>
  );
}
