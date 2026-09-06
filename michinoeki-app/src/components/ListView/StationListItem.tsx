"use client";

import type { Station } from "@/types/station";

interface StationListItemProps {
  station: Station;
  onToggleAcquired: (stationNumber: number) => void;
  onNavigateToMap: (stationNumber: number) => void;
}

export function StationListItem({
  station,
  onToggleAcquired,
  onNavigateToMap,
}: StationListItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 4px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {/* チェック領域：タップで取得状況を切替。誤操作防止のため独立した領域にする */}
      <button
        type="button"
        onClick={() => onToggleAcquired(station.number)}
        aria-label={station.acquired ? "未取得に戻す" : "取得済みにする"}
        style={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: 10,
          border: `2px solid ${station.acquired ? "#16a34a" : "#d1d5db"}`,
          background: station.acquired ? "#16a34a" : "white",
          color: "white",
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {station.acquired ? "✓" : ""}
      </button>

      {/* 駅名領域：タップで地図画面へ遷移し、当該番号を強調表示 */}
      <button
        type="button"
        onClick={() => onNavigateToMap(station.number)}
        style={{
          flex: 1,
          textAlign: "left",
          border: "none",
          background: "none",
          padding: "8px 4px",
          cursor: "pointer",
          minHeight: 44,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 700 }}>
            No.{station.number}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {station.name ?? (
              <span style={{ color: "#d97706" }}>駅名要確認</span>
            )}
          </span>
        </div>
        {station.acquired && station.acquiredDate && (
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            取得日：{station.acquiredDate}
            {station.acquiredBy ? `　取得者：${station.acquiredBy}` : ""}
          </div>
        )}
      </button>
    </div>
  );
}
