import { useState, useEffect, useCallback, useRef } from "react";
import {
  MathOperation,
  MathProblem,
  Fraction,
  FractionDenominatorMode,
  FractionMaxDenominator,
  FractionValueType,
} from "@/lib/types";
import { generateMathProblem } from "@/lib/math-generator";

export function parseFractionValue(str: string): number | null {
  const trimmed = str.trim();
  if (!trimmed) return null;

  // Check for mixed number format: "W N/D"
  const spaceParts = trimmed.split(/\s+/);
  if (spaceParts.length === 2) {
    const w = parseFloat(spaceParts[0]);
    const fracParts = spaceParts[1].split("/");
    if (fracParts.length === 2 && fracParts[0] && fracParts[1]) {
      const n = parseFloat(fracParts[0]);
      const d = parseFloat(fracParts[1]);
      if (!isNaN(w) && !isNaN(n) && !isNaN(d) && d !== 0 && n >= 0) {
        return w < 0 ? w - n / d : w + n / d;
      }
    }
    return null;
  }

  const parts = trimmed.split("/");
  if (parts.length === 1) {
    const val = parseFloat(parts[0]);
    return isNaN(val) ? null : val;
  }
  if (parts.length === 2) {
    if (!parts[0] || !parts[1]) return null;
    const n = parseFloat(parts[0]);
    const d = parseFloat(parts[1]);
    if (isNaN(n) || isNaN(d) || d === 0) return null;
    return n / d;
  }
  return null;
}

export function stringToFraction(str: string): Fraction | null {
  const trimmed = str.trim();
  const spaceParts = trimmed.split(/\s+/);
  if (spaceParts.length === 2) {
    const w = parseInt(spaceParts[0], 10);
    const fracParts = spaceParts[1].split("/");
    if (fracParts.length === 2) {
      const n = parseInt(fracParts[0], 10);
      const d = parseInt(fracParts[1], 10);
      if (!isNaN(w) && !isNaN(n) && !isNaN(d) && d > 0 && n >= 0) {
        const sign = w < 0 ? -1 : 1;
        return { n: sign * (Math.abs(w) * d + n), d };
      }
    }
    return null;
  }

  const parts = trimmed.split("/");
  if (parts.length === 2) {
    const n = parseInt(parts[0], 10);
    const d = parseInt(parts[1], 10);
    if (!isNaN(n) && !isNaN(d) && d > 0) {
      return { n, d };
    }
  }
  return null;
}

function buildCombinedFractionInput(
  whole: string,
  num: string,
  den: string,
  slot: "whole" | "numerator" | "denominator"
): string {
  if (whole && num && den) {
    return `${whole} ${num}/${den}`;
  }
  if (!whole && num && den) {
    return `${num}/${den}`;
  }
  if (whole && num && !den) {
    return `${whole}/${num}`;
  }
  if (whole && !num && !den) {
    return slot === "numerator" ? `${whole}/` : whole;
  }
  if (!whole && num && !den) {
    return slot === "denominator" ? `${num}/` : num;
  }
  if (!whole && !num && den) {
    return `0/${den}`;
  }
  return "";
}

type UseQuizSessionOptions = {
  activeOperations: MathOperation[];
  minRange: number;
  maxRange: number;
  showWholeNumbers?: boolean;
  showFractions?: boolean;
  fractionDenominatorMode?: FractionDenominatorMode;
  fractionMaxDenominator?: FractionMaxDenominator;
  fractionValueType?: FractionValueType;
  autoPlayAudio: boolean;
  onSpeak: (text: string, onEnd?: () => void) => void;
  onPlayChime: (correct: boolean) => void;
  onExit?: () => void;
};

