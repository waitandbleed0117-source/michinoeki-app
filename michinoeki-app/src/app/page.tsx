"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateRandomGroupCode,
  getSavedGroupCode,
  isValidGroupCode,
  normalizeGroupCode,
  saveGroupCode,
} from "@/lib/groupCode";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkedSaved, setCheckedSaved] = useState(false);

  useEffect(() => {
    const saved = getSavedGroupCode();
    if (saved) {
      router.replace(`/app/${saved}`);
    } else {
      setCheckedSaved(true);
    }
  }, [router]);

  function handleEnter() {
    const normalized = normalizeGroupCode(code);
    if (!isValidGroupCode(normalized)) {
      setErrorMsg("英数字4〜20文字で入力してください");
      return;
    }
    saveGroupCode(normalized);
    router.push(`/app/${normalized}`);
  }

  function handleGenerate() {
    const generated = generateRandomGroupCode();
    setCode(generated);
    setErrorMsg(null);
  }

  if (!checkedSaved) {
    return null; // 保存済みコードの確認中はちらつき防止のため何も表示しない
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "24px",
        background: "#f0fdf4",
      }}
    >
      <div
        style={{
          maxWidth: 380,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          北海道 道の駅
        </h1>
        <p
          style={{
            fontSize: 16,
            textAlign: "center",
            color: "#16a34a",
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          ガチャピンズラリー 家族共有
        </p>

        <label
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            display: "block",
            marginBottom: 6,
          }}
        >
          家族共有コード
        </label>
        <input
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setErrorMsg(null);
          }}
          placeholder="例：ABC123"
          style={{
            width: "100%",
            padding: "14px 16px",
            fontSize: 18,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            boxSizing: "border-box",
            textAlign: "center",
            letterSpacing: 2,
          }}
        />
        {errorMsg && (
          <p style={{ color: "#dc2626", fontSize: 13, marginTop: 6 }}>
            {errorMsg}
          </p>
        )}

        <button
          type="button"
          onClick={handleEnter}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "16px 0",
            fontSize: 17,
            fontWeight: 700,
            color: "white",
            background: "#16a34a",
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
          }}
        >
          このコードで始める
        </button>

        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid #d1fae5",
          }}
        >
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
            初めて使う場合は、新しいコードを作って家族に共有してください。
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            style={{
              width: "100%",
              padding: "12px 0",
              fontSize: 15,
              fontWeight: 600,
              color: "#16a34a",
              background: "white",
              border: "1px solid #16a34a",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            新しいコードをおまかせ生成
          </button>
        </div>
      </div>
    </div>
  );
}
