/**
 * ColourfulText - Animated rainbow text effect
 *
 * Each letter animates with a different color from a rainbow palette.
 * Colors shuffle every 5 seconds for a dynamic effect.
 *
 * Usage:
 * <h1><ColourfulText text="Hello World" /></h1>
 */

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface ColourfulTextProps {
  text: string;
}

export function ColourfulText({ text }: ColourfulTextProps) {
  // Rainbow color palette
  const colors = useMemo(
    () => [
      "rgb(131, 179, 32)", // Green
      "rgb(47, 195, 106)", // Emerald
      "rgb(42, 169, 210)", // Cyan
      "rgb(4, 112, 202)", // Blue
      "rgb(107, 10, 255)", // Purple
      "rgb(183, 0, 218)", // Magenta
      "rgb(218, 0, 171)", // Pink
      "rgb(230, 64, 92)", // Red
      "rgb(232, 98, 63)", // Orange
      "rgb(249, 129, 47)", // Amber
    ],
    [],
  );

  const [currentColors, setCurrentColors] = useState(colors);
  const [count, setCount] = useState(0);

  // Shuffle colors every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

  // Render each character with its own animation
  return (
    <>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          initial={{ y: 0 }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.01, 1],
            filter: ["blur(0px)", "blur(5px)", "blur(0px)"],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block font-sans tracking-tight whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}
