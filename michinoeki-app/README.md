# 北海道 道の駅ガチャピンズラリー 家族共有アプリ

2025年版「北海道 道の駅ガチャピンズラリー」の実物台紙をベースに、
家族で取得状況を共有できるWebアプリです。

- 1〜131番の道の駅を地図・一覧の両方で確認
- 取得済み／未取得の切替が家族全員の端末にリアルタイムで反映
- Next.js + Supabase 構成
- iPhone Safari を最優先したレスポンシブUI

---

## 1. 現在の状態（重要）

**地図画像は現時点でプレースホルダーです。**

`public/map/hokkaido-map-placeholder.jpg` は単色の仮画像であり、
実際の台紙の地図は写っていません。1〜131のマーカー配置・タップ・
ハイライト表示などの「仕組み」はすべて完成していますが、
座標は目視による暫定値です。

実物の2025年版台紙画像に差し替える手順は「6. 実物地図画像への差し替え手順」を参照してください。

---

## 2. 技術構成

| 項目 | 使用技術 |
|---|---|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| 地図のズーム/パン | react-zoom-pan-pinch |
| データベース | Supabase (Postgres + Realtime) |
| ホスティング | Vercel |
| 家族共有方式 | パスワードなし「共有グループコード」方式 |

---

## 3. データ設計の考え方

駅データは「静的データ」と「動的データ」の2つに分かれています。

- **静的データ**（`src/data/stations.json`）
  番号・駅名・地図座標など、家族間で変わらない情報。131件固定。
- **動的データ**（Supabase `acquisitions` テーブル）
  取得済みかどうか・取得日・取得者など、家族の操作で変わる情報。

アプリはこの2つを `number`（1〜131）をキーにマージして画面に表示します。
地図上の番号と一覧の番号は、常にこの同じ131件のデータを参照するため、
「地図の42番」と「一覧の42番」が食い違うことはありません。

---

## 4. Supabaseの初期設定手順

1. https://supabase.com でアカウント作成し、新規プロジェクトを作成
2. プロジェクト作成後、左メニューの **SQL Editor** を開く
3. `supabase/setup.sql` の内容をすべて貼り付けて実行
   - `acquisitions` テーブルが作成されます
   - Row Level Security（RLS）が有効化されます
   - Realtime配信が有効化されます
4. 左メニューの **Settings > API** を開き、以下をメモする
   - `Project URL`
   - `anon public` キー

### RLSについての注意

このアプリは認証機能を持たない簡易共有方式のため、
「`group_code`を知っている人は誰でも読み書きできる」設計です。
家族内での利用であれば実用上問題ありませんが、
共有コードを不特定多数に公開しないよう注意してください。

---

## 5. ローカル開発・Vercelへのデプロイ手順

### ローカルで動かす場合

```bash
npm install
cp .env.local.example .env.local
# .env.local を開き、Supabaseの値を貼り付け
npm run dev
```

`http://localhost:3000` にアクセスして動作確認できます。

### Vercelへのデプロイ

1. このプロジェクトをGitHubリポジトリにpush
2. https://vercel.com でアカウント作成し、「New Project」からリポジトリをインポート
3. 環境変数の設定画面で以下を追加
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 「Deploy」を実行
5. デプロイ完了後に発行されるURL（例：`https://xxxx.vercel.app`）が、
   家族に共有するアプリのURLになります

### 家族への共有方法

1. アプリのトップページで「新しいコードをおまかせ生成」を押し、
   6桁の共有コード（例：`AB3XY9`）を控える
2. 発行されたVercelのURLと、その共有コードを家族に伝える
3. 家族はそれぞれのiPhoneでURLを開き、同じコードを入力する
4. 以後は自動的に同じコードで再アクセスされる（localStorageに保存）

### ホーム画面への追加（PWA）

iPhone Safariでアプリを開いた状態で、
共有ボタン（□に↑のアイコン）→「ホーム画面に追加」を選択すると、
アイコンタップだけで起動できるようになります。

---

## 6. 実物地図画像への差し替え手順（最重要）

現在のプレースホルダーを、実際の2025年版台紙の地図画像に差し替える手順です。
**この作業では、地図をHTML/SVGで描き直すことは一切行いません。1枚の画像ファイルを差し替えるだけです。**

### 手順

1. 台紙の地図部分を、なるべく正面から撮影またはスキャンする
   （既に提供いただいている写真がベースになります）
2. 画像編集ソフト（プレビュー.app、Photoshop等、どれでも構いません）で以下の処理のみ行う
   - 地図部分のトリミング
   - 軽微な台形補正・遠近補正
   - 明るさ・コントラストの軽微な調整
   - **地図の内容（地形・道路・地名・番号・色）は一切変更しない**
3. 補正後の画像ファイルを `public/map/` フォルダに配置する
   （例：`public/map/hokkaido-map-2025.jpg`）
