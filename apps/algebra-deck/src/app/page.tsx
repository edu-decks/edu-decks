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
import { useAlgebraSettings } from "@/hooks/use-algebra-settings";
import { generateAlgebraCard } from "@/lib/card-generator";
import { playAlgebraSpeech } from "@/lib/audio-player";
import type { AlgebraCard as AlgebraCardType } from "@/lib/types";

import { AlgebraCard } from "@/components/algebra-card";
import { AppSettings } from "@/components/app-settings";
import { TopicSelector } from "@/components/topic-selector";
import { QuizDisplay } from "@/components/quiz-display";

export default function AlgebraDeckPage() {
  const [hydrated, setHydrated] = useState(false);

  const settings = useAlgebraSettings();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTopicSelectorOpen, setIsTopicSelectorOpen] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const { speak, playChime } = useAudio(playAlgebraSpeech);
  useWakeLock(settings.keepScreenAwake);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const {
    currentProblem: currentCard,
    cardCount,
    isFlipped,
    showHint,
    setShowHint,
    slideDirection,
    handlePrevCard,
    handleNextCard,
    handleCardTap,
  } = useDeckHistory<AlgebraCardType>({
    generateNext: () =>
      generateAlgebraCard({
        activeTopics: settings.activeTopics,
        activeCardTypes: settings.activeCardTypes,
        complexity: settings.complexity,
        includeNegatives: settings.includeNegatives,
      }),
    autoPlayAudio: settings.autoPlayAudio,
    isQuizActive,
    speak: (card, flipped) =>
      speak(flipped ? card.backSpeechText : card.frontSpeechText, true),
    hydrated,
    isItemValid: (card) =>
      settings.activeTopics.includes(card.topic) &&
      settings.activeCardTypes.includes(card.cardType) &&
      (card.cardType === "concept" || card.complexity === settings.complexity),
    validationKey: JSON.stringify({
      topics: settings.activeTopics,
      cardTypes: settings.activeCardTypes,
      complexity: settings.complexity,
      neg: settings.includeNegatives,
    }),
  });

  useEffect(() => {
    if (!settings.showTimer || isQuizActive) return;
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [settings.showTimer, isQuizActive]);

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
            activeTopics={settings.activeTopics}
            onTopicToggle={settings.handleTopicToggle}
            onTopicSelectExclusive={settings.handleTopicSelectExclusive}
            activeCardTypes={settings.activeCardTypes}
            onCardTypeToggle={settings.handleCardTypeToggle}
            complexity={settings.complexity}
            onComplexityChange={settings.setComplexity}
            includeNegatives={settings.includeNegatives}
            onIncludeNegativesChange={settings.setIncludeNegatives}
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
            activeTopics={settings.activeTopics}
            complexity={settings.complexity}
            includeNegatives={settings.includeNegatives}
            autoPlayAudio={settings.autoPlayAudio}
            onSpeak={(text, onEnd) => speak(text, true, onEnd)}
            onPlayChime={playChime}
            onExit={() => setIsQuizActive(false)}
          />
        ) : undefined
      }
    >
      {currentCard && (
        <AlgebraCard
          card={currentCard}
          isFlipped={isFlipped}
          showHint={showHint}
          onToggleHint={() => setShowHint(!showHint)}
          slideDirection={slideDirection}
          onCardTap={handleCardTap}
        />
      )}
    </DeckAppShell>
  );
}
