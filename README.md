# Gaji Harian

Aplikasi payroll harian (invoice gaji pekerja harian) yang berjalan sepenuhnya offline — tanpa server, tanpa database, tanpa signup. Data tersimpan lokal di perangkat, dengan fitur ekspor/impor file untuk backup dan pemindahan data.

Tersedia sebagai aplikasi web (dijalankan di browser) maupun aplikasi desktop (Windows/Linux/macOS) lewat [Tauri](https://tauri.app/).

## Fitur

- Input data karyawan: upah harian, jumlah hari kerja, lembur, kasbon, status pembayaran, catatan.
- Kalkulasi otomatis total gaji per karyawan dan keseluruhan.
- Impor data karyawan dari Excel/CSV.
- Slip gaji per karyawan dan invoice keseluruhan, siap cetak/export PDF.
- Ekspor/impor project (`.payroll`) untuk backup dan pemindahan data antar perangkat.

## Stack

React 19 + TypeScript, TanStack Start/Router, Vite 8, Zustand (persist ke IndexedDB), Tailwind CSS v4 + shadcn/ui, Tauri 2.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build              # build frontend saja
npm run tauri:build:windows-x64   # build installer Windows (x64)
```

Lihat `build-*.bat` / `build-*.sh` untuk build per-platform lainnya.

## Lisensi

[MIT](LICENSE)