export function useQuizSession({
  activeOperations,
  minRange,
  maxRange,
  showWholeNumbers = true,
  showFractions = false,
  fractionDenominatorMode = 'all',
  fractionMaxDenominator = 8,
  fractionValueType = 'proper',
  autoPlayAudio,
  onSpeak,
  onPlayChime,
}: UseQuizSessionOptions) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
  const [wholeInput, setWholeInput] = useState<string>("");
  const [numInput, setNumInput] = useState<string>("");
  const [denInput, setDenInput] = useState<string>("");
  const [activeFractionSlot, setActiveFractionSlot] = useState<"whole" | "numerator" | "denominator">("numerator");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const fractionStateRef = useRef<{
    whole: string;
    num: string;
    den: string;
    slot: "whole" | "numerator" | "denominator";
  }>({ whole: "", num: "", den: "", slot: "numerator" });

  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPlayingSoundRef = useRef(false);
  isPlayingSoundRef.current = isPlayingSound;

  const playAudioPrompt = useCallback(
    (problem: MathProblem) => {
      if (isPlayingSoundRef.current) return;
      setIsPlayingSound(true);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);

      // Fallback timer in case speech engine doesn't fire onEnd
      soundTimeoutRef.current = setTimeout(() => {
        setIsPlayingSound(false);
      }, 4000);

      onSpeak(problem.problemSpeechText, () => {
        if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
        setIsPlayingSound(false);
      });
    },
    [onSpeak]
  );

  const getInitialSlot = useCallback(
    (problem: MathProblem | null): "whole" | "numerator" | "denominator" => {
      if (problem?.isFraction && (problem.showAsMixed || fractionValueType === "mixed")) {
        return "whole";
      }
      return "numerator";
    },
    [fractionValueType]
  );

  const nextQuestion = useCallback(() => {
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);

    const problem = generateMathProblem(
      activeOperations,
      minRange,
      maxRange,
      showWholeNumbers,
      showFractions,
      fractionDenominatorMode,
      fractionMaxDenominator,
      fractionValueType
    );
    const initialSlot = getInitialSlot(problem);
    setCurrentProblem(problem);
    fractionStateRef.current = { whole: "", num: "", den: "", slot: initialSlot };
    setWholeInput("");
    setNumInput("");
    setDenInput("");
    setActiveFractionSlot(initialSlot);
    setIsCorrect(null);

    if (autoPlayAudio) {
      playTimeoutRef.current = setTimeout(() => {
        playAudioPrompt(problem);
      }, 400);
    }
  }, [
    activeOperations,
    minRange,
    maxRange,
    showWholeNumbers,
    showFractions,
    fractionDenominatorMode,
    fractionMaxDenominator,
    fractionValueType,
    autoPlayAudio,
    playAudioPrompt,
    getInitialSlot,
  ]);

  useEffect(() => {
    nextQuestion();
    return () => {
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    };
  }, []);

  const inputVal = currentProblem?.isFraction
    ? buildCombinedFractionInput(wholeInput, numInput, denInput, activeFractionSlot)
    : numInput;

  const handleSubmitInput = useCallback(
    (submittedText: string) => {
      if (!currentProblem || isCorrect !== null || !submittedText) return;

      const parsedUserVal = parseFractionValue(submittedText);
      const isExactStringMatch = submittedText.trim() === currentProblem.answerText.trim();
      const isNumericMatch = parsedUserVal !== null && Math.abs(parsedUserVal - currentProblem.answer) < 0.0001;

      const isAnswerCorrect = isExactStringMatch || isNumericMatch;

      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);

      if (isAnswerCorrect) {
        setIsCorrect(true);
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        onPlayChime(true);

        submitTimeoutRef.current = setTimeout(() => {
          nextQuestion();
        }, 800);
      } else {
        setIsCorrect(false);
        setStreak(0);
        onPlayChime(false);

        submitTimeoutRef.current = setTimeout(() => {
          const resetSlot = getInitialSlot(currentProblem);
          fractionStateRef.current = { whole: "", num: "", den: "", slot: resetSlot };
          setWholeInput("");
          setNumInput("");
          setDenInput("");
          setActiveFractionSlot(resetSlot);
          setIsCorrect(null);
        }, 700);
      }
    },
    [currentProblem, isCorrect, nextQuestion, onPlayChime, getInitialSlot]
  );

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (isCorrect !== null || !currentProblem) return;

      if (digit === "-") {
        if (!currentProblem.isFraction || fractionStateRef.current.slot === "numerator") {
          if (fractionStateRef.current.num === "") {
            fractionStateRef.current.num = "-";
            setNumInput("-");
          }
        } else if (fractionStateRef.current.slot === "whole") {
          if (fractionStateRef.current.whole === "") {
            fractionStateRef.current.whole = "-";
            setWholeInput("-");
          }
        }
        return;
      }

      if (digit === "/") {
        if (showFractions || currentProblem.isFraction) {
          if (fractionStateRef.current.slot === "whole") {
            fractionStateRef.current.slot = "numerator";
            setActiveFractionSlot("numerator");
          } else {
            fractionStateRef.current.slot = "denominator";
            setActiveFractionSlot("denominator");
          }
        }
        return;
      }

      if (currentProblem.isFraction) {
        if (fractionStateRef.current.slot === "whole") {
          if (fractionStateRef.current.whole.length < 4) {
            fractionStateRef.current.whole += digit;
            setWholeInput(fractionStateRef.current.whole);
          }
        } else if (fractionStateRef.current.slot === "numerator") {
          if (fractionStateRef.current.num.length < 6) {
            fractionStateRef.current.num += digit;
            setNumInput(fractionStateRef.current.num);
          }
        } else {
          if (fractionStateRef.current.den.length < 6) {
            fractionStateRef.current.den += digit;
            setDenInput(fractionStateRef.current.den);
          }
        }

        const curWhole = fractionStateRef.current.whole;
        const curNum = fractionStateRef.current.num;
        const curDen = fractionStateRef.current.den;
        const combined = buildCombinedFractionInput(
          curWhole,
          curNum,
          curDen,
          fractionStateRef.current.slot
        );
        const parsedVal = parseFractionValue(combined);
        const isExactMatch = combined.trim() === currentProblem.answerText.trim();
        const isNumericMatch =
          parsedVal !== null &&
          Math.abs(parsedVal - currentProblem.answer) < 0.0001 &&
          (combined.includes("/") || currentProblem.answerText === combined);

        if (isExactMatch || isNumericMatch) {
          handleSubmitInput(combined);
        }
      } else {
        if (fractionStateRef.current.num.length < 10) {
          fractionStateRef.current.num += digit;
          setNumInput(fractionStateRef.current.num);
        }

        const curNum = fractionStateRef.current.num;
        const parsedVal = parseFractionValue(curNum);
        const isExactMatch = curNum.trim() === currentProblem.answerText.trim();
        const isNumericMatch =
          parsedVal !== null && Math.abs(parsedVal - currentProblem.answer) < 0.0001;

        if (isExactMatch || isNumericMatch) {
          handleSubmitInput(curNum);
        }
      }
    },
    [isCorrect, currentProblem, showFractions, handleSubmitInput]
  );

  const handleDelete = useCallback(() => {
    if (isCorrect !== null) return;
    if (currentProblem?.isFraction) {
      const hasWholeSlot = Boolean(currentProblem.showAsMixed || fractionValueType === "mixed");
      if (fractionStateRef.current.slot === "denominator") {
        if (fractionStateRef.current.den.length > 0) {
          fractionStateRef.current.den = fractionStateRef.current.den.slice(0, -1);
          setDenInput(fractionStateRef.current.den);
        } else {
          fractionStateRef.current.slot = "numerator";
          setActiveFractionSlot("numerator");
        }
      } else if (fractionStateRef.current.slot === "numerator") {
        if (fractionStateRef.current.num.length > 0) {
          fractionStateRef.current.num = fractionStateRef.current.num.slice(0, -1);
          setNumInput(fractionStateRef.current.num);
        } else if (hasWholeSlot) {
          fractionStateRef.current.slot = "whole";
          setActiveFractionSlot("whole");
        }
      } else {
        fractionStateRef.current.whole = fractionStateRef.current.whole.slice(0, -1);
        setWholeInput(fractionStateRef.current.whole);
      }
    } else {
      fractionStateRef.current.num = fractionStateRef.current.num.slice(0, -1);
      setNumInput(fractionStateRef.current.num);
    }
  }, [isCorrect, currentProblem, fractionValueType]);

  const onSelectWhole = useCallback(() => {
    if (isCorrect !== null) return;
    fractionStateRef.current.slot = "whole";
    setActiveFractionSlot("whole");
  }, [isCorrect]);

  const onSelectNumerator = useCallback(() => {
    if (isCorrect !== null) return;
    fractionStateRef.current.slot = "numerator";
    setActiveFractionSlot("numerator");
  }, [isCorrect]);

  const onSelectDenominator = useCallback(() => {
    if (isCorrect !== null) return;
    fractionStateRef.current.slot = "denominator";
    setActiveFractionSlot("denominator");
  }, [isCorrect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKeyPress(e.key);
      } else if (e.key === "-") {
        handleKeyPress("-");
      } else if (e.key === "/" && (showFractions || currentProblem?.isFraction)) {
        handleKeyPress("/");
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleDelete();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSubmitInput(inputVal);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, handleDelete, handleSubmitInput, inputVal, showFractions, currentProblem?.isFraction]);

  return {
    currentProblem,
    inputVal,
    wholePart: wholeInput,
    numPart: numInput,
    denPart: denInput,
    activeFractionSlot,
    score,
    streak,
    isCorrect,
    isPlayingSound,
    playAudioPrompt,
    handleKeyPress,
    handleDelete,
    handleSubmitInput,
    onSelectWhole,
    onSelectNumerator,
    onSelectDenominator,
  };
}
