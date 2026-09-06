"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import stationsStatic from "@/data/stations.json";
import type { AcquisitionRow, Station, StationStatic } from "@/types/station";

const STATIC_STATIONS = stationsStatic as StationStatic[];

// 静的データ(131件)を唯一の番号一覧とする。
// Supabase側にレコードが無い番号は「未取得」として扱う。
function mergeStations(rows: AcquisitionRow[]): Station[] {
  const rowsByNumber = new Map<number, AcquisitionRow>();
  for (const row of rows) {
    rowsByNumber.set(row.station_number, row);
  }

  return STATIC_STATIONS.map((s) => {
    const row = rowsByNumber.get(s.number);
    return {
      ...s,
      acquired: row?.acquired ?? false,
      acquiredDate: row?.acquired_date ?? null,
      acquiredBy: row?.acquired_by ?? null,
    };
  });
}

interface UseStationsResult {
  stations: Station[];
  loading: boolean;
  error: string | null;
  toggleAcquired: (
    stationNumber: number,
    acquiredBy?: string | null
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useStations(groupCode: string | null): UseStationsResult {
  const [stations, setStations] = useState<Station[]>(() =>
    mergeStations([])
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const groupCodeRef = useRef(groupCode);
  groupCodeRef.current = groupCode;

  const fetchAll = useCallback(async () => {
    if (!groupCode) return;
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("acquisitions")
      .select("*")
      .eq("group_code", groupCode);

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setStations(mergeStations((data ?? []) as AcquisitionRow[]));
    setLoading(false);
  }, [groupCode]);

  // 初回ロード + グループコード変更時
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime購読：同じgroup_codeの変更を他端末からも即時反映
  useEffect(() => {
    if (!groupCode) return;

    const channel = supabase
      .channel(`acquisitions-${groupCode}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "acquisitions",
          filter: `group_code=eq.${groupCode}`,
        },
        () => {
          // 変更があったら該当グループの全件を再取得する
          // (差分マージも可能だが、131件程度なので単純な全件再取得で十分な性能)
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupCode, fetchAll]);

  const toggleAcquired = useCallback(
    async (stationNumber: number, acquiredBy: string | null = null) => {
      const currentGroupCode = groupCodeRef.current;
      if (!currentGroupCode) return;

      const current = stations.find((s) => s.number === stationNumber);
      const nextAcquired = !(current?.acquired ?? false);
      const nowIso = new Date().toISOString().slice(0, 10);

      // 楽観的更新：即座にUIへ反映してから、裏でSupabaseへ書き込む
      setStations((prev) =>
        prev.map((s) =>
          s.number === stationNumber
            ? {
                ...s,
                acquired: nextAcquired,
                acquiredDate: nextAcquired ? nowIso : null,
                acquiredBy: nextAcquired ? acquiredBy : null,
              }
            : s
        )
      );

      const { error: upsertError } = await supabase.from("acquisitions").upsert(
        {
          group_code: currentGroupCode,
          station_number: stationNumber,
          acquired: nextAcquired,
          acquired_date: nextAcquired ? nowIso : null,
          acquired_by: nextAcquired ? acquiredBy : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "group_code,station_number" }
      );

      if (upsertError) {
        setError(upsertError.message);
        // 失敗した場合は再取得して正しい状態に戻す
        fetchAll();
      }
    },
    [stations, fetchAll]
  );

  return { stations, loading, error, toggleAcquired, refetch: fetchAll };
}
