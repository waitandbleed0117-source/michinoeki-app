// 家族共有用「グループコード」の管理
// パスワードなしの簡易共有方式：同じコードを知っている端末は同じデータを見る。
// セキュリティ上の注意：コードが漏れると誰でも読み書きできてしまうため、
// 家族内など信頼できる範囲での利用を前提とする。

const STORAGE_KEY = "michinoeki_group_code";

export function getSavedGroupCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function saveGroupCode(code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, normalizeGroupCode(code));
}

export function clearGroupCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function normalizeGroupCode(code: string): string {
  // 大文字小文字の揺れや前後の空白による意図しない別グループ化を防ぐ
  return code.trim().toUpperCase();
}

export function isValidGroupCode(code: string): boolean {
  const normalized = normalizeGroupCode(code);
  // 4〜20文字の英数字のみ許可（シンプルなルール）
  return /^[A-Z0-9]{4,20}$/.test(normalized);
}

// 家族が最初に決める共有コードの候補を生成（UIの「おまかせ生成」ボタン用）
export function generateRandomGroupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 紛らわしい0/O, 1/Iを除外
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
