"use client";

import { useEffect, useState } from "react";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  initialDelay?: number;
  charDelay?: number;
  duration?: number;
}

export default function AnimatedHeading({
  text,
  className = "",
  style = {},
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
}: AnimatedHeadingProps) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  const lines = text.split("\n");

  return (
    <h1 className={className} style={{ letterSpacing: "-0.04em", ...style }}>
      {lines.map((line, lineIndex) => {
        // Calculate cumulative length of preceding lines for correct stagger calculation
        const precedingCharsCount = lines
          .slice(0, lineIndex)
          .reduce((acc, l) => acc + l.length, 0);

        return (
          <div key={lineIndex} className="block overflow-hidden">
            {line.split("").map((char, charIndex) => {
              const globalCharIndex = precedingCharsCount + charIndex;
              const delayMs = initialDelay + globalCharIndex * charDelay;

              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? "translateX(0)" : "translateX(-18px)",
                    transitionDuration: `${duration}ms`,
                    transitionDelay: `${isAnimated ? globalCharIndex * charDelay : 0}ms`,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              );
            })}
          </div>
        );
      })}
    </h1>
  );
}
