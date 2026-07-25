import React from "react";

interface FetchErrorAlertProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function FetchErrorAlert({
  title = "เกิดข้อผิดพลาดในการโหลดข้อมูล",
  message = "ไม่สามารถเชื่อมต่อฐานข้อมูลสิทธิ์การเช่าราชพัสดุได้ในขณะนี้ โปรดตรวจสอบการเชื่อมต่อแล้วลองใหม่อีกครั้ง",
  onRetry,
}: FetchErrorAlertProps) {
  return (
    <div className="bg-red-950/40 border border-red-800/60 p-6 rounded-2xl shadow-xl text-slate-200 font-sans">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400 shrink-0">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="text-sm font-bold text-red-300 font-mono uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {message}
          </p>

          {onRetry && (
            <div className="pt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-200 text-xs font-mono font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-red-500/10 active:scale-95"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                ลองใหม่อีกครั้ง (Retry Data Fetch)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
