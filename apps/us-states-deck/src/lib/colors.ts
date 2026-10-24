import { DECK_COLORS } from "@decks/core";
import type { RegionType, CardMode } from "./types";

export const ALL_REGIONS: RegionType[] = [
  "northeast",
  "southeast",
  "midwest",
  "southwest",
  "west",
];

export const REGION_COLORS: Record<RegionType, string> = {
  northeast: DECK_COLORS.sky.hex,
  southeast: DECK_COLORS.amber.hex,
  midwest: DECK_COLORS.emerald.hex,
  southwest: DECK_COLORS.orange.hex,
  west: DECK_COLORS.purple.hex,
};

export const REGION_LABELS: Record<RegionType, string> = {
  northeast: "Northeast",
  southeast: "Southeast",
  midwest: "Midwest",
  southwest: "Southwest",
  west: "West",
};

export const REGION_COUNTS: Record<RegionType, number> = {
  northeast: 11,
  southeast: 12,
  midwest: 12,
  southwest: 4,
  west: 11,
};

export const ALL_CARD_MODES: CardMode[] = [
  "state-to-capital",
  "capital-to-state",
  "map-to-state",
];

export const CARD_MODE_LABELS: Record<CardMode, string> = {
  "state-to-capital": "State → Capital",
  "capital-to-state": "Capital → State",
  "map-to-state": "Map → State",
};
