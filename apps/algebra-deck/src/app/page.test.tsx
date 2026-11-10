import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AlgebraDeckPage from "./page";

describe("algebra-deck: AlgebraDeckPage Integration", () => {
  it("renders algebra card, header controls, and session stats", async () => {
    render(<AlgebraDeckPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Select algebra topics and options" })
      ).toBeDefined();
    });
    expect(screen.getByRole("button", { name: "App settings" })).toBeDefined();
    expect(screen.getByText("00:00")).toBeDefined();
  });

  it("opens topic selector with all 4 core topics, complexity tiers, negative toggle, and starts quiz mode", async () => {
    render(<AlgebraDeckPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Select algebra topics and options" })
      ).toBeDefined();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Select algebra topics and options" })
    );

    expect(screen.getByText("Algebra Topics")).toBeDefined();
    expect(screen.getByText("Expressions")).toBeDefined();
    expect(screen.getByText("Linear Equations")).toBeDefined();
    expect(screen.getByText("Inequalities")).toBeDefined();
    expect(screen.getByText("Lines & Slope")).toBeDefined();

    // Complexity options
    expect(screen.getByRole("button", { name: "1-Step" })).toBeDefined();
    expect(screen.getByRole("button", { name: "2-Step" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Multi-Step" })).toBeDefined();

    // Negative numbers toggle
    expect(screen.getByRole("button", { name: "Positive Only" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Include Negatives" })).toBeDefined();

    const startQuizBtn = screen.getByRole("button", { name: /Start Quiz/i });
    fireEvent.click(startQuizBtn);

    expect(screen.getByRole("button", { name: /Exit Quiz/i })).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Toggle negative sign" })
    ).toBeDefined();
  });
});
