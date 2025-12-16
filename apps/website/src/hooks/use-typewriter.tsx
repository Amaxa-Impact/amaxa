"use client";

import { useEffect, useState } from "react";

// Enhanced typewriter hook that supports manual navigation
export const useTypewriter = (
  texts: string[],
  typingSpeed = 50,
  deletingSpeed = 30,
  delayAfterTyping = 1500,
) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  // Function to manually navigate to specific index
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
          setDisplayedText(
            currentText?.substring(0, displayedText.length + 1)!,
          );
        }, typingSpeed);
      }
    } else {
      // Deleting phase
      if (displayedText === "") {
        // Finished deleting, decide where to go next
        if (targetIndex !== null) {
          setCurrentIndex(targetIndex);
          setTargetIndex(null);
        } else {
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
    targetIndex,
  ]);

  return { text: displayedText, currentIndex, jumpToIndex };
};





