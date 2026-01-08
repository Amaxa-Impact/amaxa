import { useState, useEffect } from "react";

type UseTypewriterResult = string | {
  text: string;
  currentIndex: number;
  jumpToIndex: (index: number) => void;
};

/**
 * Typewriter hook for animated text effect
 * Supports both simple auto-cycling and manual navigation modes
 * @param texts - Array of strings to cycle through
 * @param typingSpeed - Speed of typing in milliseconds (default: 50)
 * @param deletingSpeed - Speed of deleting in milliseconds (default: 30)
 * @param delayAfterTyping - Delay before starting to delete in milliseconds (default: 2000)
 * @param enableManualNavigation - If true, returns object with navigation methods (default: false)
 * @returns If enableManualNavigation is false, returns the displayed text string.
 *          If true, returns { text, currentIndex, jumpToIndex } for manual navigation
 */
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

  // Function to manually navigate to specific index (only used when enableManualNavigation is true)
  const jumpToIndex = (index: number): void => {
    if (index === currentIndex) return;
    setIsTyping(false);
    setTargetIndex(index);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentText = texts[currentIndex];

    if (isTyping) {
      // Typing phase
      if (displayedText === currentText) {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterTyping);
      } else {
        // Continue typing
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
        // Finished deleting, decide where to go next
        if (enableManualNavigation && targetIndex !== null) {
          // Manual navigation mode: jump to target index
          setCurrentIndex(targetIndex);
          setTargetIndex(null);
        } else {
          // Auto-cycling mode: move to next text
          setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }
        setIsTyping(true);
      } else {
        // Continue deleting
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
};

