import { describe, it, expect } from "vitest";
import { US_STATES } from "../states-data";
import { REGION_COUNTS, ALL_REGIONS } from "../colors";
import { generateStatesCard, generateQuizQuestion } from "../card-generator";

describe("US_STATES data integrity", () => {
  it("contains all 50 US states with valid paths and capital coordinates", () => {
    expect(US_STATES).toHaveLength(50);

    const abbrSet = new Set(US_STATES.map((s) => s.abbr));
    expect(abbrSet.size).toBe(50);

    for (const state of US_STATES) {
      expect(state.name.length).toBeGreaterThan(2);
      expect(state.capital.length).toBeGreaterThan(2);
      expect(state.svgPath.startsWith("M")).toBe(true);
      expect(state.svgPath.endsWith("Z")).toBe(true);
      expect(state.bbox).toHaveLength(4);
      expect(state.capitalCoords).toHaveLength(2);
    }
  });

  it("matches expected region counts across all 5 regions", () => {
    for (const region of ALL_REGIONS) {
      const count = US_STATES.filter((s) => s.region === region).length;
      expect(count).toBe(REGION_COUNTS[region]);
    }
  });
});

describe("generateStatesCard & generateQuizQuestion", () => {
  it("filters by activeRegions and activeModes", () => {
    for (let i = 0; i < 15; i++) {
      const card = generateStatesCard({
        activeRegions: ["southwest"],
        activeModes: ["capital-to-state"],
      });
      expect(card.region).toBe("southwest");
      expect(card.mode).toBe("capital-to-state");
      expect(["AZ", "NM", "OK", "TX"]).toContain(card.state.abbr);
    }
  });

  it("builds valid 4-option multiple choice quiz questions for all 3 modes", () => {
    for (const mode of [
      "state-to-capital",
      "capital-to-state",
      "map-to-state",
    ] as const) {
      const q = generateQuizQuestion({
        activeRegions: ALL_REGIONS,
        activeModes: [mode],
        optionCount: 4,
      });
      expect(q.card.mode).toBe(mode);
      expect(q.options).toHaveLength(4);
      const values = q.options.map((o) => o.value);
      expect(new Set(values).size).toBe(4);
      expect(values).toContain(q.correctValue);
    }
  });
});
