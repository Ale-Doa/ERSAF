@echo off
echo ========================================
echo   Weather App - Installazione
echo ========================================
echo.

echo [1/2] Installazione dipendenze backend...
cd backend
call npm install
if errorlevel 1 (
    echo Errore nell'installazione delle dipendenze backend
    pause
    exit /b 1
)

echo.
echo [2/2] Installazione dipendenze frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Errore nell'installazione delle dipendenze frontend
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installazione completata!
echo ========================================
echo.
echo Per avviare l'applicazione, esegui: start.bat
echo.
pause
