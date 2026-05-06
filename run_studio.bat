@echo off
SETLOCAL
cd /d %~dp0

:: Check if node_modules exists, if not, install dependencies
if not exist "node_modules\" (
    echo [STUDIO] node_modules not found. Installing dependencies...
    call npm install
)

echo [STUDIO] Starting Harness Engineering Studio...
:: Using 'call' to ensure the batch script continues if npm finishes or restarts
call npm run dev

pause
