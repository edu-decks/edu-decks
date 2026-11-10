import { useState, useEffect, useCallback, useRef } from "react";
import type { TopicType, ComplexityTier, AlgebraCard } from "@/lib/types";
import { generateAlgebraCard } from "@/lib/card-generator";

type UseAlgebraQuizSessionOptions = {
  activeTopics: TopicType[];
  complexity: ComplexityTier;
  includeNegatives: boolean;
  autoPlayAudio: boolean;
  onSpeak: (text: string, onEnd?: () => void) => void;
  onPlayChime: (correct: boolean) => void;
  onExit?: () => void;
};

export function useAlgebraQuizSession({
  activeTopics,
  complexity,
  includeNegatives,
  autoPlayAudio,
  onSpeak,
  onPlayChime,
}: UseAlgebraQuizSessionOptions) {
  const [currentProblem, setCurrentProblem] = useState<AlgebraCard | null>(null);
  const [inputVal, setInputVal] = useState<string>("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const soundTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingSoundRef = useRef(false);
  isPlayingSoundRef.current = isPlayingSound;

  const playAudioPrompt = useCallback(
    (card: AlgebraCard) => {
      if (isPlayingSoundRef.current) return;
      setIsPlayingSound(true);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);

      soundTimeoutRef.current = setTimeout(() => {
        setIsPlayingSound(false);
      }, 4000);

      const text = card.frontSpeechText || card.frontPrompt || "Solve the algebra problem";
      onSpeak(text, () => {
        if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
        setIsPlayingSound(false);
      });
    },
    [onSpeak]
  );

  const nextQuestion = useCallback(() => {
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);

    const newCard = generateAlgebraCard({
      activeTopics,
      activeCardTypes: ["practice"],
      complexity,
      includeNegatives,
    });

    setCurrentProblem(newCard);
    setInputVal("");
    setIsCorrect(null);

    if (autoPlayAudio) {
      playTimeoutRef.current = setTimeout(() => {
        playAudioPrompt(newCard);
      }, 300);
    }
  }, [activeTopics, complexity, includeNegatives, autoPlayAudio, playAudioPrompt]);

  useEffect(() => {
    nextQuestion();
    return () => {
      if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    };
  }, []);

  const checkAnswer = useCallback(
    (valToCheck: string) => {
      if (!currentProblem || currentProblem.numericAnswer == null || isCorrect !== null) return;
      const normalized = valToCheck.replace("−", "-").trim();
      if (!normalized || normalized === "-") return;
      const parsed = parseInt(normalized, 10);
      if (isNaN(parsed)) return;

      const expected = currentProblem.numericAnswer;
      if (parsed === expected) {
        setIsCorrect(true);
        onPlayChime(true);
        setScore((s) => s + 1);
        setStreak((st) => st + 1);

        if (autoPlayAudio && currentProblem.backSpeechText) {
          onSpeak(currentProblem.backSpeechText);
        }

        submitTimeoutRef.current = setTimeout(() => {
          nextQuestion();
        }, 800);
      } else {
        setIsCorrect(false);
        onPlayChime(false);
        setStreak(0);

        submitTimeoutRef.current = setTimeout(() => {
          setIsCorrect(null);
          setInputVal("");
        }, 600);
      }
    },
    [currentProblem, isCorrect, onPlayChime, autoPlayAudio, onSpeak, nextQuestion]
  );

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (isCorrect !== null || !currentProblem) return;

      const newVal = inputVal + digit;
      if (newVal.length > 5) return;

      setInputVal(newVal);

      const expectedStr = String(currentProblem.numericAnswer ?? "");
      const normalizedNew = newVal.replace("−", "-");
      if (normalizedNew.length >= expectedStr.length && normalizedNew !== "-") {
        checkAnswer(newVal);
      }
    },
    [inputVal, isCorrect, currentProblem, checkAnswer]
  );

  const handleToggleSign = useCallback(() => {
    if (isCorrect !== null || !currentProblem) return;
    const nextVal = inputVal.startsWith("−")
      ? inputVal.slice(1)
      : `−${inputVal}`;
    setInputVal(nextVal);

    const expectedStr = String(currentProblem.numericAnswer ?? "");
    const normalizedNext = nextVal.replace("−", "-");
    if (normalizedNext.length >= expectedStr.length && normalizedNext !== "-") {
      checkAnswer(nextVal);
    }
  }, [inputVal, isCorrect, currentProblem, checkAnswer]);

  const handleDelete = useCallback(() => {
    if (isCorrect !== null) return;
    setInputVal((prev) => prev.slice(0, -1));
  }, [isCorrect]);

  const handleSubmit = useCallback(() => {
    if (isCorrect !== null || !inputVal || inputVal === "−") return;
    checkAnswer(inputVal);
  }, [isCorrect, inputVal, checkAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === "-") {
        e.preventDefault();
        handleToggleSign();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, handleToggleSign, handleDelete, handleSubmit]);

  return {
    currentProblem,
    inputVal,
    score,
    streak,
    isCorrect,
    isPlayingSound,
    playAudioPrompt,
    handleKeyPress,
    handleToggleSign,
    handleDelete,
    handleSubmit,
    nextQuestion,
  };
}
