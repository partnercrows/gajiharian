#!/usr/bin/env bash
set -euo pipefail

APP_NAME="Gaji Harian"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo " $APP_NAME - Linux (AppImage) Build"
echo " Target: Portable - All Distros (x86_64)"
echo "============================================"
echo ""

# ===== Step 1: Check Rust/Cargo =====
echo "[1/5] Checking Rust toolchain..."
if ! command -v cargo &> /dev/null; then
    echo "[ERROR] Cargo tidak ditemukan! Install Rust dari https://rustup.rs/"
    exit 1
fi
cargo --version
rustc --version

# ===== Step 2: Add Linux x86_64 target =====
echo "[2/5] Adding Rust target x86_64-unknown-linux-gnu..."
rustup target add x86_64-unknown-linux-gnu
echo "       OK - Target x86_64-unknown-linux-gnu ready"

# ===== Step 3: Check Node.js =====
echo "[3/5] Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js tidak ditemukan!"
    exit 1
fi
echo "       Node.js $(node --version)"

# ===== Step 4: Install npm dependencies (if needed) =====
echo "[4/5] Checking npm dependencies..."
cd "$SCRIPT_DIR"
if [ ! -d "node_modules" ]; then
    echo "       Installing dependencies..."
    npm install
fi
echo "       OK - node_modules found"

# ===== Step 5: Build Frontend + Tauri AppImage =====
echo "[5/5] Building $APP_NAME Linux (AppImage)..."
echo "       Target: x86_64-unknown-linux-gnu (Portable - All Distros)"
echo "       Ini mungkin memakan waktu beberapa menit..."
echo ""

npm run tauri:build:linux-appimage
if [ $? -ne 0 ]; then
    echo ""
    echo "============================================="
    echo " [ERROR] Build gagal!"
    echo " Periksa error di atas untuk detail."
    echo "============================================="
    exit 1
fi

echo ""
echo "============================================="
echo " SUCCESS! Linux (AppImage) berhasil dibuat."
echo ""
echo " Target: Portable - All Distros (x86_64)"
echo " Lokasi output:"
echo " $SCRIPT_DIR/src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/"
echo "============================================="

exit 0