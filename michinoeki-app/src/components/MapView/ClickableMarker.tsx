"use client";

import type { Station } from "@/types/station";

interface ClickableMarkerProps {
  station: Station;
  isHighlighted: boolean; // 一覧から遷移してきた際の一時強調表示
  onTap: (stationNumber: number) => void;
}

// 相対座標(0-1)を使い、コンテナに対する絶対位置(%)としてマーカーを配置する。
// これにより画像の表示サイズが変わっても位置がずれない。
export function ClickableMarker({
  station,
  isHighlighted,
  onTap,
}: ClickableMarkerProps) {
  const leftPercent = station.mapPosition.x * 100;
  const topPercent = station.mapPosition.y * 100;

  return (
    <button
      type="button"
      onClick={() => onTap(station.number)}
      aria-label={`${station.number}番 ${station.name ?? "駅名未確認"} ${
        station.acquired ? "取得済み" : "未取得"
      }`}
      style={{
        position: "absolute",
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: "translate(-50%, -50%)",
        // タップ領域は最低44x44pxを確保(iPhoneのタップしやすさ基準)
        width: 40,
        height: 40,
        minWidth: 40,
        minHeight: 40,
        borderRadius: "50%",
        border: "none",
        padding: 0,
        cursor: "pointer",
        // 背景は基本的に透明。取得状況はここでオーバーレイとして表示する。
        // (元の地図画像上の番号デザインを隠さないよう、輪だけのハイライト)
        background: station.acquired
          ? "rgba(34, 197, 94, 0.28)"
          : "transparent",
        outline: isHighlighted ? "3px solid #fb923c" : "none",
        outlineOffset: 2,
        boxShadow: station.acquired
          ? "0 0 0 2px rgba(34,197,94,0.9) inset"
          : "none",
        animation: isHighlighted ? "marker-pulse 0.9s ease-in-out 3" : "none",
        transition: "background 0.15s ease, box-shadow 0.15s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {station.acquired && (
        <span
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#16a34a",
            color: "white",
            fontSize: 11,
            lineHeight: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
          }}
        >
          ✓
        </span>
      )}
    </button>
  );
}