4. `src/lib/mapConfig.ts` を開き、以下の2箇所だけを書き換える

   ```typescript
   export const MAP_IMAGE_SRC = "/map/hokkaido-map-2025.jpg"; // ファイル名を変更
   export const MAP_IMAGE_WIDTH = 実画像の幅（px）;
   export const MAP_IMAGE_HEIGHT = 実画像の高さ（px）;
   ```

5. これだけで、アプリ全体（地図画面・マーカー・詳細シート等）が
   新しい画像を背景として使うようになります。コンポーネントの
   コードを変更する必要は一切ありません。

### 座標の調整

画像を差し替えると、131件のマーカー位置（現在は目視の暫定値）が
実画像上の正しい位置とズレます。ズレを直すには、
`src/data/stations.json` の該当する番号の `mapPosition.x` / `mapPosition.y`
を修正するだけで済みます。

```json
{
  "number": 42,
  "name": "横綱の里ふくしま",
  "mapPosition": { "x": 0.31, "y": 0.86 },
  ...
}
```

- `x`：画像の左端を0、右端を1とした横位置の割合
- `y`：画像の上端を0、下端を1とした縦位置の割合

座標の調整方法（推奨）：
1. 実画像をブラウザや画像ビューアで開く
2. 番号のピンズが写っている位置を目視し、画像全体に対するおおよその割合を計算する
   （例：画像の左から60%、上から40%の位置にある → `x: 0.60, y: 0.40`）
3. `stations.json` を更新し、アプリで見た目を確認しながら微調整する

すべて調整し終えたら、該当する駅の `isPositionVerified` を `true` に
変更しておくと、「まだ確認していない番号」が一目でわかります。

### 座標調整が完了したかの確認

```bash
node -e "
const stations = require('./src/data/stations.json');
const unverified = stations.filter(s => !s.isPositionVerified);
console.log('未検証の座標:', unverified.length, '件');
console.log(unverified.map(s => s.number));
"
```

すべて調整が終わると `未検証の座標: 0 件` と表示されます。

---

## 7. 駅名データについて

`src/data/stations.json` の各駅には `nameSource` フィールドがあり、
どの情報源から駅名を確定したかを記録しています。

- `"台紙"`：2025年版台紙の記載から直接判読
- `"公式"`：北海道版ガチャピンズラリー公式サイト等で補完
- `"要確認"`：現時点で未確定（33番のみ）

33番は台紙画像から駅名を確認できなかったため、`name: null` のまま
残されています。実物台紙で確認でき次第、`stations.json` の該当箇所を
直接編集してください。

---

## 8. データ整合性について

1〜131番の欠落・重複がないことは、データ生成時に検証済みです。
今後 `stations.json` を編集する場合は、以下のコマンドで
整合性を再確認できます。

```bash
node -e "
const stations = require('./src/data/stations.json');
const numbers = stations.map(s => s.number).sort((a,b) => a-b);
const expected = Array.from({length:131}, (_, i) => i+1);
const isValid = JSON.stringify(numbers) === JSON.stringify(expected);
console.log('1-131が過不足なく存在するか:', isValid);
"
```

---

## 9. ディレクトリ構成

```
michinoeki-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # グループコード入力画面
│   │   ├── globals.css
│   │   └── app/[groupCode]/page.tsx # メインアプリ画面
│   ├── components/
│   │   ├── AppScreen.tsx            # 地図/一覧を統括する親コンポーネント
│   │   ├── ProgressHeader.tsx
│   │   ├── BottomNav.tsx
│   │   ├── MapView/
│   │   │   ├── MapImage.tsx         # 地図画像の表示のみ担当
│   │   │   ├── MapOverlay.tsx       # 画像+マーカー+ズームパン
│   │   │   ├── ClickableMarker.tsx  # 透明タップ領域+取得状況表示
│   │   │   └── StationDetailSheet.tsx
│   │   └── ListView/
│   │       ├── SearchBar.tsx
│   │       ├── FilterChips.tsx
│   │       └── StationListItem.tsx
│   ├── data/
│   │   └── stations.json            # 131件の静的データ（唯一のデータソース）
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── useStations.ts           # 静的データ+Supabaseのマージ、Realtime購読
│   │   ├── groupCode.ts
│   │   └── mapConfig.ts             # 地図画像パスの一元管理（差し替えはここだけ）
│   └── types/
│       └── station.ts
├── public/
│   ├── map/hokkaido-map-placeholder.jpg  # 現在のプレースホルダー画像
│   ├── manifest.json
│   └── icons/
├── supabase/
│   └── setup.sql
└── .env.local.example
```

---

## 10. 今後の作業まとめ

- [ ] 実物の2025年版台紙画像を `public/map/` に配置し、`mapConfig.ts` を更新
- [ ] `stations.json` の131件の `mapPosition` を実画像に合わせて調整
- [ ] 33番の駅名を台紙原本で確認し、`stations.json` に反映
- [ ] Supabaseプロジェクトを作成し `setup.sql` を実行
- [ ] Vercelにデプロイし、環境変数を設定
- [ ] 家族共有コードを発行し、家族の端末で動作確認
