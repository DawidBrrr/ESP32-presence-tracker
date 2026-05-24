"use client";

import type { Notice } from "../../../types/ui";

type NoticeBannerProps = {
  notice: Notice | null;
  onDismiss?: () => void;
};

const getNoticeStyles = (notice: Notice) => {
  if (notice.type === "error") {
    return "border-red-500/40 bg-red-500/10 text-red-200";
  }

  if (notice.type === "success") {
    return "border-emerald-500/40 bg-emerald-500/10 text-emerald-200";
  }

  return "border-slate-700 bg-slate-900/60 text-slate-200";
};

export function NoticeBanner({ notice, onDismiss }: NoticeBannerProps) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`mt-6 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${getNoticeStyles(
        notice
      )}`}
    >
      <span>{notice.message}</span>
      {onDismiss ? (
        <button
          className="text-xs text-slate-300 transition hover:text-slate-100"
          onClick={onDismiss}
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
