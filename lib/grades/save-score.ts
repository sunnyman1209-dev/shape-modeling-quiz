import { appendScoreToGoogleSheet } from "@/lib/grades/google-sheet";
import { appendScoreToLocalCsv } from "@/lib/grades/local-csv";

interface ScorePayload {
  studentId: string;
  studentName: string;
  score: number;
  subject: string;
}

function useLocalCsv(): boolean {
  return process.env.LOCAL_GRADES === "true" || Boolean(process.env.GRADES_CSV_PATH?.trim());
}

export async function saveScore(payload: ScorePayload): Promise<{ mode: "local" | "sheet"; path?: string }> {
  if (useLocalCsv()) {
    const path = appendScoreToLocalCsv(payload);
    return { mode: "local", path };
  }

  await appendScoreToGoogleSheet(payload);
  return { mode: "sheet" };
}
