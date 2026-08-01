@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 tools\przebuduj_poradnik.py --root .
) else (
  python tools\przebuduj_poradnik.py --root .
)
if errorlevel 1 (
  echo.
  echo PRZEBUDOWA NIE ZOSTALA ZAKONCZONA. Przeczytaj komunikat powyzej.
  pause
  exit /b 1
)
echo.
echo GOTOWE. Naglowek, menu i stopka zostaly ujednolicone.
pause
