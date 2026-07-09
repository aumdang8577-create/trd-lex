"use client";

import React from "react";
import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-gray-50/60 border-b border-trd-border/20 py-2.5 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs text-gray-500 font-medium">
        <Link 
          href="/" 
          className="hover:text-trd-primary transition-colors flex items-center gap-1 text-gray-400"
        >
          🏠 หน้าแรก
        </Link>

        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className="text-gray-300 font-light select-none">/</span>
            {item.href && idx < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-trd-primary transition-colors text-gray-500"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-trd-primary font-bold truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
