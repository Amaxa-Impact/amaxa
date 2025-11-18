'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedHeadingProps {
  text: string
  className?: string
}

export function AnimatedHeading({
  text,
  className = ''
}: AnimatedHeadingProps) {
  // How many letters have appeared so far? Start at 0
  const [lettersShown, setLettersShown] = useState(0)

  // Is the heading visible on screen? Start as false
  const [canSee, setCanSee] = useState(false)

  // Reference to the h1 element so we can watch it
  const headingElement = useRef<HTMLHeadingElement>(null)

  // STEP 1: Watch if the heading is on screen or not
  useEffect(() => {
  
    const watcher = new IntersectionObserver((entries) => {
      const heading = entries[0]

      if (heading?.isIntersecting) {
        // Heading IS on screen now
        setCanSee(true)
        setLettersShown(0) // Start from beginning
      } else {
        // Heading is NOT on screen
        setCanSee(false)
      }
    })

    // Start watching the heading
    if (headingElement.current) {
      watcher.observe(headingElement.current)
    }

    // Clean up when component is removed
    return () => watcher.disconnect()
  }, [])

  // STEP 2: Show letters one by one
  useEffect(() => {
    // Only run if heading is visible
    if (!canSee) return

    // Are there more letters to show?
    if (lettersShown < text.length) {
      // Wait 50 milliseconds, then show the next letter
      const timer = setTimeout(() => {
        setLettersShown(lettersShown + 1)
      }, 50)

      // Clean up the timer
      return () => clearTimeout(timer)
    }
  }, [lettersShown, canSee, text.length])

  // STEP 3: Draw the heading
  return (
    <h1 ref={headingElement} className={className}>
      {text.split('').map((letter, position) => {
        // Should this letter be visible yet?
        const isVisible = position < lettersShown

        return (
          <span
            key={position}
            style={{
              opacity: isVisible ? 1 : 0, // 1 = visible, 0 = invisible
              transition: 'opacity 0.1s ease-in'
            }}
          >
            {letter}
          </span>
        )
      })}
    </h1>
  )
}
