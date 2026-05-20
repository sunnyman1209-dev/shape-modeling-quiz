@echo off
chcp 65001 >nul
title 형상모델링 검토 - 학교 PC 서버

cd /d "%~dp0"

set LOCAL_GRADES=true
set GRADES_CSV_PATH=%USERPROFILE%\Desktop\형상모델링검토_성적.csv

echo ============================================
echo  형상모델링 검토 작업장 평가 (학교 PC 모드)
echo ============================================
echo.
echo  성적 저장 위치:
echo  %GRADES_CSV_PATH%
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
  set "IP=%%a"
  goto :foundip
)
:foundip
set IP=%IP: =%

echo  학생 접속 주소 (같은 와이파이/학교망):
if defined IP (
  echo    http://%IP%:3000
) else (
  echo    http://이PC의IP주소:3000
)
echo    http://localhost:3000  ^(이 PC에서만 테스트^)
echo.
echo  종료: 이 창에서 Ctrl+C
echo ============================================
echo.

if not exist "node_modules\" (
  echo [안내] 처음 1회 npm install 실행 중...
  call npm install
)

call npm run school

pause
