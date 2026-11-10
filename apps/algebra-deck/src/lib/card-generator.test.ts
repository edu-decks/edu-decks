import { describe, it, expect } from "vitest";
import { generateAlgebraCard, CONCEPT_CARDS } from "./card-generator";
import type { TopicType, ComplexityTier } from "./types";

describe("algebra-deck: generateAlgebraCard", () => {
  const topics: TopicType[] = [
    "expressions",
    "equations",
    "inequalities",
    "graphing",
  ];
  const complexities: ComplexityTier[] = ["1-step", "2-step", "multi-step"];

  it("includes concept cards for all 4 Phase 1 topics", () => {
    for (const topic of topics) {
      const matching = CONCEPT_CARDS.filter((c) => c.topic === topic);
      expect(matching.length).toBeGreaterThanOrEqual(3);
      for (const card of matching) {
        expect(card.explorerKind).toBeDefined();
        expect(card.backDefinition).toBeDefined();
      }
    }
  });

  it("generates valid practice cards across all topics, complexity tiers, and sign modes", () => {
    for (const topic of topics) {
      for (const complexity of complexities) {
        for (const includeNegatives of [false, true]) {
          const card = generateAlgebraCard({
            activeTopics: [topic],
            activeCardTypes: ["practice"],
            complexity,
            includeNegatives,
          });
          expect(card.topic).toBe(topic);
          expect(card.cardType).toBe("practice");
          expect(card.complexity).toBe(complexity);
          expect(typeof card.numericAnswer).toBe("number");
          expect(Number.isInteger(card.numericAnswer)).toBe(true);
          expect(card.backSteps && card.backSteps.length).toBeGreaterThanOrEqual(2);
          if (!includeNegatives) {
            expect(card.numericAnswer!).toBeGreaterThanOrEqual(0);
          }
        }
      }
    }
  });
});
