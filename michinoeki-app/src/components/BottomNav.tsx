"use client";

export type ViewMode = "map" | "list";

interface BottomNavProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        background: "white",
        borderTop: "1px solid #e5e7eb",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 30,
      }}
    >
      {(
        [
          { mode: "map" as const, label: "地図", icon: "🗺️" },
          { mode: "list" as const, label: "一覧", icon: "📋" },
        ]
      ).map((item) => (
        <button
          key={item.mode}
          type="button"
          onClick={() => onChange(item.mode)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: "10px 0",
            minHeight: 56,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: current === item.mode ? "#16a34a" : "#9ca3af",
            fontWeight: current === item.mode ? 700 : 500,
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</span>
          <span style={{ fontSize: 12 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
