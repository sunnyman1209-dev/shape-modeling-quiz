import { NextResponse } from "next/server";
import { z } from "zod";

import { QUIZ_SUBJECT } from "@/lib/quiz-data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const bodySchema = z.object({
  studentId: z.string().trim().min(1).max(32),
  studentName: z.string().trim().min(1).max(64),
  score: z.number().int().min(0).max(100),
  subject: z.string().trim().min(1).max(64).optional()
});

export async function POST(request: Request) {
  try {
    const json: unknown = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const { studentId, studentName, score, subject } = parsed.data;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase.from("quiz_scores").insert({
      student_id: studentId,
      student_name: studentName,
      score,
      subject: subject ?? QUIZ_SUBJECT
    });

    if (error) {
      console.error("quiz_scores insert error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("submit-score error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
