@echo off
echo ========================================
echo   Weather App - Avvio Applicazione
echo ========================================
echo.

echo [1/4] Installazione dipendenze backend...
cd backend
call npm install
if errorlevel 1 (
    echo Errore nell'installazione delle dipendenze backend
    pause
    exit /b 1
)

echo.
echo [2/4] Installazione dipendenze frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Errore nell'installazione delle dipendenze frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Avvio backend su porta 5000...
cd ..\backend
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo.
echo [4/4] Avvio frontend su porta 3000...
cd ..\frontend
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Applicazione avviata con successo!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Premi un tasto per chiudere questa finestra...
pause >nul
