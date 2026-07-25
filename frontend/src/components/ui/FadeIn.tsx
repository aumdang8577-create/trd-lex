"use client";

import React, { useEffect, useState } from "react";

interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export default function FadeIn({
  delay = 0,
  duration = 1000,
  children,
  className = "",
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}
