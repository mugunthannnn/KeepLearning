@echo off
TITLE keepLearning - Full-Stack Development Runner
echo ======================================================================
echo keepLearning: AI-Powered Revision Plans ^& Knowledge Drift Prediction
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python virtual environment...
if not exist "backend\venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv backend\venv
    call backend\venv\Scripts\pip.exe install -r backend\requirements.txt
)

echo [2/3] Checking Node modules for Frontend...
if not exist "KeepLearning\node_modules" (
    echo Installing frontend dependencies...
    cd KeepLearning && npm install && cd ..
)

echo [3/3] Launching Backend and Frontend concurrently...
echo.
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "keepLearning Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Vite Frontend on http://127.0.0.1:5173 ...
start "keepLearning Frontend (Vite/React)" cmd /k "cd KeepLearning && npm run dev"

echo.
echo ======================================================================
echo keepLearning is now running!
echo   Frontend Application: http://localhost:5173
echo   Backend API Docs:     http://localhost:8000/docs
echo ======================================================================
pause
