"use client";

import type { Notice } from "../../../types/ui";

type NoticeBannerProps = {
  notice: Notice | null;
  onDismiss?: () => void;
};

const getNoticeStyles = (notice: Notice) => {
  if (notice.type === "error") {
    return "border-red-500/40 text-red-100";
  }

  if (notice.type === "success") {
    return "border-emerald-500/40 text-emerald-100";
  }

  return "border-emerald-400/20 text-emerald-100/80";
};

export function NoticeBanner({ notice, onDismiss }: NoticeBannerProps) {
  if (!notice) {
    return null;
  }

  return (
    <div
      className={`panel mt-6 flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm ${getNoticeStyles(
        notice
      )}`}
    >
      <span>{notice.message}</span>
      {onDismiss ? (
        <button
          className="text-xs text-emerald-100/70 transition hover:text-emerald-100"
          onClick={onDismiss}
        >
          Zamknij
        </button>
      ) : null}
    </div>
  );
}
