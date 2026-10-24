import { US_STATES } from "./states-data";
import { REGION_COLORS, ALL_REGIONS, ALL_CARD_MODES } from "./colors";
import type { RegionType, CardMode, StateData, StatesCard } from "./types";

let recentStateAbbrs: string[] = [];
let cardCounter = 0;

export interface GenerateStatesCardOptions {
  activeRegions: RegionType[];
  activeModes: CardMode[];
}

export function buildStatesCard(state: StateData, mode: CardMode): StatesCard {
  cardCounter += 1;
  const color = REGION_COLORS[state.region];

  let frontSpeechText = state.name;
  let backSpeechText = `${state.capital} is the capital of ${state.name}.`;

  if (mode === "state-to-capital") {
    frontSpeechText = `What is the capital of ${state.name}?`;
    backSpeechText = `${state.capital}. ${state.capital} is the capital of ${state.name}.`;
  } else if (mode === "capital-to-state") {
    frontSpeechText = `${state.capital} is the capital of which state?`;
    backSpeechText = `${state.name}. ${state.capital} is the capital of ${state.name}.`;
  } else if (mode === "map-to-state") {
    frontSpeechText = "Which state is highlighted on the map?";
    backSpeechText = `${state.name}. The capital of ${state.name} is ${state.capital}.`;
  }

  return {
    id: `state-card-${state.abbr}-${mode}-${cardCounter}`,
    state,
    mode,
    region: state.region,
    color,
    frontSpeechText,
    backSpeechText,
  };
}

export function generateStatesCard({
  activeRegions,
  activeModes,
}: GenerateStatesCardOptions): StatesCard {
  const regions = activeRegions.length > 0 ? activeRegions : ALL_REGIONS;
  const modes = activeModes.length > 0 ? activeModes : ALL_CARD_MODES;

  const pool = US_STATES.filter((s) => regions.includes(s.region));
  const effectivePool = pool.length > 0 ? pool : US_STATES;

  // Avoid repeating recently shown states until most of the pool has been seen
  const maxRecent = Math.max(1, Math.min(effectivePool.length - 1, 12));
  const unseen = effectivePool.filter((s) => !recentStateAbbrs.includes(s.abbr));
  const candidates = unseen.length > 0 ? unseen : effectivePool;

  const chosenState = candidates[Math.floor(Math.random() * candidates.length)];
  const chosenMode = modes[Math.floor(Math.random() * modes.length)];

  recentStateAbbrs = [
    chosenState.abbr,
    ...recentStateAbbrs.filter((a) => a !== chosenState.abbr),
  ].slice(0, maxRecent);

  return buildStatesCard(chosenState, chosenMode);
}

export interface QuizOption {
  value: string;
  label: string;
  sublabel?: string;
}

export interface StatesQuizQuestion {
  card: StatesCard;
  promptTitle: string;
  promptSubtitle: string;
  correctValue: string;
  options: QuizOption[];
}

export function generateQuizQuestion({
  activeRegions,
  activeModes,
  optionCount = 4,
}: GenerateStatesCardOptions & { optionCount?: number }): StatesQuizQuestion {
  const card = generateStatesCard({ activeRegions, activeModes });
  const { state, mode } = card;

  const regions = activeRegions.length > 0 ? activeRegions : ALL_REGIONS;
  const regionalStates = US_STATES.filter(
    (s) => regions.includes(s.region) && s.abbr !== state.abbr
  );
  const otherStates = US_STATES.filter(
    (s) => !regions.includes(s.region) && s.abbr !== state.abbr
  );

  const shuffledRegional = [...regionalStates].sort(() => Math.random() - 0.5);
  const shuffledOther = [...otherStates].sort(() => Math.random() - 0.5);
  const distractorStates = [...shuffledRegional, ...shuffledOther].slice(
    0,
    Math.max(1, optionCount - 1)
  );

  const allChoiceStates = [state, ...distractorStates].sort(
    () => Math.random() - 0.5
  );

  if (mode === "state-to-capital") {
    return {
      card,
      promptTitle: state.name,
      promptSubtitle: "What is the capital city?",
      correctValue: state.capital,
      options: allChoiceStates.map((s) => ({
        value: s.capital,
        label: s.capital,
      })),
    };
  }

  if (mode === "capital-to-state") {
    return {
      card,
      promptTitle: state.capital,
      promptSubtitle: "Which state has this capital?",
      correctValue: state.name,
      options: allChoiceStates.map((s) => ({
        value: s.name,
        label: s.name,
      })),
    };
  }

  // map-to-state
  return {
    card,
    promptTitle: "Mystery State",
    promptSubtitle: "Which state is shown?",
    correctValue: state.name,
    options: allChoiceStates.map((s) => ({
      value: s.name,
      label: s.name,
    })),
  };
}
