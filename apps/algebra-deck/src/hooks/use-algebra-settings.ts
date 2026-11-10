import { useLocalStorage } from "@decks/core";
import type { TopicType, CardType, ComplexityTier } from "@/lib/types";

const ALL_TOPICS: TopicType[] = [
  "expressions",
  "equations",
  "inequalities",
  "graphing",
];

export function useAlgebraSettings() {
  const [rawTopics, setActiveTopics] = useLocalStorage<TopicType[]>(
    "algebra-deck-topics",
    ALL_TOPICS
  );
  const activeTopics = rawTopics.filter((t) => ALL_TOPICS.includes(t));
  const safeActiveTopics: TopicType[] =
    activeTopics.length > 0 ? activeTopics : ALL_TOPICS;

  const [rawCardTypes, setActiveCardTypes] = useLocalStorage<CardType[]>(
    "algebra-deck-card-types",
    ["concept", "practice"]
  );
  const activeCardTypes = rawCardTypes.filter(
    (t) => t === "concept" || t === "practice"
  );
  const safeActiveCardTypes: CardType[] =
    activeCardTypes.length > 0 ? activeCardTypes : ["concept", "practice"];

  const [complexity, setComplexity] = useLocalStorage<ComplexityTier>(
    "algebra-deck-complexity",
    "1-step"
  );

  const [includeNegatives, setIncludeNegatives] = useLocalStorage<boolean>(
    "algebra-deck-include-negatives",
    false
  );

  const [showCardCount, setShowCardCount] = useLocalStorage<boolean>(
    "algebra-deck-show-card-count",
    true
  );
  const [showTimer, setShowTimer] = useLocalStorage<boolean>(
    "algebra-deck-show-timer",
    true
  );
  const [autoPlayAudio, setAutoPlayAudio] = useLocalStorage<boolean>(
    "algebra-deck-autoplay-audio",
    false
  );
  const [keepScreenAwake, setKeepScreenAwake] = useLocalStorage<boolean>(
    "algebra-deck-keep-awake",
    true
  );
  const [isLocked, setIsLocked] = useLocalStorage<boolean>(
    "algebra-deck-locked",
    false
  );

  function handleTopicToggle(topic: TopicType) {
    if (safeActiveTopics.includes(topic)) {
      if (safeActiveTopics.length === 1) return;
      setActiveTopics(safeActiveTopics.filter((t) => t !== topic));
    } else {
      setActiveTopics([...safeActiveTopics, topic]);
    }
  }

  function handleTopicSelectExclusive(topic: TopicType) {
    setActiveTopics([topic]);
  }

  function handleCardTypeToggle(type: CardType) {
    if (safeActiveCardTypes.includes(type)) {
      if (safeActiveCardTypes.length === 1) return;
      setActiveCardTypes(safeActiveCardTypes.filter((t) => t !== type));
    } else {
      setActiveCardTypes([...safeActiveCardTypes, type]);
    }
  }

  return {
    activeTopics: safeActiveTopics,
    handleTopicToggle,
    handleTopicSelectExclusive,
    activeCardTypes: safeActiveCardTypes,
    handleCardTypeToggle,
    complexity,
    setComplexity,
    includeNegatives,
    setIncludeNegatives,
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
