"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, Map, EyeOff } from "lucide-react";
import { DeckQuizManager, useDeckQuizState } from "@decks/core";
import {
  generateQuizQuestion,
  type StatesQuizQuestion,
  type QuizOption,
} from "@/lib/card-generator";
import { StateOutlineSvg, UsLocatorMapSvg } from "./state-map-svg";
import type { RegionType, CardMode } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuizDisplayProps = {
  activeRegions: RegionType[];
  activeModes: CardMode[];
  showStateOutline: boolean;
  onToggleStateOutline: () => void;
  optionCount?: number;
  autoPlayAudio: boolean;
  onSpeak: (text: string, onEnd?: () => void) => void;
  onPlayChime: (correct: boolean) => void;
  onExit: () => void;
};

export function QuizDisplay({
  activeRegions,
  activeModes,
  showStateOutline,
  onToggleStateOutline,
  optionCount = 8,
  autoPlayAudio,
  onSpeak,
  onPlayChime,
  onExit,
}: QuizDisplayProps) {
  const { score, streak, isCorrect, setIsCorrect, recordAnswer } =
    useDeckQuizState();

  const [question, setQuestion] = useState<StatesQuizQuestion | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playPromptAudio = useCallback(
    (q: StatesQuizQuestion) => {
      setIsPlayingSound(true);
      onSpeak(q.card.frontSpeechText, () => {
        setIsPlayingSound(false);
      });
    },
    [onSpeak]
  );

  const nextQuestion = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSelectedValue(null);
    setIsCorrect(null);

    const nextQ = generateQuizQuestion({
      activeRegions,
      activeModes,
      optionCount,
    });
    setQuestion(nextQ);

    if (autoPlayAudio) {
      timeoutRef.current = setTimeout(() => {
        playPromptAudio(nextQ);
      }, 350);
    }
  }, [activeRegions, activeModes, optionCount, autoPlayAudio, playPromptAudio, setIsCorrect]);

  useEffect(() => {
    nextQuestion();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [nextQuestion]);

  const handleSelectOption = useCallback(
    (opt: QuizOption) => {
      if (!question || selectedValue !== null) return;

      setSelectedValue(opt.value);
      const correct = opt.value === question.correctValue;
      recordAnswer(correct);
      onPlayChime(correct);

      if (correct) {
        timeoutRef.current = setTimeout(() => {
          nextQuestion();
        }, 950);
      } else {
        timeoutRef.current = setTimeout(() => {
          setSelectedValue(null);
          setIsCorrect(null);
        }, 750);
      }
    },
    [question, selectedValue, recordAnswer, onPlayChime, nextQuestion, setIsCorrect]
  );

  // Support number keys 1-8 for quick keyboard selection
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!question || selectedValue !== null) return;
      const idx = ["1", "2", "3", "4", "5", "6", "7", "8"].indexOf(e.key);
      if (idx !== -1 && question.options[idx]) {
        e.preventDefault();
        handleSelectOption(question.options[idx]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [question, selectedValue, handleSelectOption]);

  if (!question) return null;

  const { card, promptTitle, promptSubtitle, options } = question;
  const { state, mode, color } = card;

  return (
    <DeckQuizManager
      score={score}
      streak={streak}
      showStreak={true}
      onExit={onExit}
      onReplayAudio={() => playPromptAudio(question)}
      isPlayingSound={isPlayingSound}
      replayLabel="Listen"
      contentClassName="landscape:flex-row landscape:max-w-5xl md:landscape:max-w-6xl landscape:items-center landscape:justify-center landscape:gap-6 md:landscape:gap-10 min-h-0 py-2 sm:py-4 px-2"
      promptClassName="landscape:flex-1 landscape:w-full landscape:min-w-0 landscape:max-w-xl landscape:my-auto"
      inputClassName="w-full max-w-4xl mx-auto landscape:w-[360px] sm:landscape:w-[440px] md:landscape:w-[500px] landscape:shrink-0 landscape:my-auto"
      prompt={
        <div
          className={cn(
            "w-full max-w-2xl rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative cursor-pointer shadow-xl transition-all duration-300 gap-2 sm:gap-3",
            "min-h-[190px] sm:min-h-[240px]",
            isCorrect === true &&
              "border-4 border-emerald-400 shadow-emerald-500/30 scale-[1.02]",
            isCorrect === false && "border-4 border-destructive animate-shake"
          )}
          style={{
            backgroundColor: color,
            boxShadow:
              "0 1px 1px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.12), 0 4px 4px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.12)",
          }}
          onClick={() => playPromptAudio(question)}
        >
          {/* Optional outline toggle button on State & Capital quiz prompts */}
          {mode !== "map-to-state" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStateOutline();
              }}
              aria-label={
                showStateOutline ? "Hide state outline" : "Show state outline"
              }
              title={
                showStateOutline ? "Hide state outline" : "Show state outline"
              }
              className={cn(
                "absolute top-3 left-3 sm:top-4 sm:left-4 h-10 w-10 rounded-full inline-flex items-center justify-center text-white transition-all active:scale-95",
                showStateOutline
                  ? "bg-white/25 opacity-100 shadow-md"
                  : "opacity-75 hover:opacity-100 hover:bg-white/15"
              )}
            >
              {showStateOutline ? (
                <Map className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          )}

          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80">
            {promptSubtitle}
          </span>

          {mode !== "map-to-state" && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {mode === "capital-to-state" && (
                <span className="text-[#ffd45e] text-2xl sm:text-3xl leading-none">
                  ★
                </span>
              )}
              <h3 className="font-headline font-extrabold text-white text-center leading-tight text-2xl sm:text-4xl md:text-5xl tracking-tight">
                {promptTitle}
              </h3>
            </div>
          )}

          {/* State Outline / Map Visual */}
          {mode === "map-to-state" ? (
            <div className="flex items-center justify-center gap-4 w-full h-36 sm:h-44">
              <div className="h-full aspect-[4/3] flex items-center justify-center">
                <StateOutlineSvg
                  state={state}
                  showCapitalStar={false}
                  fillColor="rgba(255, 212, 94, 0.28)"
                  strokeColor="#ffd45e"
                />
              </div>
              <div className="h-full aspect-[16/10] hidden sm:flex items-center justify-center bg-black/20 rounded-2xl p-2 border border-white/15">
                <UsLocatorMapSvg targetState={state} showCapitalStar={false} />
              </div>
            </div>
          ) : (
            showStateOutline && (
              <div className="w-32 h-24 sm:w-40 sm:h-32 flex items-center justify-center mt-1">
                <StateOutlineSvg
                  state={state}
                  showCapitalStar={mode === "capital-to-state"}
                  showCapitalLabel={false}
                />
              </div>
            )
          )}
        </div>
      }
      input={
        <div
          className={cn(
            "w-full grid grid-cols-2 p-1",
            options.length <= 4
              ? "gap-3 sm:gap-4"
              : options.length <= 6
              ? "gap-2.5 sm:gap-3"
              : "gap-2 sm:gap-2.5"
          )}
        >
          {options.map((opt) => {
            const isSelected = selectedValue === opt.value;
            const isSelectedCorrect = isSelected && isCorrect === true;
            const isSelectedIncorrect = isSelected && isCorrect === false;

            return (
              <button
                key={opt.value}
                type="button"
                className={cn(
                  "w-full rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center font-headline font-bold shadow-md transition-all active:scale-95 relative overflow-hidden border-2 px-3 py-2 text-center select-none",
                  options.length <= 4
                    ? "min-h-[76px] sm:min-h-[96px]"
                    : options.length <= 6
                    ? "min-h-[60px] sm:min-h-[72px]"
                    : "min-h-[50px] sm:min-h-[60px]",
                  isSelectedCorrect &&
                    "bg-emerald-500 text-white scale-[1.03] border-emerald-300 z-10 shadow-xl shadow-emerald-500/30",
                  isSelectedIncorrect &&
                    "bg-destructive/20 text-destructive border-destructive animate-shake",
                  !isSelected &&
                    "bg-card text-card-foreground border-border hover:bg-accent/50 hover:border-primary/40 hover:scale-[1.01]"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectOption(opt);
                }}
              >
                <span
                  className={cn(
                    "leading-tight font-extrabold",
                    options.length <= 4
                      ? "text-base sm:text-xl md:text-2xl"
                      : options.length <= 6
                      ? "text-sm sm:text-lg md:text-xl"
                      : "text-sm sm:text-base md:text-lg"
                  )}
                >
                  {opt.label}
                </span>
                {opt.sublabel && (
                  <span
                    className={cn(
                      "text-xs font-bold mt-0.5",
                      isSelectedCorrect
                        ? "text-white/90"
                        : "text-muted-foreground"
                    )}
                  >
                    {opt.sublabel}
                  </span>
                )}
                {isSelectedCorrect && (
                  <CheckCircle2 className="absolute top-2.5 right-2.5 w-6 h-6 text-white animate-in zoom-in" />
                )}
              </button>
            );
          })}
        </div>
      }
    />
  );
}
