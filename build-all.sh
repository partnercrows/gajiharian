set -euo pipefail

APP_NAME="Gaji Harian"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OS="$(uname -s)"

echo "============================================================"
echo " $APP_NAME - MULTI-PLATFORM BUILD MASTER SCRIPT"
echo "============================================================"
echo ""
echo "  Platform yang akan di-build:"
echo "    1. Linux (.deb)       - Debian / Ubuntu / Mint  [.deb package]"
echo "    2. Linux (AppImage)   - Portable - All Distros  [AppImage]"
echo "    3. macOS (Universal)  - Intel + Apple Silicon  [DMG]"
echo ""
echo "  Sistem saat ini: $OS"
echo "  CATATAN: Build macOS hanya bisa di macOS!"
echo "           Build Linux hanya bisa di Linux!"
echo "           Untuk Windows, jalankan build-all.bat di Windows."
echo ""
echo "============================================================"
echo "  Pilih build yang ingin dijalankan:"
echo "============================================================"
echo ""
echo "  [1] Build Linux (.deb) - Debian / Ubuntu / Mint"
echo "  [2] Build Linux (AppImage) - Portable - All Distros"
echo "  [3] Build Linux (.deb) + (AppImage) [BOTH Linux]"
echo "  [4] Build macOS (Universal) - Intel + Apple Silicon"
echo "  [5] Build SEMUA platform yang tersedia di sistem ini"
echo "  [6] Exit"
echo ""
read -rp "Masukkan pilihan (1-6): " CHOICE

case "$CHOICE" in
  1)
    echo ""
    echo "=========================================="
    echo " Building Linux (.deb) - Debian/Ubuntu/Mint"
    echo "=========================================="
    echo ""
    if [ "$OS" != "Linux" ]; then
      echo "[ERROR] Build Linux hanya bisa dilakukan di Linux!"
      echo "Sistem saat ini: $OS"
      exit 1
    fi
    bash "$SCRIPT_DIR/build-linux-deb.sh"
    ;;
  2)
    echo ""
    echo "=========================================="
    echo " Building Linux (AppImage) - Portable"
    echo "=========================================="
    echo ""
    if [ "$OS" != "Linux" ]; then
      echo "[ERROR] Build Linux hanya bisa dilakukan di Linux!"
      echo "Sistem saat ini: $OS"
      exit 1
    fi
    bash "$SCRIPT_DIR/build-linux-appimage.sh"
    ;;
  3)
    echo ""
    echo "=========================================="
    echo " Building ALL Linux Formats"
    echo "=========================================="
    echo ""
    if [ "$OS" != "Linux" ]; then
      echo "[ERROR] Build Linux hanya bisa dilakukan di Linux!"
      echo "Sistem saat ini: $OS"
      exit 1
    fi
    echo "[1/2] Building Linux (.deb)..."
    bash "$SCRIPT_DIR/build-linux-deb.sh"
    echo ""
    echo "[2/2] Building Linux (AppImage)..."
    bash "$SCRIPT_DIR/build-linux-appimage.sh"
    ;;
  4)
    echo ""
    echo "=========================================="
    echo " Building macOS (Universal) DMG"
    echo "=========================================="
    echo ""
    if [ "$OS" != "Darwin" ]; then
      echo "[ERROR] Build macOS hanya bisa dilakukan di macOS!"
      echo "Sistem saat ini: $OS"
      exit 1
    fi
    bash "$SCRIPT_DIR/build-macos.sh"
    ;;
  5)
    echo ""
    echo "=========================================="
    echo " Building SEMUA Platform untuk sistem ini"
    echo "=========================================="
    echo ""
    if [ "$OS" = "Linux" ]; then
      echo "[1/2] Building Linux (.deb)..."
      bash "$SCRIPT_DIR/build-linux-deb.sh"
      echo ""
      echo "[2/2] Building Linux (AppImage)..."
      bash "$SCRIPT_DIR/build-linux-appimage.sh"
    elif [ "$OS" = "Darwin" ]; then
      echo "[1/1] Building macOS (Universal) DMG..."
      bash "$SCRIPT_DIR/build-macos.sh"
    else
      echo "[ERROR] Sistem $OS tidak mendukung build native."
      echo "Gunakan script .bat untuk Windows."
      exit 1
    fi
    ;;
  6)
    echo "Exit."
    exit 0
    ;;
  *)
    echo "Pilihan tidak valid!"
    exit 1
    ;;
esac

echo ""
echo "============================================================"
echo " Build selesai!"
echo ""
if [ "$OS" = "Linux" ]; then
  echo " Output Linux (.deb):"
  echo " $SCRIPT_DIR/src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/deb/"
  echo ""
  echo " Output Linux (AppImage):"
  echo " $SCRIPT_DIR/src-tauri/target/x86_64-unknown-linux-gnu/release/bundle/appimage/"
elif [ "$OS" = "Darwin" ]; then
  echo " Output macOS (DMG):"
  echo " $SCRIPT_DIR/src-tauri/target/universal-apple-darwin/release/bundle/dmg/"
fi
echo ""
echo " Untuk Windows, jalankan build-all.bat di Windows."
echo "============================================================"

exit 0