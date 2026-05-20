# 형상모델링 검토 작업장 평가

학생은 **언제든** 링크만 열고 시험 → 제출 내역은 **한 곳에 쌓임** → 교사는 나중에 **대시보드에서만** 확인.

## 학생 접속 (고정 링크)

https://shape-modeling-quiz.vercel.app

(로그인 없음 · 학번·이름만 입력)

---

## 성적이 쌓이는 곳 (택 1)

**우선순위:** 학교 PC 모드(`LOCAL_GRADES`) 켜져 있으면 → 바탕화면 CSV.  
아니면 **Supabase** → **Google 스프레드시트** 순으로 설정된 것을 사용합니다.

### A) Supabase (스프레드시트 없이 추천)

1. [Supabase](https://supabase.com) 프로젝트 → **SQL Editor**
2. `supabase/quiz_scores.sql` 전체 실행
3. **Project Settings → API** 에서 URL과 **service_role** 키 복사
4. **Vercel** → `shape-modeling-quiz` → Environment Variables:

   | 이름 | 값 |
   |------|-----|
   | `SUPABASE_URL` | Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 |

5. **Redeploy**

**나중에 확인:** Supabase 대시보드 → **Table Editor** → `quiz_scores` (필요하면 CSV 내보내기)

### B) Google 스프레드시트

`README` 하단 또는 `docs/형상모델링검토_스프레드시트_연동_안내.md` 참고.  
`GOOGLE_SHEETS_WEBHOOK_URL`만 넣어도 됩니다 (Supabase 없을 때).

---

## 학교 PC만 쓸 때

바탕화면 **`형상모델링검토_학교PC_시작.bat`** → 나온 주소로 접속. 성적은 **`형상모델링검토_성적.csv`**.

---

## 로컬 개발

```bash
npm install
cp .env.example .env.local
npm run dev
```
