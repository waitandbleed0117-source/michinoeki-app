"use client";

import { useMemo, useState } from "react";
import { useStations } from "@/lib/useStations";
import { ProgressHeader } from "@/components/ProgressHeader";
import { BottomNav, type ViewMode } from "@/components/BottomNav";
import { MapOverlay } from "@/components/MapView/MapOverlay";
import { StationDetailSheet } from "@/components/MapView/StationDetailSheet";
import { SearchBar } from "@/components/ListView/SearchBar";
import { FilterChips, type FilterMode } from "@/components/ListView/FilterChips";
import { StationListItem } from "@/components/ListView/StationListItem";

interface AppScreenProps {
  groupCode: string;
}

export function AppScreen({ groupCode }: AppScreenProps) {
  const { stations, loading, error, toggleAcquired } = useStations(groupCode);

  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const selectedStation = useMemo(
    () => stations.find((s) => s.number === selectedNumber) ?? null,
    [stations, selectedNumber]
  );

  // 一覧 → 地図：番号を選んで地図タブへ切替＋一時強調
  function handleNavigateToMap(stationNumber: number) {
    setViewMode("map");
    setHighlightedNumber(stationNumber);
    setSelectedNumber(stationNumber);
    // 一定時間後にハイライトを解除（点滅演出のみ一時的にする）
    window.setTimeout(() => setHighlightedNumber(null), 3000);
  }

  // 地図 → 詳細：マーカータップで詳細シートを開く
  function handleMarkerTap(stationNumber: number) {
    setSelectedNumber(stationNumber);
  }

  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      if (searchText.trim() !== "") {
        const name = s.name ?? "";
        if (!name.includes(searchText.trim())) return false;
      }
      if (filterMode === "acquired" && !s.acquired) return false;
      if (filterMode === "notAcquired" && s.acquired) return false;
      return true;
    });
  }, [stations, searchText, filterMode]);

  const acquiredCount = stations.filter((s) => s.acquired).length;
  const notAcquiredCount = stations.length - acquiredCount;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#f9fafb",
      }}
    >
      <ProgressHeader stations={stations} />

      {error && (
        <div
          style={{
            padding: "8px 16px",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: 13,
          }}
        >
          同期エラー：{error}
        </div>
      )}

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#9ca3af",
            }}
          >
            読み込み中...
          </div>
        ) : viewMode === "map" ? (
          <div style={{ height: "100%", background: "#eef2f0" }}>
            <MapOverlay
              stations={stations}
              highlightedNumber={highlightedNumber}
              onMarkerTap={handleMarkerTap}
            />
          </div>
        ) : (
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              padding: "12px 16px 80px",
            }}
          >
            <SearchBar value={searchText} onChange={setSearchText} />
            <FilterChips
              current={filterMode}
              onChange={setFilterMode}
              acquiredCount={acquiredCount}
              notAcquiredCount={notAcquiredCount}
              totalCount={stations.length}
            />
            {filteredStations.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  marginTop: 40,
                }}
              >
                該当する道の駅が見つかりません
              </p>
            ) : (
              filteredStations.map((station) => (
                <StationListItem
                  key={station.number}
                  station={station}
                  onToggleAcquired={toggleAcquired}
                  onNavigateToMap={handleNavigateToMap}
                />
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav current={viewMode} onChange={setViewMode} />

      <StationDetailSheet
        station={selectedStation}
        onClose={() => setSelectedNumber(null)}
        onToggleAcquired={toggleAcquired}
      />
    </div>
  );
}
