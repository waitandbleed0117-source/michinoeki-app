"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      inputMode="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="駅名で検索（例：三笠）"
      style={{
        width: "100%",
        padding: "12px 14px",
        fontSize: 16, // 16px以上でSafariの自動ズームを防止
        borderRadius: 12,
        border: "1px solid #d1d5db",
        outline: "none",
        boxSizing: "border-box",
      }}
    />
  );
}
