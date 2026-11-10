import { describe, it, expect } from "vitest";
import { gcd, lcm, getRoundedRectPath, canShowVisualDiagram } from "./visual-utils";
import { MathProblem } from "@/lib/types";

describe("arithmetic-deck: visual-utils", () => {
  describe("gcd & lcm", () => {
    it("calculates greatest common divisor", () => {
      expect(gcd(12, 18)).toBe(6);
      expect(gcd(7, 13)).toBe(1);
      expect(gcd(24, 60)).toBe(12);
    });

    it("calculates least common multiple", () => {
      expect(lcm(4, 6)).toBe(12);
      expect(lcm(3, 5)).toBe(15);
      expect(lcm(2, 8)).toBe(8);
    });
  });

  describe("getRoundedRectPath", () => {
    it("generates valid SVG path data string", () => {
      const path = getRoundedRectPath(0, 0, 100, 50, 4, 4, 4, 4);
      expect(path).toContain("M");
      expect(path).toContain("A");
      expect(path).toContain("Z");
    });
  });

  describe("canShowVisualDiagram", () => {
    it("returns true for small/medium improper fractions and false when numbers are too high", () => {
      const baseProblem: MathProblem = {
        id: "p1",
        num1: 5,
        num2: 3,
        operation: "+",
        answer: 2,
        displayText: "5/4 + 3/4",
        answerText: "2",
        problemSpeechText: "",
        answerSpeechText: "",
        fullSpeechText: "",
        speechText: "",
        isFraction: true,
        frac1: { n: 5, d: 4 },
        frac2: { n: 3, d: 4 },
        fracAnswer: { n: 2, d: 1 },
      };

      expect(canShowVisualDiagram(baseProblem)).toBe(true);

      // Too many pies (> 4 pies)
      expect(
        canShowVisualDiagram({
          ...baseProblem,
          frac1: { n: 15, d: 4 },
          frac2: { n: 11, d: 4 },
        })
      ).toBe(false);

      // Common denominator / slice count too high (> 36 slices)
      expect(
        canShowVisualDiagram({
          ...baseProblem,
          frac1: { n: 15, d: 8 },
          frac2: { n: 23, d: 12 },
        })
      ).toBe(false);

      // Multiplication with improper fraction (> 1) hides single-unit-grid diagram
      expect(
        canShowVisualDiagram({
          ...baseProblem,
          operation: "×",
          frac1: { n: 5, d: 4 },
          frac2: { n: 1, d: 2 },
        })
      ).toBe(false);
    });
  });
});
