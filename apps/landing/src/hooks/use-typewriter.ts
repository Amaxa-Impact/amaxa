/**
 * useTypewriter - Animated typewriter text effect
 *
 * Cycles through an array of texts, typing and deleting each one.
 * Supports both automatic cycling and manual navigation.
 *
 * Usage:
 * // Simple auto-cycling:
 * const text = useTypewriter(["Hello", "World"]);
 *
 * // With manual navigation:
 * const { text, currentIndex, jumpToIndex } = useTypewriter(
 *   ["Hello", "World"],
 *   50, 30, 2000,
 *   true  // enableManualNavigation
 * );
 */

import { useEffect, useState } from "react";

type UseTypewriterResult =
  | string
  | {
      text: string;
      currentIndex: number;
      jumpToIndex: (index: number) => void;
    };

export function useTypewriter(
  texts: string[],
  typingSpeed = 50,
  deletingSpeed = 30,
  delayAfterTyping = 2000,
  enableManualNavigation = false,
): UseTypewriterResult {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // Function to manually jump to a specific text
  const jumpToIndex = (index: number): void => {
    if (index === currentIndex) return;
    setIsTyping(false);
    setTargetIndex(index);
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const currentText = texts[currentIndex];

    if (isTyping) {
      // Typing phase
      if (displayedText === currentText) {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterTyping);
      } else {
        // Continue typing one character at a time
        timeout = setTimeout(() => {
          if (currentText) {
            setDisplayedText(
              currentText.substring(0, displayedText.length + 1),
            );
          }
        }, typingSpeed);
      }
    } else {
      // Deleting phase
      if (displayedText === "") {
        // Finished deleting, move to next text
        let nextIndex: number;
        if (enableManualNavigation && targetIndex !== null) {
          nextIndex = targetIndex;
          setTargetIndex(null);
        } else {
          nextIndex = (currentIndex + 1) % texts.length;
        }
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      } else {
        // Continue deleting one character at a time
        timeout = setTimeout(() => {
          setDisplayedText(
            displayedText.substring(0, displayedText.length - 1),
          );
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    displayedText,
    isTyping,
    currentIndex,
    texts,
    typingSpeed,
    deletingSpeed,
    delayAfterTyping,
    enableManualNavigation,
    targetIndex,
  ]);

  if (enableManualNavigation) {
    return { text: displayedText, currentIndex, jumpToIndex };
  }

  return displayedText;
}
