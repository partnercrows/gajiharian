# Panduan Instalasi — Gaji Harian

Aplikasi payroll harian yang berjalan 100% offline di komputer Anda — tanpa internet, tanpa server, tanpa akun.

## Prasyarat

- Windows 10 atau Windows 11, 64-bit (Intel/AMD).
- Ruang disk kosong minimal ±10 MB.

## 1. Download installer

Unduh file installer terbaru dari halaman Releases:

**https://github.com/partnercrows/gajiharian/releases/latest**

Ambil file bernama `Gaji Harian_x.x.x_x64-setup.exe` (angka versi bisa berbeda mengikuti rilis terbaru).

## 2. Jalankan installer

1. Buka file `.exe` yang sudah diunduh (biasanya di folder **Downloads**).
2. **Kemungkinan muncul peringatan biru "Windows protected your PC"** — ini normal, bukan tanda aplikasi berbahaya. Ini muncul karena installer belum memiliki sertifikat digital berbayar. Untuk lanjut:
   - Klik **"More info"** (Info lebih lanjut)
   - Klik **"Run anyway"** (Jalankan saja)
3. Pilih bahasa installer (English/Indonesian), klik **OK**.
4. Ikuti wizard instalasi: klik **Next** → **Install** → **Finish**.
5. Aplikasi akan otomatis terbuka setelah instalasi selesai (atau cari **"Gaji Harian"** di Start Menu).

### Kalau setelah klik installer tidak ada yang terjadi

Jendela installer kemungkinan terbuka **di belakang** aplikasi lain yang sedang Anda gunakan. Coba tekan **Alt+Tab** atau cek taskbar sebelum menganggap installer gagal.

## 3. Update ke versi baru

Setiap ada versi baru, cukup unduh installer terbaru dari halaman Releases yang sama dan jalankan lagi — proses instalasi akan menimpa versi lama secara otomatis. **Data Anda (invoice, draft, template) tidak akan hilang** karena tersimpan terpisah dari file program.

Meski begitu, selalu disarankan **export backup `.payroll`** sebelum update besar (lihat Panduan Penggunaan bagian "Backup & Pemulihan Data").

## 4. Uninstall

Buka **Settings → Apps → Installed apps**, cari **"Gaji Harian"**, klik **Uninstall**.

> Catatan: uninstall aplikasi **tidak otomatis menghapus data** payroll Anda karena tersimpan di penyimpanan lokal terpisah (IndexedDB browser/webview). Kalau ingin membersihkan total, export dulu backup `.payroll` sebagai arsip sebelum uninstall.

## Butuh bantuan?

Email: **partnercrows@gmail.com**
