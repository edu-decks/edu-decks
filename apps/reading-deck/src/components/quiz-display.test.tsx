import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuizDisplay } from "./quiz-display";

describe("reading-deck: QuizDisplay", () => {
  it("renders quiz with 4 option cards and handles exit", () => {
    const onExit = vi.fn();

    render(
      <QuizDisplay
        gameMode="letters"
        selectedLetters={["s", "a", "t", "p"]}
        selectedWordLengths={[3]}
        wordDifficulty="easy"
        letterCase="lower"
        optionCount={4}
        onExit={onExit}
      />
    );

    const exitBtn = screen.getByRole("button", { name: /Exit Quiz/i });
    expect(exitBtn).toBeInTheDocument();
    fireEvent.click(exitBtn);
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it("scales word option font sizes relative to card width using container query units", () => {
    const { container } = render(
      <QuizDisplay
        gameMode="words"
        selectedLetters={["f", "e", "d", "b", "i", "t", "u", "g"]}
        selectedWordLengths={[3]}
        wordDifficulty="easy"
        letterCase="lower"
        optionCount={4}
        onExit={vi.fn()}
      />
    );

    const optionButtons = container.querySelectorAll("button.\\[container-type\\:inline-size\\]");
    expect(optionButtons.length).toBe(4);
    optionButtons.forEach((btn) => {
      const style = (btn as HTMLElement).style.fontSize;
      expect(style).toContain("34cqi");
    });
  });
});
