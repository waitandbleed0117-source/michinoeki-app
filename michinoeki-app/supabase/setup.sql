-- ============================================================
-- 北海道 道の駅ガチャピンズラリー 家族共有アプリ
-- Supabase セットアップ用SQL
-- Supabaseダッシュボードの SQL Editor にこの内容を貼り付けて実行してください。
-- ============================================================

-- 1. 取得状況テーブル
-- 駅の「名前・座標」等の静的情報は持たず、あくまで「取得したかどうか」だけを管理する。
-- 静的情報は Next.js 側の src/data/stations.json が正とする。
create table if not exists acquisitions (
  id uuid primary key default gen_random_uuid(),
  group_code text not null,
  station_number int not null check (station_number between 1 and 131),
  acquired boolean not null default false,
  acquired_date date,
  acquired_by text,
  updated_at timestamptz not null default now(),
  unique (group_code, station_number)
);

create index if not exists idx_acquisitions_group
  on acquisitions (group_code);

-- 2. Row Level Security (RLS)
-- 認証機能を使わない簡易共有方式のため、
-- 「group_codeを知っていれば読み書きできる」という前提でRLSを設定する。
-- (アプリ側のクエリは必ず .eq('group_code', ...) を付けて実行することが前提)
alter table acquisitions enable row level security;

drop policy if exists "anyone can read" on acquisitions;
create policy "anyone can read"
  on acquisitions for select
  using (true);

drop policy if exists "anyone can insert" on acquisitions;
create policy "anyone can insert"
  on acquisitions for insert
  with check (true);

drop policy if exists "anyone can update" on acquisitions;
create policy "anyone can update"
  on acquisitions for update
  using (true);

-- 3. Realtime有効化
-- Supabaseダッシュボードの Database > Replication からでも設定可能。
-- SQLで行う場合は以下（すでに追加済みの場合はエラーが出ることがあるが無視して問題ない）。
alter publication supabase_realtime add table acquisitions;
