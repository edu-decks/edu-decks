// ── Topic, Card Type & Difficulty Taxonomy ───────────────────────────────────

export type TopicType =
  | "expressions"
  | "equations"
  | "inequalities"
  | "graphing";

export type CardType = "concept" | "practice";

export type ComplexityTier = "1-step" | "2-step" | "multi-step";

export type ExplorerKind =
  | "variable-evaluate"
  | "combine-terms"
  | "distributive-area"
  | "balance-one-step"
  | "balance-two-step"
  | "balance-both-sides"
  | "inequality-ray"
  | "coordinate-slope";

// ── Proof Steps ──────────────────────────────────────────────────────────────

export type EquationToken = {
  id: string;
  value: string;
  dim?: boolean;
  color?: string;
};

export type AnimationStep = {
  equationTokens?: EquationToken[];
  formulaLine?: string;
  reason?: string;
  speechText?: string;
};

// ── Algebra Card ─────────────────────────────────────────────────────────────

export type AlgebraCard = {
  id: string;
  topic: TopicType;
  cardType: CardType;
  complexity: ComplexityTier;

  // Front face
  frontLabel?: string;
  frontPrompt?: string;
  frontEquation?: string;
  frontHint?: string;
  frontSpeechText: string;

  // Back face (revealed on flip)
  backDefinition?: string;
  backDefinitionSubtitle?: string;
  explorerKind?: ExplorerKind;
  explorerProps?: Record<string, number | string | boolean>;
  backSteps?: AnimationStep[];
  backSpeechText: string;

  // Quiz & numeric validation
  numericAnswer?: number;
  answerPrefix?: string;

  /** Hex color string from TOPIC_COLORS */
  color: string;
};
