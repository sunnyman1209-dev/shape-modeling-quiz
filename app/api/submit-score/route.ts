import { NextResponse } from "next/server";
import { z } from "zod";

import { appendScoreToGoogleSheet } from "@/lib/grades/google-sheet";
import { QUIZ_SUBJECT } from "@/lib/quiz-data";

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
    const payload = {
      studentId,
      studentName,
      score,
      subject: subject ?? QUIZ_SUBJECT
    };

    await appendScoreToGoogleSheet(payload);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    console.error("submit-score error:", e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
