/**
 * 형상모델링 검토 성적표 연동용 Apps Script
 *
 * 1. Google 스프레드시트(엑셀처럼 사용) 새로 만들기
 * 2. 1행에 헤더 입력: 제출일시 | 학번 | 이름 | 과목 | 점수
 * 3. 확장 프로그램 → Apps Script → 이 코드 전체 붙여넣기
 * 4. 배포 → 새 배포 → 유형: 웹 앱, 액세스: 모든 사용자
 * 5. 웹 앱 URL을 Vercel 환경변수 GOOGLE_SHEETS_WEBHOOK_URL 에 등록
 */

function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    const body = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["제출일시", "학번", "이름", "과목", "점수"]);
    }

    const submittedAt = Utilities.formatDate(
      new Date(),
      "Asia/Seoul",
      "yyyy-MM-dd HH:mm:ss"
    );

    sheet.appendRow([
      submittedAt,
      String(body.studentId || ""),
      String(body.studentName || ""),
      String(body.subject || "형상모델링검토"),
      Number(body.score)
    ]);

    lock.releaseLock();

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
