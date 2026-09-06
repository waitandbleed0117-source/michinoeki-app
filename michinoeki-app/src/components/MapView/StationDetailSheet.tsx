"use client";

import type { Station } from "@/types/station";

interface StationDetailSheetProps {
  station: Station | null;
  onClose: () => void;
  onToggleAcquired: (stationNumber: number) => void;
}

export function StationDetailSheet({
  station,
  onClose,
  onToggleAcquired,
}: StationDetailSheetProps) {
  if (!station) return null;

  return (
    <>
      {/* 背景オーバーレイ：タップで閉じる */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 40,
        }}
      />
      <div
        role="dialog"
        aria-label="道の駅詳細"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          background: "white",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: "20px 20px calc(24px + env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.15)",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: "#e5e7eb",
            borderRadius: 2,
            margin: "0 auto 16px",
          }}
        />

        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#6b7280",
            }}
          >
            No.{station.number}
          </span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
            {station.name ?? "駅名要確認"}
          </h2>
        </div>

        {!station.isNameVerified && (
          <p style={{ fontSize: 13, color: "#d97706", marginTop: 4 }}>
            ⚠️ この駅名はまだ確定していません（要確認）
          </p>
        )}

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: station.acquired ? "#f0fdf4" : "#f9fafb",
            border: `1px solid ${station.acquired ? "#bbf7d0" : "#e5e7eb"}`,
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: station.acquired ? "#16a34a" : "#6b7280",
              margin: 0,
            }}
          >
            {station.acquired ? "✓ 取得済み" : "未取得"}
          </p>
          {station.acquired && (
            <div style={{ marginTop: 8, fontSize: 14, color: "#374151" }}>
              <p style={{ margin: "2px 0" }}>
                取得日：{station.acquiredDate ?? "―"}
              </p>
              <p style={{ margin: "2px 0" }}>
                取得者：{station.acquiredBy ?? "―"}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onToggleAcquired(station.number)}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "16px 0",
            fontSize: 17,
            fontWeight: 700,
            borderRadius: 14,
            border: "none",
            color: "white",
            background: station.acquired ? "#9ca3af" : "#16a34a",
            cursor: "pointer",
          }}
        >
          {station.acquired ? "未取得に戻す" : "取得済みにする"}
        </button>
      </div>
    </>
  );
}
