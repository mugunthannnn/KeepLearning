# keepLearning One-Click PowerShell Development Launcher
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "keepLearning: AI-Powered Revision Plans & Knowledge Drift Prediction" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Virtual environment check
if (-not (Test-Path "$root\backend\venv\Scripts\python.exe")) {
    Write-Host "[1/3] Creating Python virtual environment and installing backend packages..." -ForegroundColor Yellow
    python -m venv "$root\backend\venv"
    & "$root\backend\venv\Scripts\pip.exe" install -r "$root\backend\requirements.txt"
} else {
    Write-Host "[1/3] Backend Python virtual environment verified." -ForegroundColor Green
}

# 2. Node modules check
if (-not (Test-Path "$root\KeepLearning\node_modules")) {
    Write-Host "[2/3] Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location "$root\KeepLearning"
    npm install
    Pop-Location
} else {
    Write-Host "[2/3] Frontend dependencies verified." -ForegroundColor Green
}

# 3. Launch Services
Write-Host "[3/3] Launching Backend and Frontend concurrently..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; & '$root\backend\venv\Scripts\python.exe' -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\KeepLearning'; npm run dev"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "keepLearning Full-Stack Application is running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000 (Docs: http://localhost:8000/docs)" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
