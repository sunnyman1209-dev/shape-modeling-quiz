/**
 * .env.local 의 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 를 Vercel Production에 올림
 */
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { spawnSync } from "child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadDotenv(p) {
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadDotenv(envPath);

const url = process.env.SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error(`
[vercel-push-env] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 없습니다.

Supabase → Project Settings → API
- Project URL → SUPABASE_URL
- service_role (secret) → SUPABASE_SERVICE_ROLE_KEY

.env.local 예시는 .env.local.example 참고
`);
  process.exit(1);
}

function add(name, value) {
  const r = spawnSync(
    "npx",
    [
      "vercel",
      "env",
      "add",
      name,
      "production",
      "--yes",
      "--force",
      "--value",
      value
    ],
    {
      cwd: root,
      encoding: "utf8",
      shell: true,
      env: { ...process.env }
    }
  );
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    process.exit(r.status || 1);
  }
  console.log(`[vercel-push-env] ${name} production OK`);
}

add("SUPABASE_URL", url);
add("SUPABASE_SERVICE_ROLE_KEY", key);
console.log("[vercel-push-env] Vercel Production 변수 반영 완료.");
