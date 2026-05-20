import { appendScoreToGoogleSheet } from "@/lib/grades/google-sheet";
import { appendScoreToLocalCsv } from "@/lib/grades/local-csv";
import { saveScoreToSupabase } from "@/lib/grades/supabase-score";

interface ScorePayload {
  studentId: string;
  studentName: string;
  score: number;
  subject: string;
}

export type SaveScoreMode = "local" | "db" | "sheet";

function useLocalCsv(): boolean {
  return process.env.LOCAL_GRADES === "true" || Boolean(process.env.GRADES_CSV_PATH?.trim());
}

function useSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

function useGoogleSheet(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim());
}

export async function saveScore(
  payload: ScorePayload
): Promise<{ mode: SaveScoreMode; path?: string }> {
  if (useLocalCsv()) {
    const path = appendScoreToLocalCsv(payload);
    return { mode: "local", path };
  }

  if (useSupabase()) {
    await saveScoreToSupabase(payload);
    return { mode: "db" };
  }

  if (useGoogleSheet()) {
    await appendScoreToGoogleSheet(payload);
    return { mode: "sheet" };
  }

  throw new Error(
    "성적 저장소가 없습니다. Vercel에 SUPABASE_URL·SUPABASE_SERVICE_ROLE_KEY를 넣거나 GOOGLE_SHEETS_WEBHOOK_URL을 설정하세요."
  );
}
