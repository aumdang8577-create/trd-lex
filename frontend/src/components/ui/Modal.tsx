"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-xs" />

      {/* Modal Panel */}
      <div
        className={`
          relative bg-white border-4 border-trd-border w-full text-trd-midnight rounded-none shadow-flat
          ${sizeStyles[size]}
          animate-slide-up
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-trd-border bg-slate-50">
            <h3 className="text-xs font-black text-trd-midnight uppercase tracking-widest font-mono">{title}</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center border border-trd-border hover:bg-slate-200 text-trd-midnight transition-colors font-mono"
              aria-label="ปิด"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 text-trd-midnight font-sans text-sm">{children}</div>
      </div>
    </div>
  );
}
