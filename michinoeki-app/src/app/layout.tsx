import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "道の駅ガチャピンズラリー",
  description: "北海道 道の駅ガチャピンズラリー 家族共有アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "道の駅ラリー",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // ページ全体の拡大縮小はさせず、地図内のピンチズームのみ有効にする
  userScalable: false,
  viewportFit: "cover", // iPhoneのノッチ/ホームバー対応
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
