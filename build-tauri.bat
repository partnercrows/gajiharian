@echo off
setlocal enabledelayedexpansion
title Gaji Harian - Installer Builder

:: ===== Configuration =====
set "APP_NAME=Gaji Harian"

echo ============================================
echo  %APP_NAME% - NSIS Installer Builder
echo ============================================
echo.
echo  CATATAN: Skrip ini SENGAJA tidak memuat vcvars64.bat.
echo  rustc/cargo mendeteksi MSVC toolchain sendiri lewat registry.
echo  Memuat vcvars64.bat di sini terbukti mengubah environment
echo  sehingga proses build frontend (Vite) menghasilkan bundle
echo  yang berbeda dan RUSAK (crash "This page didn't load").
echo  Pastikan Visual Studio Build Tools (workload "Desktop
echo  development with C++") sudah terinstall di sistem ini.
echo.

:: ===== Step 1: Check Rust/Cargo =====
echo [1/4] Checking Rust toolchain...
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

cargo --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Cargo tidak ditemukan! Install Rust dari https://rustup.rs/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('cargo --version') do echo        %%i
for /f "tokens=*" %%i in ('rustc --version') do echo        %%i

:: ===== Step 2: Check Node.js =====
echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan!
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo        Node.js %%i

:: ===== Step 3: Install npm dependencies (if needed) =====
echo [3/4] Checking npm dependencies...
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

:: ===== Step 4: Build Frontend + Tauri NSIS Installer =====
echo [4/4] Building %APP_NAME% NSIS installer...
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
echo  SUCCESS! Installer berhasil dibuat.
echo.
echo  Lokasi output:
echo  %~dp0src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\
echo ==============================================

:: Open the output folder
explorer "%~dp0src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\"

endlocal
exit /b 0
