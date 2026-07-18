# Panduan Penggunaan — Gaji Harian

Panduan lengkap menggunakan aplikasi Gaji Harian untuk membuat invoice payroll pekerja harian.

## Daftar Isi

1. [Alur Kerja Singkat](#1-alur-kerja-singkat)
2. [Dashboard](#2-dashboard)
3. [Editor Gaji](#3-editor-gaji)
4. [Kolom Karyawan](#4-kolom-karyawan)
5. [Catatan per Karyawan](#5-catatan-per-karyawan)
6. [Slip Gaji & Cetak Invoice](#6-slip-gaji--cetak-invoice)
7. [Draft Proyek](#7-draft-proyek)
8. [Template Pekerja](#8-template-pekerja)
9. [Pengaturan Perusahaan](#9-pengaturan-perusahaan)
10. [Backup & Pemulihan Data](#10-backup--pemulihan-data)
11. [Tema Tampilan](#11-tema-tampilan)
12. [Tips & FAQ](#12-tips--faq)

---

## 1. Alur Kerja Singkat

1. Buka **Editor Gaji**.
2. Isi detail invoice (judul proyek, tanggal, penanggung jawab).
3. Tambahkan karyawan — manual, import Excel, atau muat dari template.
4. Isi upah harian, hari kerja, lembur, dan kasbon tiap karyawan.
5. **Simpan Draft** untuk disimpan, atau **Pratinjau & Cetak** untuk cetak/export PDF.

## 2. Dashboard

Halaman pertama saat membuka aplikasi. Menampilkan ringkasan: total invoice saat ini, jumlah karyawan di editor, jumlah draft tersimpan, draft terbaru, dan daftar template pekerja. Ada 3 tombol pintasan: **Input Manual**, **Impor Excel**, **Muat Template**.

## 3. Editor Gaji

Halaman utama untuk membuat invoice. Bagian atas berisi detail invoice:

- **Judul Proyek**, **Nomor Invoice** (otomatis, bisa diubah)
- **Tanggal Pembayaran**, **Penanggung Jawab**
- **Metode Pembayaran** (Tunai/Transfer Bank/E-Wallet — kalau Transfer, muncul field nama bank & no. rekening)
- **Periode Penggajian** (opsional, rentang tanggal)
- **Catatan** (opsional, catatan umum untuk seluruh invoice — beda dari catatan per karyawan)

Tombol toolbar:

| Tombol | Fungsi |
|---|---|
| **Simpan Template** | Simpan daftar karyawan saat ini sebagai template untuk dipakai ulang |
| **Simpan Draft** | Simpan invoice ini sebagai draft (juga tersimpan otomatis tiap 30 detik) |
| **···** (menu lain) | Invoice Baru, Buka file `.payroll`, Export `.payroll`, Buka dari Draft |
| **Pratinjau & Cetak** | Validasi data lalu buka halaman cetak invoice |

## 4. Kolom Karyawan

Tiap baris karyawan di tabel **Daftar Karyawan** punya kolom:

| Kolom | Keterangan |
|---|---|
| Nama Karyawan | Nama pekerja |
| Upah per Hari | Upah harian (Rp) |
| Hari | Jumlah hari kerja |
| **Lembur** | Tambahan lembur (Rp) — **menambah** total gaji |
| **Kasbon** | Potongan/kasbon (Rp) — **mengurangi** total gaji |
| Total | Otomatis: `(Upah × Hari) + Lembur − Kasbon` |
| Status | Klik untuk toggle Lunas/Belum Lunas |
| Aksi | Catatan, Slip Gaji, Duplikat baris, Hapus baris |

**Tambah karyawan** lewat salah satu dari 3 cara:

- **Tambah Baris** — tambah baris kosong, isi manual.
- **Impor Excel** — upload file `.xlsx`. Kolom yang dikenali (Indonesia/Inggris): `Nama`/`Name`, `Upah Harian`/`Gaji Harian`/`Salary`, `Hari Kerja`/`Days`, `Kasbon`/`Potongan` (opsional). Unduh dulu template `.xlsx` bawaan kalau belum punya format. Baris tidak valid (nama kosong, upah/hari salah) akan ditandai dengan alasan spesifik dan tidak ikut diimpor. Kalau sudah ada karyawan sebelumnya, bisa pilih **Ganti** atau **Tambahkan ke daftar**.
- **Muat Template** — pakai ulang daftar pekerja yang sudah disimpan sebelumnya (lihat bagian 8).

## 5. Catatan per Karyawan

Klik ikon 🗒️ (StickyNote) di kolom Aksi untuk membuka catatan bebas per karyawan — cocok untuk mencatat detail kasbon/lembur per tanggal, misalnya:

```
kasbon tanggal 2
kasbon tanggal 15
```

Satu baris = satu poin. Catatan ini otomatis muncul juga di Slip Gaji karyawan tersebut.

## 6. Slip Gaji & Cetak Invoice

- **Slip Gaji per karyawan**: klik ikon dokumen di kolom Aksi. Menampilkan rincian: Upah per Hari → Jumlah Hari Kerja → **Total Sebelum Potongan** → **+ Lembur** → **Total Setelah Lembur** → **− Kasbon** → **Total Diterima**, plus catatan dan tanda tangan. Bisa langsung **Cetak** atau **Export PDF**.
- **Cetak Invoice keseluruhan**: tombol **Pratinjau & Cetak** di Editor Gaji. Menampilkan seluruh daftar karyawan dalam satu invoice A4, dengan ringkasan total (Total Sebelum Penyesuaian, Total Lembur, Total Kasbon, Total Keseluruhan) dan area tanda tangan.

## 7. Draft Proyek

Semua invoice **tersimpan otomatis tiap 30 detik** selama Anda di Editor Gaji (juga bisa simpan manual lewat **Simpan Draft**). Buka menu **Draft Proyek** untuk melihat semua draft (dengan judul, nomor invoice, tanggal, jumlah pekerja, total), cari lewat kotak pencarian, klik **Buka** untuk melanjutkan mengerjakan draft tersebut, atau ikon tempat sampah untuk menghapus.

## 8. Template Pekerja

Simpan daftar nama + upah harian pekerja yang sering dipakai berulang (misal tim tetap Anda), supaya tidak perlu input manual tiap kali buat invoice baru.

- **Simpan**: dari Editor Gaji, klik **Simpan Template**, beri nama.
- **Muat**: dari halaman **Template**, klik **Muat** pada template yang diinginkan — otomatis menambahkan semua pekerja di template itu ke invoice yang sedang dibuka (hari kerja default 1, sesuaikan lagi manual).
- **Ubah nama / Hapus**: ikon pensil untuk ganti nama, ikon tempat sampah untuk hapus (perlu konfirmasi).

## 9. Pengaturan Perusahaan

Menu **Pengaturan** untuk atur info yang tercetak di invoice/slip gaji:

- Nama perusahaan
- Alamat (opsional)
- No. Telepon/HP (opsional)
- Logo (PNG/JPG, maks. 500KB) — tampil menggantikan ikon dompet default di kop invoice dan slip gaji.

## 10. Backup & Pemulihan Data

**Penting**: aplikasi ini 100% offline — semua data (invoice, draft, template, pengaturan) tersimpan **lokal di perangkat ini saja**, tidak pernah dikirim ke server mana pun. Konsekuensinya: data bisa hilang kalau perangkat rusak, aplikasi di-uninstall total, atau cache/data browser dibersihkan.

**Cara backup:**
1. Di Editor Gaji, buka menu **···** → **Export `.payroll`**.
2. File `.payroll` akan terdownload — berisi invoice yang sedang dibuka + **seluruh draft, template, dan pengaturan perusahaan** dalam satu file.
3. Simpan file ini di tempat aman (Google Drive, flashdisk, dll).

**Cara memulihkan/pindah ke perangkat lain:**
1. Install aplikasi Gaji Harian di perangkat tujuan.
2. Di Editor Gaji, buka menu **···** → **Buka file `.payroll`**.
3. Pilih file backup `.payroll` Anda — seluruh data akan dimuat kembali (project aktif, draft, template, pengaturan perusahaan).

> Kalau file `.payroll` yang diimpor rusak atau tidak sesuai formatnya, aplikasi akan menampilkan pesan error yang jelas dan **tidak akan menimpa data yang sedang Anda kerjakan**.

**Rekomendasi**: lakukan export backup secara rutin (misal tiap minggu, atau setiap selesai satu periode gajian), jangan menunggu sampai butuh baru sadar belum pernah backup.

## 11. Tema Tampilan

Klik ikon matahari/bulan di pojok kanan atas untuk beralih tema, urutannya: **Terang → Gelap → Membaca (sepia) → Terang** (berulang). Pilihan tersimpan otomatis dan akan tetap dipakai saat aplikasi dibuka lagi.

## 12. Tips & FAQ

**Apakah data saya aman/privat?**
Ya. Aplikasi tidak terhubung ke server/internet untuk menyimpan data. Semua kalkulasi dan penyimpanan terjadi di perangkat Anda sendiri.

**Kenapa saya harus backup manual, tidak otomatis ke cloud?**
Karena aplikasi ini sengaja didesain offline-first untuk privasi dan supaya bisa dipakai tanpa internet sama sekali. Trade-off-nya, tanggung jawab backup ada di tangan Anda — lihat bagian 10.

**Bisa dipakai di banyak komputer sekaligus?**
Data tidak otomatis sinkron antar perangkat. Gunakan export/import `.payroll` untuk memindahkan data antar komputer.

**Ada masalah / bug?**
Email **partnercrows@gmail.com**, atau buka menu **Bantuan** di dalam aplikasi.
