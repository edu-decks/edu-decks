"use client";

import { RegionType, CardMode } from "@/lib/types";
import {
  ALL_REGIONS,
  REGION_COLORS,
  REGION_LABELS,
  REGION_COUNTS,
  ALL_CARD_MODES,
} from "@/lib/colors";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GraduationCap, Check, X } from "lucide-react";
import { SettingsToggle } from "@decks/core";
import { cn } from "@/lib/utils";

const SHORT_MODE_LABELS: Record<CardMode, string> = {
  "state-to-capital": "State → Capital",
  "capital-to-state": "Capital → State",
  "map-to-state": "Map → State",
};

type TopicSelectorProps = {
  activeRegions: RegionType[];
  onRegionToggle: (region: RegionType) => void;
  onRegionSelectExclusive?: (region: RegionType) => void;
  onSelectAllRegions?: () => void;
  activeModes: CardMode[];
  onModeToggle: (mode: CardMode) => void;
  onModeSelectExclusive?: (mode: CardMode) => void;
  showStateOutline: boolean;
  onShowStateOutlineChange: (show: boolean) => void;
  quizOptionCount: number;
  onQuizOptionCountChange: (count: number) => void;
  onStartQuiz?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TopicSelector({
  activeRegions,
  onRegionToggle,
  onRegionSelectExclusive,
  onSelectAllRegions,
  activeModes,
  onModeToggle,
  onModeSelectExclusive,
  showStateOutline,
  onShowStateOutlineChange,
  quizOptionCount,
  onQuizOptionCountChange,
  onStartQuiz,
  open,
  onOpenChange,
}: TopicSelectorProps) {
  const allRegionsSelected = activeRegions.length === ALL_REGIONS.length;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id="topic-selector-trigger"
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs active:scale-95 transition-transform"
          aria-label="Select regions and modes"
        >
          <GraduationCap className="h-6 w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mobile-fullscreen [@media(max-width:640px)]:!z-50 [@media(max-width:640px)]:!w-screen [@media(max-width:640px)]:!h-[100dvh] [@media(max-width:640px)]:!max-w-none [@media(max-width:640px)]:!m-0 [@media(max-width:640px)]:!rounded-none [@media(max-width:640px)]:!border-none sm:w-[400px] sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:border bg-background p-0 flex flex-col"
        align="end"
        sideOffset={8}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* Mobile sticky header with close button */}
        <div className="flex items-center justify-end p-4 border-b sm:hidden sticky top-0 bg-background z-10">
          <h4 className="font-medium font-headline text-lg mr-auto">
            US States Deck
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

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* US Regions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium leading-none font-headline text-lg">
                Regions
              </h4>
              {!allRegionsSelected && onSelectAllRegions && (
                <button
                  type="button"
                  onClick={onSelectAllRegions}
                  className="text-xs font-headline font-bold text-primary hover:underline"
                >
                  Select All
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {ALL_REGIONS.map((region) => {
                const isActive = activeRegions.includes(region);
                const label = REGION_LABELS[region];
                const count = REGION_COUNTS[region];
                const regionColor = REGION_COLORS[region];

                return (
                  <div
                    key={region}
                    className={cn(
                      "h-12 rounded-xl flex items-center justify-between gap-2 pl-2.5 pr-2.5 transition-all select-none border group cursor-pointer",
                      isActive
                        ? "text-white shadow-sm border-transparent"
                        : "text-muted-foreground border-border bg-card hover:bg-accent hover:text-accent-foreground"
                    )}
                    style={{
                      backgroundColor: isActive ? regionColor : undefined,
                    }}
                    onClick={() => {
                      if (onRegionSelectExclusive) {
                        onRegionSelectExclusive(region);
                      } else {
                        onRegionToggle(region);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onRegionSelectExclusive) {
                          onRegionSelectExclusive(region);
                        } else {
                          onRegionToggle(region);
                        }
                      }
                    }}
                  >
                    {/* Checkbox */}
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
                        onRegionToggle(region);
                      }}
                      aria-label={`${isActive ? "Deselect" : "Select"} ${label}`}
                    >
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>

                    {/* Label */}
                    <div className="flex-1 min-w-0 py-1">
                      <span className="font-headline font-bold text-xs sm:text-sm truncate block">
                        {label}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "text-[11px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card Types — multi-select checkbox tiles matching Regions */}
          <div>
            <h4 className="font-medium leading-none font-headline text-lg mb-4">
              Card Types
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {ALL_CARD_MODES.map((mode) => {
                const isActive = activeModes.includes(mode);
                const label = SHORT_MODE_LABELS[mode];
                return (
                  <div
                    key={mode}
                    id={`card-mode-${mode}`}
                    className={cn(
                      "h-12 rounded-xl flex items-center justify-between gap-2 pl-2.5 pr-2.5 transition-all select-none border group cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm border-transparent"
                        : "text-muted-foreground border-border bg-card hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => {
                      if (onModeSelectExclusive) {
                        onModeSelectExclusive(mode);
                      } else {
                        onModeToggle(mode);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (onModeSelectExclusive) {
                          onModeSelectExclusive(mode);
                        } else {
                          onModeToggle(mode);
                        }
                      }
                    }}
                  >
                    {/* Checkbox */}
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
                        onModeToggle(mode);
                      }}
                      aria-label={`${isActive ? "Deselect" : "Select"} ${label}`}
                    >
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                      )}
                    </button>

                    {/* Label */}
                    <div className="flex-1 min-w-0 py-1">
                      <span className="font-headline font-bold text-xs sm:text-sm truncate block">
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Show State Outline — standard @decks/core SettingsToggle */}
          <SettingsToggle
            id="toggle-state-outline"
            label="Show State Outline"
            checked={showStateOutline}
            onCheckedChange={onShowStateOutlineChange}
          />

          {/* Quiz Launch & Option Count */}
          {onStartQuiz && (
            <div className="pt-4 border-t space-y-4">
              <div>
                <h4 className="font-medium leading-none font-headline text-lg mb-3">
                  Quiz Cards
                </h4>
                <div className="flex items-center gap-1.5 rounded-full p-1 bg-muted">
                  {[4, 6, 8].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant={quizOptionCount === count ? "default" : "ghost"}
                      className="rounded-full w-full font-headline font-bold text-sm h-10"
                      onClick={() => onQuizOptionCountChange(count)}
                    >
                      {count} cards
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="default"
                className="w-full h-14 rounded-2xl text-lg font-bold font-headline bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 transition-transform"
                onClick={() => {
                  onOpenChange?.(false);
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
