// 駅データの型定義
// 重要：number (1-131) がすべての画面・データソースを貫く唯一のキーです。
// 地図上の番号・一覧の番号・Supabase上のレコードは、すべてこのnumberで紐付きます。

export type NameSource = "台紙" | "公式" | "要確認";

// 静的データ（stations.json由来、変更されない）
export interface StationStatic {
  number: number; // 1-131, 一意
  name: string | null; // 33番のみnull（駅名未確定）
  mapPosition: {
    x: number; // 地図画像に対する相対座標 0-1（左端=0, 右端=1）
    y: number; // 地図画像に対する相対座標 0-1（上端=0, 下端=1）
  };
  isPositionVerified: boolean; // 実画像で座標を検証済みかどうか（現状すべてfalse）
  isNameVerified: boolean; // 駅名が確定済みかどうか
  nameSource: NameSource;
}

// 動的データ（Supabase acquisitions テーブル由来、家族間で共有される）
export interface StationAcquisition {
  acquired: boolean;
  acquiredDate: string | null; // ISO 8601 date (YYYY-MM-DD)
  acquiredBy: string | null;
}

// アプリ内で実際に使う統合型（静的データ＋動的データのマージ結果）
export interface Station extends StationStatic, StationAcquisition {}

// Supabaseのacquisitionsテーブルの行の型
export interface AcquisitionRow {
  id: string;
  group_code: string;
  station_number: number;
  acquired: boolean;
  acquired_date: string | null;
  acquired_by: string | null;
  updated_at: string;
}
