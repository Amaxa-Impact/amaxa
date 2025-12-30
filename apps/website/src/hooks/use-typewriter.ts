import { useState, useEffect } from "react";

/**
 * Typewriter hook for animated text effect
 * @param texts - Array of strings to cycle through
 * @param typingSpeed - Speed of typing in milliseconds (default: 50)
 * @param deletingSpeed - Speed of deleting in milliseconds (default: 30)
 * @param delayAfterTyping - Delay before starting to delete in milliseconds (default: 2000)
 * @returns The currently displayed text
 */
export const useTypewriter = (
  texts: string[],
  typingSpeed = 50,
  deletingSpeed = 30,
  delayAfterTyping = 2000,
) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

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
        // Finished deleting, move to next text
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
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
  }, [displayedText, isTyping, currentIndex, texts, typingSpeed, deletingSpeed, delayAfterTyping]);

  return displayedText;
};

