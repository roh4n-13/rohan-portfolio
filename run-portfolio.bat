@echo off
cd /d "%~dp0"
if not exist package.json (
  if exist rohan-portfolio\package.json cd rohan-portfolio
)
if not exist package.json (
  echo package.json yahan nahi mila. Zip kis folder me extract hua, wo check karo.
  pause
  exit /b 1
)
if not exist node_modules call npm install
call npm run dev
pause
