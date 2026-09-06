"use client";

export type FilterMode = "all" | "acquired" | "notAcquired";

interface FilterChipsProps {
  current: FilterMode;
  onChange: (mode: FilterMode) => void;
  acquiredCount: number;
  notAcquiredCount: number;
  totalCount: number;
}

export function FilterChips({
  current,
  onChange,
  acquiredCount,
  notAcquiredCount,
  totalCount,
}: FilterChipsProps) {
  const options: { mode: FilterMode; label: string; count: number }[] = [
    { mode: "all", label: "全て", count: totalCount },
    { mode: "acquired", label: "取得済み", count: acquiredCount },
    { mode: "notAcquired", label: "未取得", count: notAcquiredCount },
  ];

  return (
    <div style={{ display: "flex", gap: 8, padding: "10px 0" }}>
      {options.map((opt) => (
        <button
          key={opt.mode}
          type="button"
          onClick={() => onChange(opt.mode)}
          style={{
            flex: 1,
            padding: "10px 4px",
            borderRadius: 10,
            border:
              current === opt.mode ? "2px solid #16a34a" : "1px solid #d1d5db",
            background: current === opt.mode ? "#f0fdf4" : "white",
            color: current === opt.mode ? "#16a34a" : "#374151",
            fontWeight: current === opt.mode ? 700 : 500,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {opt.label}（{opt.count}）
        </button>
      ))}
    </div>
  );
}
