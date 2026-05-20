interface ScorePayload {
  studentId: string;
  studentName: string;
  score: number;
  subject: string;
}

export async function appendScoreToGoogleSheet(payload: ScorePayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL is not configured");
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  const text = await res.text();
  let data: { ok?: boolean; error?: string } = {};
  try {
    data = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    if (!res.ok) {
      throw new Error(`Sheet webhook failed (${res.status})`);
    }
    return;
  }

  if (!res.ok || data.ok === false) {
    throw new Error(data.error ?? `Sheet webhook failed (${res.status})`);
  }
}
