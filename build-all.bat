@echo off
setlocal enabledelayedexpansion
title Gaji Harian - Build All Platforms

set "APP_NAME=Gaji Harian"
set "SCRIPT_DIR=%~dp0"

echo ============================================================
echo  %APP_NAME% - MULTI-PLATFORM BUILD MASTER SCRIPT
echo ============================================================
echo.
echo  Platform yang akan di-build:
echo    1. Windows (x64)      - Intel / AMD 64-bit  [NSIS installer]
echo    2. Windows (ARM64)    - Snapdragon / Surface Pro X  [NSIS installer]
echo    3. Linux (.deb)       - Debian / Ubuntu / Mint  [.deb package]
echo    4. Linux (AppImage)   - Portable - All Distros  [AppImage]
echo    5. macOS (Universal)  - Intel + Apple Silicon  [DMG]
echo.
echo  CATATAN: Build macOS hanya bisa dilakukan di macOS!
echo           Build Linux hanya bisa dilakukan di Linux!
echo           Gunakan CI/CD untuk cross-platform build.
echo.
echo ============================================================
echo  Pilih build yang ingin dijalankan:
echo ============================================================
echo.
echo  [1] Build Windows (x64) - Intel / AMD 64-bit
echo  [2] Build Windows (ARM64) - Snapdragon / Surface Pro X
echo  [3] Build Windows (x64) + (ARM64) [BOTH Windows]
echo  [4] Build SEMUA platform yang tersedia di sistem ini
echo  [5] Exit
echo.
set /p CHOICE="Masukkan pilihan (1-5): "

if "%CHOICE%"=="1" goto :BUILD_WIN64
if "%CHOICE%"=="2" goto :BUILD_WINARM64
if "%CHOICE%"=="3" goto :BUILD_WIN_ALL
if "%CHOICE%"=="4" goto :BUILD_ALL
if "%CHOICE%"=="5" goto :EXIT

echo Pilihan tidak valid!
pause
goto :EOF

:BUILD_WIN64
echo.
echo ==========================================
echo  Building Windows (x64) - Intel/AMD 64-bit
echo ==========================================
echo.
call "%SCRIPT_DIR%build-windows-x64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (x64) build gagal!
) else (
    echo [OK] Windows (x64) build berhasil!
)
goto :DONE

:BUILD_WINARM64
echo.
echo ==========================================
echo  Building Windows (ARM64) - Snapdragon
echo ==========================================
echo.
call "%SCRIPT_DIR%build-windows-arm64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (ARM64) build gagal!
) else (
    echo [OK] Windows (ARM64) build berhasil!
)
goto :DONE

:BUILD_WIN_ALL
echo.
echo ==========================================
echo  Building ALL Windows Platforms
echo ==========================================
echo.

echo [1/2] Building Windows (x64)...
call "%SCRIPT_DIR%build-windows-x64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (x64) build gagal!
) else (
    echo [OK] Windows (x64) build berhasil!
)

echo.
echo [2/2] Building Windows (ARM64)...
call "%SCRIPT_DIR%build-windows-arm64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (ARM64) build gagal!
) else (
    echo [OK] Windows (ARM64) build berhasil!
)
goto :DONE

:BUILD_ALL
echo.
echo ==========================================
echo  Building SEMUA Platform
echo ==========================================
echo.

echo [1/5] Building Windows (x64) - Intel/AMD 64-bit...
call "%SCRIPT_DIR%build-windows-x64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (x64) build gagal!
) else (
    echo [OK] Windows (x64) build berhasil!
)

echo.
echo [2/5] Building Windows (ARM64) - Snapdragon...
call "%SCRIPT_DIR%build-windows-arm64.bat"
if %ERRORLEVEL% NEQ 0 (
    echo [FAILED] Windows (ARM64) build gagal!
) else (
    echo [OK] Windows (ARM64) build berhasil!
)

echo.
echo [3/5] Building Linux (.deb) - Debian/Ubuntu/Mint...
echo        (Hanya bisa di-build di Linux, skip jika di Windows)
if exist "%SCRIPT_DIR%build-linux-deb.sh" (
    echo        Script build-linux-deb.sh tersedia.
    echo        Jalankan di Linux: bash build-linux-deb.sh
) else (
    echo        Script tidak ditemukan.
)

echo.
echo [4/5] Building Linux (AppImage) - Portable...
echo        (Hanya bisa di-build di Linux, skip jika di Windows)
if exist "%SCRIPT_DIR%build-linux-appimage.sh" (
    echo        Script build-linux-appimage.sh tersedia.
    echo        Jalankan di Linux: bash build-linux-appimage.sh
) else (
    echo        Script tidak ditemukan.
)

echo.
echo [5/5] Building macOS (Universal) - Intel+Apple Silicon...
echo        (Hanya bisa di-build di macOS, skip jika di Windows)
if exist "%SCRIPT_DIR%build-macos.sh" (
    echo        Script build-macos.sh tersedia.
    echo        Jalankan di macOS: bash build-macos.sh
) else (
    echo        Script tidak ditemukan.
)

goto :DONE

:DONE
echo.
echo ============================================================
echo  Build selesai!
echo.
echo  Output Windows (x64):
echo  %SCRIPT_DIR%src-tauri\target\x86_64-pc-windows-msvc\release\bundle\nsis\
echo.
echo  Output Windows (ARM64):
echo  %SCRIPT_DIR%src-tauri\target\aarch64-pc-windows-msvc\release\bundle\nsis\
echo.
echo  Untuk Linux dan macOS, jalankan script .sh di sistem masing-masing.
echo ============================================================
pause

:EXIT
endlocal
exit /b 0