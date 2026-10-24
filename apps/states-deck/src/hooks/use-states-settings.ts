import { useLocalStorage } from "@decks/core";
import { ALL_REGIONS, ALL_CARD_MODES } from "@/lib/colors";
import type { RegionType, CardMode } from "@/lib/types";

/**
 * Persists all states-deck user preferences via localStorage.
 */
export function useStatesSettings() {
  const [rawActiveRegions, setActiveRegions] = useLocalStorage<RegionType[]>(
    "states-deck-regions",
    ALL_REGIONS
  );
  const validRegions = rawActiveRegions.filter((r) => ALL_REGIONS.includes(r));
  const activeRegions: RegionType[] =
    validRegions.length > 0 ? validRegions : ALL_REGIONS;

  const [rawActiveModes, setActiveModes] = useLocalStorage<CardMode[]>(
    "states-deck-modes",
    ["state-to-capital", "capital-to-state"]
  );
  const validModes = rawActiveModes.filter((m) => ALL_CARD_MODES.includes(m));
  const activeModes: CardMode[] =
    validModes.length > 0 ? validModes : ["state-to-capital"];

  const [showStateOutline, setShowStateOutline] = useLocalStorage<boolean>(
    "states-deck-show-outline",
    true
  );

  const [quizOptionCount, setQuizOptionCount] = useLocalStorage<number>(
    "states-deck-quiz-options-v2",
    8
  );

  const [showCardCount, setShowCardCount] = useLocalStorage<boolean>(
    "states-deck-show-card-count",
    true
  );
  const [showTimer, setShowTimer] = useLocalStorage<boolean>(
    "states-deck-show-timer",
    true
  );
  const [autoPlayAudio, setAutoPlayAudio] = useLocalStorage<boolean>(
    "states-deck-autoplay-audio",
    false
  );
  const [keepScreenAwake, setKeepScreenAwake] = useLocalStorage<boolean>(
    "states-deck-keep-awake",
    true
  );
  const [isLocked, setIsLocked] = useLocalStorage<boolean>(
    "states-deck-locked",
    false
  );

  function handleRegionToggle(region: RegionType) {
    if (activeRegions.includes(region)) {
      if (activeRegions.length === 1) return;
      setActiveRegions(activeRegions.filter((r) => r !== region));
    } else {
      setActiveRegions([...activeRegions, region]);
    }
  }

  function handleRegionSelectExclusive(region: RegionType) {
    setActiveRegions([region]);
  }

  function handleSelectAllRegions() {
    setActiveRegions(ALL_REGIONS);
  }

  function handleModeToggle(mode: CardMode) {
    if (activeModes.includes(mode)) {
      if (activeModes.length === 1) return;
      setActiveModes(activeModes.filter((m) => m !== mode));
    } else {
      setActiveModes([...activeModes, mode]);
    }
  }

  function handleModeSelectExclusive(mode: CardMode) {
    setActiveModes([mode]);
  }

  return {
    activeRegions,
    handleRegionToggle,
    handleRegionSelectExclusive,
    handleSelectAllRegions,
    activeModes,
    handleModeToggle,
    handleModeSelectExclusive,
    showStateOutline,
    setShowStateOutline,
    quizOptionCount,
    setQuizOptionCount,
    showCardCount,
    setShowCardCount,
    showTimer,
    setShowTimer,
    autoPlayAudio,
    setAutoPlayAudio,
    keepScreenAwake,
    setKeepScreenAwake,
    isLocked,
    setIsLocked,
  };
}
