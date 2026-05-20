import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { homedir } from "os";

interface ScorePayload {
  studentId: string;
  studentName: string;
  score: number;
  subject: string;
}

const CSV_HEADER = "제출일시,학번,이름,과목,점수\n";
const UTF8_BOM = "\uFEFF";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function resolveGradesCsvPath(): string {
  const fromEnv = process.env.GRADES_CSV_PATH?.trim();
  if (fromEnv) return fromEnv;

  return join(homedir(), "Desktop", "형상모델링검토_성적.csv");
}

export function appendScoreToLocalCsv(payload: ScorePayload): string {
  const filePath = resolveGradesCsvPath();
  const dir = dirname(filePath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (!existsSync(filePath)) {
    writeFileSync(filePath, UTF8_BOM + CSV_HEADER, "utf8");
  }

  const submittedAt = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const row = [
    escapeCsv(submittedAt),
    escapeCsv(payload.studentId),
    escapeCsv(payload.studentName),
    escapeCsv(payload.subject),
    String(payload.score)
  ].join(",");

  appendFileSync(filePath, `${row}\n`, "utf8");
  return filePath;
}
