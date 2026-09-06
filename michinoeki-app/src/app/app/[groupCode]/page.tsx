"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { AppScreen } from "@/components/AppScreen";
import { isValidGroupCode, normalizeGroupCode, saveGroupCode } from "@/lib/groupCode";
import { useRouter } from "next/navigation";

export default function GroupAppPage() {
  const params = useParams();
  const router = useRouter();
  const rawCode = Array.isArray(params.groupCode)
    ? params.groupCode[0]
    : params.groupCode ?? "";
  const groupCode = normalizeGroupCode(rawCode);

  useEffect(() => {
    if (!isValidGroupCode(groupCode)) {
      router.replace("/");
      return;
    }
    // このURLで開いた場合も、以後の自動遷移のためにローカルへ保存しておく
    saveGroupCode(groupCode);
  }, [groupCode, router]);

  if (!isValidGroupCode(groupCode)) {
    return null;
  }

  return <AppScreen groupCode={groupCode} />;
}
