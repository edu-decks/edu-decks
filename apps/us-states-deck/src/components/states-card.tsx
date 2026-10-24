"use client";

import React from "react";
import { FlashCardShell, CardCornerButton } from "@decks/core";
import { Map, EyeOff } from "lucide-react";
import { StateOutlineSvg, UsLocatorMapSvg } from "./state-map-svg";
import { REGION_LABELS } from "@/lib/colors";
import type { StatesCard as StatesCardType } from "@/lib/types";

type StatesCardProps = {
  card: StatesCardType;
  isFlipped: boolean;
  slideDirection: "next" | "prev";
  showStateOutline: boolean;
  onToggleStateOutline: () => void;
  onSpeak: (text: string) => void;
  onCardTap?: () => void;
  className?: string;
  showDebugOutlines?: boolean;
};

export function StatesCard({
  card,
  isFlipped,
  slideDirection,
  showStateOutline,
  onToggleStateOutline,
  onSpeak,
  onCardTap,
  className,
  showDebugOutlines,
}: StatesCardProps) {
  const { state, mode } = card;
  const regionLabel = REGION_LABELS[state.region];

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSpeak(isFlipped ? card.backSpeechText : card.frontSpeechText);
  };

  // Top-left button to quickly toggle state outline visibility on State & Capital cards
  const outlineToggleButton =
    mode !== "map-to-state" ? (
      <CardCornerButton
        position="top-left"
        size="lg"
        isActive={showStateOutline}
        onClick={() => onToggleStateOutline()}
        ariaLabel={
          showStateOutline ? "Hide state outline" : "Show state outline"
        }
        title={showStateOutline ? "Hide state outline" : "Show state outline"}
      >
        {showStateOutline ? (
          <Map className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 opacity-75" />
        )}
      </CardCornerButton>
    ) : undefined;

  // ── Primary (Front) Content ───────────────────────────────────────────────
  // Constant height across unrevealed and revealed states so CardRevealLayout
  // smoothly translates `top` without any internal height/reflow jumps.
  let primaryContent: React.ReactNode = null;

  if (mode === "state-to-capital") {
    primaryContent = (
      <div className="flex flex-col items-center justify-center text-center px-6 gap-1.5 w-full">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/75">
          What is the capital of
        </span>
        <h2 className="font-headline font-extrabold text-white tracking-tight leading-none text-3xl sm:text-5xl md:text-6xl">
          {state.name}
        </h2>

        {showStateOutline && (
          <div className="w-36 h-24 sm:w-44 sm:h-28 md:w-48 md:h-32 flex items-center justify-center mt-1">
            <StateOutlineSvg
              state={state}
              showCapitalStar={isFlipped}
              showCapitalLabel={false}
            />
          </div>
        )}
      </div>
    );
  } else if (mode === "capital-to-state") {
    primaryContent = (
      <div className="flex flex-col items-center justify-center text-center px-6 gap-1.5 w-full">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/75">
          Capital City — Which State?
        </span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#ffd45e] text-2xl sm:text-4xl md:text-5xl leading-none select-none">
            ★
          </span>
          <h2 className="font-headline font-extrabold text-white tracking-tight leading-none text-3xl sm:text-5xl md:text-6xl">
            {state.capital}
          </h2>
        </div>

        {showStateOutline && (
          <div className="w-36 h-24 sm:w-44 sm:h-28 md:w-48 md:h-32 flex items-center justify-center mt-1">
            <StateOutlineSvg
              state={state}
              showCapitalStar={true}
              showCapitalLabel={false}
            />
          </div>
        )}
      </div>
    );
  } else {
    // map-to-state
    primaryContent = (
      <div className="flex flex-col items-center justify-center text-center px-6 gap-2 w-full">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80">
          Which state is this?
        </span>
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full h-32 sm:h-36 md:h-40">
          <div className="h-full aspect-[4/3] flex items-center justify-center">
            <StateOutlineSvg
              state={state}
              showCapitalStar={isFlipped}
              fillColor="rgba(255, 212, 94, 0.28)"
              strokeColor="#ffd45e"
            />
          </div>
          <div className="h-full aspect-[16/10] hidden sm:flex items-center justify-center bg-black/20 rounded-2xl p-2 border border-white/15">
            <UsLocatorMapSvg
              targetState={state}
              showCapitalStar={isFlipped}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Detail (Reveal) Content ───────────────────────────────────────────────
  const detailContent = (
    <div className="w-full flex flex-col items-center">
      {/* Full-bleed flat frosted hero banner */}
      <div className="w-full border-y border-white/20 bg-black/35 px-4 py-2.5 sm:py-3.5 flex flex-col items-center justify-center text-center gap-0.5">
        {mode === "state-to-capital" ? (
          <>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#ffd45e] text-xl sm:text-3xl leading-none">
                ★
              </span>
              <span className="font-headline font-extrabold text-[#ffd45e] text-2xl sm:text-4xl tracking-tight leading-tight">
                {state.capital}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-tight">
              {regionLabel} Region • “{state.nickname}”
            </p>
          </>
        ) : mode === "capital-to-state" ? (
          <>
            <span className="font-headline font-extrabold text-[#5ee8ff] text-2xl sm:text-4xl tracking-tight leading-tight">
              {state.name}
            </span>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-tight">
              {regionLabel} Region • “{state.nickname}”
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <span className="font-headline font-extrabold text-white text-2xl sm:text-4xl tracking-tight leading-tight">
                {state.name}
              </span>
              <span className="text-white/50">•</span>
              <span className="font-headline font-bold text-[#ffd45e] text-xl sm:text-3xl leading-tight">
                ★ {state.capital}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-tight">
              {regionLabel} Region • “{state.nickname}”
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <FlashCardShell
      key={card.id}
      front={primaryContent}
      reveal={detailContent}
      topLeft={outlineToggleButton}
      isFlipped={isFlipped}
      slideDirection={slideDirection}
      backgroundColor={card.color}
      onCardTap={onCardTap}
      onSpeak={handleSpeak}
      speakerAriaLabel="Listen to state and capital"
      className={className}
      showDebugOutlines={showDebugOutlines}
    />
  );
}
