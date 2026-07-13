@echo off
setlocal enabledelayedexpansion
title Gaji Harian - Windows (x64) Installer Builder

:: ===== Configuration =====
set "APP_NAME=Gaji Harian"
set "VS_PATH=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat"
set "VS_PATH_ALT=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
set "VS_PATH_ENT=C:\Program Files\Microsoft Visual Studio\2022\Enterprise\VC\Auxiliary\Build\vcvars64.bat"

echo ============================================
echo  %APP_NAME% - Windows (x64) Build
echo  Target: Intel / AMD 64-bit
echo ============================================
echo.

:: ===== Step 1: Detect Visual Studio vcvars64.bat =====
set "VCVARS="
if exist "%VS_PATH%" set "VCVARS=%VS_PATH%"
if exist "%VS_PATH_ALT%" set "VCVARS=%VS_PATH_ALT%"
if exist "%VS_PATH_ENT%" set "VCVARS=%VS_PATH_ENT%"

if "%VCVARS%"=="" (
    echo [ERROR] Visual Studio Build Tools tidak ditemukan!
    echo Pastikan salah satu path berikut ada:
    echo   - %VS_PATH%
    echo   - %VS_PATH_ALT%
    echo   - %VS_PATH_ENT%
    echo.
    echo Download: https://visualstudio.microsoft.com/downloads/
    pause
    exit /b 1
)

echo [1/6] Setting up MSVC environment...
call "%VCVARS%" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Gagal menjalankan vcvars64.bat!
    pause
    exit /b 1
)
echo        OK - MSVC environment loaded

:: ===== Step 2: Check Rust/Cargo =====
echo [2/6] Checking Rust toolchain...
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

cargo --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Cargo tidak ditemukan! Install Rust dari https://rustup.rs/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('cargo --version') do echo        %%i
for /f "tokens=*" %%i in ('rustc --version') do echo        %%i

:: ===== Step 3: Add Windows x86_64 target =====
echo [3/6] Adding Rust target x86_64-pc-windows-msvc...
rustup target add x86_64-pc-windows-msvc
echo        OK - Target x86_64-pc-windows-msvc ready

:: ===== Step 4: Check Node.js =====
echo [4/6] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo        Node.js %%i

:: ===== Step 5: Install npm dependencies (if needed) =====
echo [5/6] Checking npm dependencies...
cd /d "%~dp0"
if not exist "node_modules\" (
    echo        Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install gagal!
        pause
        exit /b 1
    )
) else (
    echo        OK - node_modules found
)

:: ===== Step 6: Build Frontend + Tauri NSIS Installer =====
echo [6/6] Building %APP_NAME% Windows (x64) NSIS installer...
echo        Target: x86_64-pc-windows-msvc ^(Intel / AMD 64-bit^)
echo        Ini mungkin memakan waktu beberapa menit...
echo.

call npm run tauri:build:windows-x64
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==============================================
    echo  [ERROR] Build gagal!
    echo  Periksa error di atas untuk detail.
    echo ==============================================
    pause
    exit /b 1
)

echo.
echo ==============================================
echo  SUCCESS! Windows (x64) installer berhasil dibuat.
echo.
echo  Target: Intel / AMD 64-bit
echo  Lokasi output:
echo  %~dp0src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\
echo ==============================================

:: Open the output folder
explorer "%~dp0src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\"

endlocal
exit /b 0