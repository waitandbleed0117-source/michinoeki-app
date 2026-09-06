"use client";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { MapImage } from "./MapImage";
import { ClickableMarker } from "./ClickableMarker";
import type { Station } from "@/types/station";

interface MapOverlayProps {
  stations: Station[];
  highlightedNumber: number | null;
  onMarkerTap: (stationNumber: number) => void;
}

// 地図画像 + マーカー群を1つのレイヤー構造として重ね合わせる。
// ピンチズーム/パンはこのコンポーネントの責務とし、
// 画像そのもの・マーカーの座標計算ロジックには影響を与えない。
export function MapOverlay({
  stations,
  highlightedNumber,
  onMarkerTap,
}: MapOverlayProps) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={1}
      maxScale={6}
      centerOnInit
      limitToBounds
      doubleClick={{ mode: "toggle" }}
    >
      <TransformComponent
        wrapperStyle={{ width: "100%", height: "100%" }}
        contentStyle={{ width: "100%" }}
      >
        <div style={{ position: "relative", width: "100%" }}>
          <MapImage />
          {stations.map((station) => (
            <ClickableMarker
              key={station.number}
              station={station}
              isHighlighted={highlightedNumber === station.number}
              onTap={onMarkerTap}
            />
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
