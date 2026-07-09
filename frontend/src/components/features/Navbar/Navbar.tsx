"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-trd-border/50 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-trd-gradient rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <span className="text-lg font-bold text-trd-primary">TRD</span>
              <span className="text-lg font-bold text-trd-secondary">-LEX</span>
              <p className="text-[10px] text-gray-400 -mt-1 leading-tight">
                Lease Exchange
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-sm font-medium text-trd-primary hover:text-trd-primary-light transition-colors"
            >
              หน้าแรก
            </a>
            <a
              href="/listings"
              className="text-sm font-medium text-gray-500 hover:text-trd-primary transition-colors"
            >
              ค้นหาประกาศ
            </a>
            <a
              href="/map"
              className="text-sm font-medium text-gray-500 hover:text-trd-primary transition-colors"
            >
              แผนที่
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              เข้าสู่ระบบ
            </Button>
            <Button variant="primary" size="sm">
              ลงทะเบียน
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="เปิดเมนู"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-trd-border/50 bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-3">
            <a href="/" className="block text-sm font-medium text-trd-primary py-2">
              หน้าแรก
            </a>
            <a href="/listings" className="block text-sm font-medium text-gray-500 py-2">
              ค้นหาประกาศ
            </a>
            <a href="/map" className="block text-sm font-medium text-gray-500 py-2">
              แผนที่
            </a>
            <div className="pt-3 border-t border-trd-border/30 flex gap-3">
              <Button variant="ghost" size="sm" className="flex-1">
                เข้าสู่ระบบ
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                ลงทะเบียน
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
