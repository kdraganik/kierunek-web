"use client";

import { useEffect, useMemo, useState } from "react";

type TypewriterTextProps = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
};

export default function TypewriterText({
  words,
  typingSpeed = 90,
  deletingSpeed = 55,
  pauseMs = 1200,
}: TypewriterTextProps) {
  const safeWords = useMemo(() => words.filter(Boolean), [words]);
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (safeWords.length === 0) {
      return;
    }

    const currentWord = safeWords[wordIndex] ?? "";
    const isWordComplete = !isDeleting && letterCount === currentWord.length;
    const isWordDeleted = isDeleting && letterCount === 0;

    const timeout = window.setTimeout(
      () => {
        if (isWordComplete) {
          setIsDeleting(true);
          return;
        }

        if (isWordDeleted) {
          setIsDeleting(false);
          setWordIndex((current) => (current + 1) % safeWords.length);
          return;
        }

        setLetterCount((current) => current + (isDeleting ? -1 : 1));
      },
      isWordComplete ? pauseMs : isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => window.clearTimeout(timeout);
  }, [
    deletingSpeed,
    isDeleting,
    letterCount,
    pauseMs,
    safeWords,
    typingSpeed,
    wordIndex,
  ]);

  return <>{(safeWords[wordIndex] ?? "").slice(0, letterCount)}</>;
}
