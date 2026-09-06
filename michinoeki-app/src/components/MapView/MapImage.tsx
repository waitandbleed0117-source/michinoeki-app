"use client";

import { MAP_IMAGE_HEIGHT, MAP_IMAGE_SRC, MAP_IMAGE_WIDTH } from "@/lib/mapConfig";

// このコンポーネントは「画像を表示するだけ」の責務に限定する。
// 地図の地形・道路・番号などを描画/再生成する処理は絶対に含めない。
// (要件：実物台紙の画像をそのまま背景として使用すること)
export function MapImage() {
  return (
    <img
      src={MAP_IMAGE_SRC}
      width={MAP_IMAGE_WIDTH}
      height={MAP_IMAGE_HEIGHT}
      alt="北海道 道の駅ガチャピンズラリー 台紙地図"
      draggable={false}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        userSelect: "none",
        pointerEvents: "none", // 画像自体はタップ判定を持たない。判定はClickableMarkerが担う
      }}
    />
  );
}
