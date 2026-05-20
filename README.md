# 형상모델링 검토 작업장 평가

NCS LM1501020213 · 20문항 · Vercel 배포 · **Google 스프레드시트(엑셀) 성적 수집**

## 학생 접속

https://shape-modeling-quiz.vercel.app

## 성적표(엑셀) 연결 방법

### 1) 성적표 파일 만들기

1. [Google 스프레드시트](https://sheets.google.com) 새 문서 생성  
2. `docs/형상모델링검토_성적표_템플릿.csv` 를 가져오기 하거나, 1행에 직접 입력:

   `제출일시 | 학번 | 이름 | 과목 | 점수`

3. 파일 이름 예: `형상모델링검토_성적표`

엑셀(.xlsx)로 관리하려면 시트에서 **파일 → 다운로드 → Microsoft Excel** 로 저장하면 됩니다.

### 2) Apps Script 연결

1. 스프레드시트 → **확장 프로그램 → Apps Script**
2. `scripts/grade-sheet-webhook.gs` 내용 전체 붙여넣기 → 저장
3. **배포 → 새 배포** → 유형 **웹 앱**
   - 실행: 나
   - 액세스: **모든 사용자**
4. 생성된 **웹 앱 URL** 복사

### 3) Vercel 환경 변수

프로젝트 **Settings → Environment Variables**:

| 이름 | 값 |
|------|-----|
| `GOOGLE_SHEETS_WEBHOOK_URL` | 위 웹 앱 URL |

저장 후 **Redeploy** (재배포) 1회.

## 로컬 개발

```bash
npm install
cp .env.example .env.local
# .env.local 에 GOOGLE_SHEETS_WEBHOOK_URL 입력
npm run dev
```
