# 형상모델링 검토 작업장 평가

NCS LM1501020213 · 20문항 객관식 퀴즈 (Vercel 배포 + Supabase 성적 저장)

## 배포 스택

- **Next.js 15** (App Router)
- **Supabase** (`quiz_scores` 테이블)
- **GitHub** + **Vercel**

## Supabase 설정

1. Supabase 프로젝트 → SQL Editor
2. `supabase/quiz_scores.sql` 실행

## 환경 변수 (Vercel)

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 로컬 실행

```bash
npm install
cp .env.example .env.local
# .env.local 값 입력
npm run dev
```

## 학생 접속

Vercel 배포 URL을 학생에게 공유합니다.
