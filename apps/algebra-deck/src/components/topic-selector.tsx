"use client";

import type { TopicType, CardType, ComplexityTier } from "@/lib/types";
import { TOPIC_LABELS, TOPIC_BADGES } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GraduationCap, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_TOPICS: TopicType[] = [
  "expressions",
  "equations",
  "inequalities",
  "graphing",
];

const CARD_TYPES: { type: CardType; label: string }[] = [
  { type: "concept", label: "Concepts & Rules" },
  { type: "practice", label: "Solve & Practice" },
];

const COMPLEXITY_TIERS: { value: ComplexityTier; label: string }[] = [
  { value: "1-step", label: "1-Step" },
  { value: "2-step", label: "2-Step" },
  { value: "multi-step", label: "Multi-Step" },
];

type TopicSelectorProps = {
  activeTopics: TopicType[];
  onTopicToggle: (topic: TopicType) => void;
  onTopicSelectExclusive?: (topic: TopicType) => void;
  activeCardTypes: CardType[];
  onCardTypeToggle: (type: CardType) => void;
  complexity: ComplexityTier;
  onComplexityChange: (tier: ComplexityTier) => void;
  includeNegatives: boolean;
  onIncludeNegativesChange: (include: boolean) => void;
  onStartQuiz?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TopicSelector({
  activeTopics,
  onTopicToggle,
  onTopicSelectExclusive,
  activeCardTypes,
  onCardTypeToggle,
  complexity,
  onComplexityChange,
  includeNegatives,
  onIncludeNegativesChange,
  onStartQuiz,
  open,
  onOpenChange,
}: TopicSelectorProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id="topic-selector-trigger"
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs active:scale-95 transition-transform"
          aria-label="Select algebra topics and options"
        >
          <GraduationCap className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mobile-fullscreen [@media(max-width:640px)]:!z-50 [@media(max-width:640px)]:!w-screen [@media(max-width:640px)]:!h-[100dvh] [@media(max-width:640px)]:!max-w-none [@media(max-width:640px)]:!m-0 [@media(max-width:640px)]:!rounded-none [@media(max-width:640px)]:!border-none sm:w-[390px] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:border bg-background p-0 flex flex-col"
        align="end"
        sideOffset={8}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Mobile sticky header */}
        <div className="flex items-center justify-end p-4 border-b sm:hidden sticky top-0 bg-background z-10">
          <h4 className="font-medium font-headline text-lg mr-auto">
            Algebra Deck
          </h4>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 1. Topics (2x2 Grid) */}
          <div>
            <h4 className="font-medium leading-none font-headline text-lg mb-3">
              Algebra Topics
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {ALL_TOPICS.map((topic) => {
                const isActive = activeTopics.includes(topic);
                const label = TOPIC_LABELS[topic];
                const badge = TOPIC_BADGES[topic];

                return (
                  <div
                    key={topic}
                    className={cn(
                      "h-12 rounded-xl flex items-center justify-between gap-2 pl-2.5 pr-2 transition-all select-none border group cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm border-transparent"
                        : "text-muted-foreground border-border bg-card hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => {
                      if (onTopicSelectExclusive) {
                        onTopicSelectExclusive(topic);
                      } else {
                        onTopicToggle(topic);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onTopicSelectExclusive) {
                          onTopicSelectExclusive(topic);
                        } else {
                          onTopicToggle(topic);
                        }
                      }
                    }}
                  >
                    {/* Multi-select Checkbox */}
                    <button
                      type="button"
                      className={cn(
                        "w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 outline-none",
                        isActive
                          ? "bg-white text-black border-white shadow-xs"
                          : "border-muted-foreground/40 hover:border-foreground/80 bg-background/50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTopicToggle(topic);
                      }}
                      aria-label={`${isActive ? "Deselect" : "Select"} ${label}`}
                    >
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>

                    {/* Topic Label */}
                    <div className="flex-1 min-w-0 py-1">
                      <span className="font-headline font-bold text-xs sm:text-sm truncate block">
                        {label}
                      </span>
                    </div>

                    {/* Topic Symbol Badge */}
                    <span
                      className={cn(
                        "px-1.5 h-6 rounded-lg font-mono font-black flex items-center justify-center text-xs shrink-0 transition-colors",
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-muted text-foreground/80 group-hover:bg-accent-foreground/10"
                      )}
                    >
                      {badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Card Types */}
          <div>
            <h4 className="font-medium leading-none font-headline text-lg mb-2.5">
              Card Types
            </h4>
            <div className="flex items-center gap-2 rounded-2xl p-1 bg-muted">
              {CARD_TYPES.map(({ type, label }) => {
                const isActive = activeCardTypes.includes(type);
                return (
                  <Button
                    key={type}
                    id={`card-type-${type}`}
                    type="button"
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "flex-1 rounded-xl font-headline font-bold h-10 text-xs w-full transition-all",
                      isActive ? "shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => onCardTypeToggle(type)}
                    aria-pressed={isActive}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 3. Complexity Tier */}
          <div>
            <h4 className="font-medium leading-none font-headline text-lg mb-2.5">
              Complexity
            </h4>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl p-1 bg-muted">
              {COMPLEXITY_TIERS.map(({ value, label }) => {
                const isSelected = complexity === value;
                return (
                  <Button
                    key={value}
                    type="button"
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "rounded-xl font-headline font-bold h-9 text-xs px-2 transition-all",
                      isSelected ? "shadow-sm" : "text-muted-foreground"
                    )}
                    onClick={() => onComplexityChange(value)}
                    aria-pressed={isSelected}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 4. Negative Numbers Toggle */}
          <div>
            <h4 className="font-medium leading-none font-headline text-lg mb-2.5">
              Numbers
            </h4>
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl p-1 bg-muted">
              <Button
                type="button"
                variant={!includeNegatives ? "default" : "ghost"}
                className={cn(
                  "rounded-xl font-headline font-bold h-9 text-xs transition-all",
                  !includeNegatives ? "shadow-sm" : "text-muted-foreground"
                )}
                onClick={() => onIncludeNegativesChange(false)}
                aria-pressed={!includeNegatives}
              >
                Positive Only
              </Button>
              <Button
                type="button"
                variant={includeNegatives ? "default" : "ghost"}
                className={cn(
                  "rounded-xl font-headline font-bold h-9 text-xs transition-all",
                  includeNegatives ? "shadow-sm" : "text-muted-foreground"
                )}
                onClick={() => onIncludeNegativesChange(true)}
                aria-pressed={includeNegatives}
              >
                Include Negatives
              </Button>
            </div>
          </div>

          {/* 5. Start Quiz Button */}
          {onStartQuiz && (
            <div className="pt-3 border-t">
              <Button
                variant="default"
                className="w-full h-14 rounded-2xl text-lg font-bold font-headline bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-transform"
                onClick={() => {
                  onOpenChange(false);
                  onStartQuiz();
                }}
              >
                Start Quiz
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
