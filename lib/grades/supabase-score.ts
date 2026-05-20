import { getSupabaseAdmin } from "@/lib/supabase/admin";

interface ScorePayload {
  studentId: string;
  studentName: string;
  score: number;
  subject: string;
}

export async function saveScoreToSupabase(payload: ScorePayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("quiz_scores").insert({
    student_id: payload.studentId,
    student_name: payload.studentName,
    score: payload.score,
    subject: payload.subject
  });

  if (error) {
    throw new Error(error.message);
  }
}
