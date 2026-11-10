"use client";

import React from "react";
import { FlashCardShell } from "@decks/core";
import { Lightbulb } from "lucide-react";
import { ProofRow } from "./proof-row";
import { FormattedMathText } from "./ui/formatted-math-text";
import { InteractiveExpressionExplorer } from "./interactive-expression-explorer";
import { InteractiveBalanceExplorer } from "./interactive-balance-explorer";
import {
  InteractiveInequalityExplorer,
  type InequalitySign,
} from "./interactive-inequality-explorer";
import { InteractiveCoordinateExplorer } from "./interactive-coordinate-explorer";
import type { AlgebraCard as AlgebraCardType } from "@/lib/types";
import { cn } from "@/lib/utils";

type AlgebraCardProps = {
  card: AlgebraCardType;
  isFlipped: boolean;
  showHint?: boolean;
  onToggleHint?: () => void;
  slideDirection: "next" | "prev";
  onCardTap?: () => void;
  className?: string;
};

export function AlgebraCard({
  card,
  isFlipped,
  showHint = false,
  onToggleHint,
  slideDirection,
  onCardTap,
  className,
}: AlgebraCardProps) {
  const renderExplorer = () => {
    if (!isFlipped || !card.explorerKind) return null;
    const p = card.explorerProps ?? {};

    switch (card.explorerKind) {
      case "variable-evaluate":
      case "combine-terms":
      case "distributive-area":
        return (
          <InteractiveExpressionExplorer
            mode={card.explorerKind}
            initialA={typeof p.initialA === "number" ? p.initialA : 3}
            initialB={typeof p.initialB === "number" ? p.initialB : 2}
            initialX={typeof p.initialX === "number" ? p.initialX : 4}
          />
        );
      case "balance-one-step":
      case "balance-two-step":
      case "balance-both-sides":
        return (
          <InteractiveBalanceExplorer
            mode={card.explorerKind}
            a={typeof p.a === "number" ? p.a : undefined}
            b={typeof p.b === "number" ? p.b : undefined}
            c={typeof p.c === "number" ? p.c : undefined}
            d={typeof p.d === "number" ? p.d : undefined}
          />
        );
      case "inequality-ray":
        return (
          <InteractiveInequalityExplorer
            initialSign={(p.initialSign as InequalitySign) || ">"}
            initialBoundary={
              typeof p.initialBoundary === "number" ? p.initialBoundary : 2
            }
          />
        );
      case "coordinate-slope":
        return (
          <InteractiveCoordinateExplorer
            initialRise={typeof p.initialRise === "number" ? p.initialRise : 2}
            initialRun={typeof p.initialRun === "number" ? p.initialRun : 1}
            initialB={typeof p.initialB === "number" ? p.initialB : 1}
          />
        );
    }
  };

  // ── Concept / Rule Flashcards ──────────────────────────────────────────────
  if (card.cardType === "concept") {
    return (
      <FlashCardShell
        key={card.id}
        isFlipped={isFlipped}
        slideDirection={slideDirection}
        backgroundColor={card.color}
        className={cn("w-[90vw] max-w-[700px] border-none", className)}
        onCardTap={onCardTap}
        frontContent={
          <div
            className={cn(
              "flex flex-col items-center justify-center px-6 gap-0.5 transition-all duration-300",
              isFlipped ? "py-1.5 sm:py-2" : "py-4"
            )}
          >
            <span
              className={cn(
                "font-headline font-bold text-white text-center leading-tight text-balance transition-all",
                isFlipped
                  ? "text-xl sm:text-2xl md:text-3xl"
                  : "text-2xl sm:text-3xl md:text-4xl"
              )}
            >
              {card.frontLabel}
            </span>
            <span
              className={cn(
                "italic text-white/60 text-center text-xl sm:text-2xl block overflow-hidden transition-all duration-500 ease-in-out",
                isFlipped ? "max-h-0 opacity-0" : "max-h-[60px] opacity-100"
              )}
            >
              {card.frontPrompt}
            </span>
          </div>
        }
        revealContent={
          <div className="min-h-0 overflow-y-auto flex flex-col gap-1 items-center w-full pt-0 pb-1">
            {card.backDefinition && (
              <div className="w-full px-4 py-2 my-0.5 bg-black/35 border-y border-white/20 flex flex-col items-center justify-center gap-0.5">
                <p className="text-white text-center font-bold leading-tight text-xl sm:text-2xl md:text-3xl shrink-0 tracking-wide">
                  <FormattedMathText text={card.backDefinition} />
                </p>
                {card.backDefinitionSubtitle && (
                  <p className="text-white/80 text-center font-medium text-xs sm:text-sm tracking-wide leading-tight pt-0.5">
                    <FormattedMathText text={card.backDefinitionSubtitle} />
                  </p>
                )}
              </div>
            )}
            {renderExplorer()}
          </div>
        }
      />
    );
  }

  // ── Solve & Practice Cards ─────────────────────────────────────────────────
  const steps = card.backSteps ?? [];

  return (
    <FlashCardShell
      key={card.id}
      isFlipped={isFlipped}
      slideDirection={slideDirection}
      backgroundColor={card.color}
      className={cn("w-[90vw] max-w-[700px] border-none", className)}
      onCardTap={onCardTap}
      frontContent={
        <div className="flex flex-col items-center justify-center gap-2.5 px-4 w-full">
          {card.frontPrompt && (
            <p
              className={cn(
                "font-bold text-white/90 text-center leading-tight tracking-wide transition-all",
                isFlipped
                  ? "text-base sm:text-lg md:text-xl"
                  : "text-lg sm:text-xl md:text-2xl"
              )}
            >
              <FormattedMathText text={card.frontPrompt} />
            </p>
          )}

          {card.frontEquation && (
            <div
              className={cn(
                "px-6 py-2.5 rounded-2xl bg-black/35 border border-white/20 font-mono font-extrabold text-white tracking-wider shadow-sm transition-all",
                isFlipped
                  ? "text-xl sm:text-2xl py-1.5"
                  : "text-3xl sm:text-4xl md:text-5xl"
              )}
            >
              <FormattedMathText text={card.frontEquation} />
            </div>
          )}

          {/* Strategy Hint Pill on Unflipped Practice Cards */}
          {!isFlipped && card.frontHint && (
            <div
              className="flex flex-col items-center gap-1.5 mt-1"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onToggleHint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-headline font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all active:scale-95"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
                <span>{showHint ? "Hide Strategy Hint" : "Strategy Hint"}</span>
              </button>
              {showHint && (
                <p className="max-w-md text-center text-xs sm:text-sm text-white/90 bg-black/40 border border-white/20 rounded-xl px-3.5 py-2 animate-fade-in">
                  {card.frontHint}
                </p>
              )}
            </div>
          )}
        </div>
      }
      revealContent={
        <div className="proof-table-container w-full flex flex-col items-center justify-center gap-2 overflow-y-auto pb-1">
          <div className="proof-table-banner w-full bg-black/35 border-y border-white/20 px-4 sm:px-6 py-1.5 divide-y divide-white/10">
            {steps.map((step, i) => (
              <ProofRow
                key={i}
                tokens={step.equationTokens ?? null}
                formulaLine={step.formulaLine ?? null}
                reason={step.reason ?? ""}
                isAnswer={i === steps.length - 1}
              />
            ))}
          </div>
          {renderExplorer()}
        </div>
      }
    />
  );
}
