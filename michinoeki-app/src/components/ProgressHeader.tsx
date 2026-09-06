"use client";

import type { Station } from "@/types/station";

interface ProgressHeaderProps {
  stations: Station[];
}

export function ProgressHeader({ stations }: ProgressHeaderProps) {
  const total = stations.length;
  const acquiredCount = stations.filter((s) => s.acquired).length;
  const percent = total > 0 ? (acquiredCount / total) * 100 : 0;

  return (
    <div
      style={{
        padding: "12px 16px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        paddingTop: "calc(12px + env(safe-area-inset-top))",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>
          取得状況
        </span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>
          {acquiredCount} / {total}{" "}
          <span style={{ color: "#16a34a" }}>
            （{percent.toFixed(1)}%）
          </span>
        </span>
      </div>
      <div
        style={{
          marginTop: 6,
          height: 8,
          borderRadius: 4,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#16a34a",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
