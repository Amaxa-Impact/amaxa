"use client";
import React, { useState, useEffect, useRef } from "react";

// Simplified typewriter hook
const useTypewriter = (texts: any, typingSpeed = 50, deletingSpeed = 30, delayAfterTyping = 1500) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Use a ref to track the current text being typed/deleted
  const currentTextRef = useRef(texts[0]);

  useEffect(() => {
    // Update the current text when texts array or index changes
    currentTextRef.current = texts[currentIndex];
  }, [texts, currentIndex]);

  useEffect(() => {
    let timeout;

    if (isTyping) {
      // Typing phase
      if (displayedText === currentTextRef.current) {
        // Finished typing, wait before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, delayAfterTyping);
      } else {
        // Continue typing
        timeout = setTimeout(() => {
          setDisplayedText(currentTextRef.current.substring(0, displayedText.length + 1));
        }, typingSpeed);
      }
    } else {
      // Deleting phase
      if (displayedText === "") {
        // Finished deleting, move to next text and start typing
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      } else {
        // Continue deleting
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isTyping, currentIndex, texts, typingSpeed, deletingSpeed, delayAfterTyping]);

  return displayedText;
};

const ImpactSection = () => {
  // Content pairs (image and impact statement)
  const content = [
    {
      image: "/path/to/uganda-grandmothers.jpg",
      statement: "I provided light for grandmothers in Uganda",
    },
    {
      image: "/path/to/clean-water-project.jpg",
      statement: "I helped build wells for clean water access",
    },
    {
      image: "/path/to/education-project.jpg",
      statement: "I funded education for 50 children",
    },
    {
      image: "/path/to/healthcare-project.jpg",
      statement: "I supported healthcare for rural communities",
    },
    {
      image: "/path/to/sustainable-farming.jpg",
      statement: "I enabled sustainable farming practices",
    },
  ];

  // Extract just the statements for the typewriter
  const statements = content.map(item => item.statement);

  // Use the typewriter hook
  const typedText = useTypewriter(statements, 40, 20, 2000);

  // Track the current content index based on the typewriter
  const [activeIndex, setActiveIndex] = useState(0);

  // Update the active index when the typewriter changes text
  useEffect(() => {
    const currentStatement = typedText;
    const foundIndex = statements.findIndex(statement =>
      statement.startsWith(currentStatement) && currentStatement.length > 0
    );

    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }
  }, [typedText, statements]);

  // Calculate previous and next indices
  const prevIndex = (activeIndex - 1 + content.length) % content.length;
  const nextIndex = (activeIndex + 1) % content.length;

  // Manual navigation - not implemented for this version as it would
  // complicate the typewriter effect synchronization

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
        <div className="max-w-xl">
          <p className="text-gray-700 text-xl mb-2">
            Change{" "}
            <span className="font-light italic">"I wish I could help"</span> to
          </p>

          {/* Rotating impact statement with typewriter effect */}
          <div className="h-[150px] md:h-[180px] flex items-center">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-8">
              {typedText}
              <span className="animate-blink">|</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#join"
              className="inline-flex items-center px-8 py-3 rounded-full bg-[#b9d66e] text-gray-800 font-medium hover:bg-[#a8c55f] transition-colors"
            >
              Join Us <span className="ml-2">→</span>
            </a>

            <a
              href="#projects"
              className="inline-flex items-center px-8 py-3 rounded-full border-2 border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Explore All Projects <span className="ml-2">→</span>
            </a>
          </div>

          {/* Carousel indicators */}
          <div className="flex gap-2 mt-8">
            {content.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-300
                          ${index === activeIndex
                    ? "bg-gray-800"
                    : "bg-gray-300"
                  }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-1/2 relative">
        <div
          className="relative"
          style={{ height: "336px", width: "500px", margin: "0 auto" }}
        >
          {/* Main image with exact dimensions */}
          <div
            className="absolute rounded-[24px] overflow-hidden z-20"
            style={{
              width: "262px",
              height: "336px",
              top: "0",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <img
              key={`main-${activeIndex}`}
              src={content[activeIndex]?.image}
              alt={content[activeIndex]?.statement}
              className="w-full h-full object-cover animate-fadeIn"
            />
          </div>

          {/* Left small image - horizontally aligned with main image */}
          <div
            className="absolute rounded-[24px] overflow-hidden cursor-pointer z-10
                      border-2 border-white shadow-md"
            style={{
              width: "95px",
              height: "139px",
              // Center vertically within the main image height
              top: "calc(336px/2 - 139px/2)",
              left: "0",
            }}
          >
            <img
              src={content[prevIndex]?.image}
              alt="Previous"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right small image - horizontally aligned with main image */}
          <div
            className="absolute rounded-[24px] overflow-hidden cursor-pointer z-10
                      border-2 border-white shadow-md"
            style={{
              width: "97px",
              height: "139px",
              top: "calc(336px/2 - 139px/2)",
              right: "0",
            }}
          >
            <img
              src={content[nextIndex]?.image}
              alt="Next"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSection;
