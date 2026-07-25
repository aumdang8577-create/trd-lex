import React from "react";

interface PropertyCardSkeletonProps {
  count?: number;
}

export default function PropertyCardSkeleton({ count = 3 }: PropertyCardSkeletonProps) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#0F1A30] border border-[#1E2E4A]/80 overflow-hidden animate-pulse rounded-2xl shadow-lg"
        >
          <div className="h-44 bg-slate-800/60" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-800/80 rounded w-1/3" />
              <div className="h-4 bg-amber-500/20 rounded w-1/4" />
            </div>
            <div className="h-5 bg-slate-700/80 rounded w-3/4" />
            <div className="space-y-2 pt-2">
              <div className="h-2.5 bg-slate-800/80 rounded w-5/6" />
              <div className="h-2.5 bg-slate-800/80 rounded w-4/5" />
            </div>
            <div className="flex gap-2 pt-3 border-t border-[#1E2E4A]/60">
              <div className="h-3 bg-slate-800/80 rounded w-1/4" />
              <div className="h-3 bg-slate-800/80 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
