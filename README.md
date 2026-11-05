# BookSpace
### Aplikasi Pemesanan dan Manajemen Buku

## Deskripsi Proyek

BookSpace merupakan aplikasi web sederhana untuk pemesanan dan pengelolaan buku pada toko online. Proyek ini dibuat untuk memenuhi tugas Ujian Tengah Semester mata kuliah Pemrograman Web 1.

Aplikasi berfokus pada implementasi HTML, CSS, dan JavaScript untuk membangun antarmuka interaktif tanpa menggunakan database atau backend.

## Fitur Aplikasi

1. Login pengguna menggunakan email dan password.
2. Dashboard dengan sapaan berdasarkan waktu lokal.
3. Katalog buku dan informasi stok.
4. Penambahan data buku menggunakan JavaScript DOM.
5. Checkout dan perhitungan total pembayaran.
6. Penyimpanan riwayat transaksi.
7. Tracking pengiriman berdasarkan nomor Delivery Order (DO).

## Teknologi yang Digunakan

- HTML5 untuk struktur halaman.
- CSS3 untuk tampilan antarmuka.
- JavaScript untuk logika aplikasi.
- JavaScript DOM untuk manipulasi elemen halaman.
- LocalStorage untuk menyimpan data pada browser.

## Struktur Proyek

```text
BookSpace/
├── login.html
├── dashboard.html
├── stok.html
├── checkout.html
├── tracking.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   └── script.js
├── img/
│   ├── pengantar_komunikasi.jpg
│   ├── manajemen_keuangan.jpg
│   ├── kepemimpinan.jpg
│   ├── mikrobiologi.jpg
│   └── paud_perkembangan.jpg
└── README.md
```

## Cara Menjalankan Aplikasi

1. Clone atau download repository ini.
2. Ekstrak folder proyek jika mengunduh ZIP.
3. Buka folder BookSpace menggunakan Visual Studio Code.
4. Pastikan ekstensi Live Server sudah terpasang.
5. Buka file `login.html`.
6. Jalankan melalui Live Server.

## Akun Demo

Gunakan akun berikut untuk mencoba fitur login.

| Nama | Email | Password |
|---|---|---|
| Rina Wulandari | rina@gmail.com | rina123 |
| Agus Pranoto | agus@gmail.com | agus123 |
| Siti Marlina | siti@gmail.com | siti123 |

Akun tersebut merupakan akun demonstrasi yang tersimpan pada file JavaScript proyek.

## Alur Penggunaan

1. Pengguna masuk melalui halaman Login.
2. Pengguna diarahkan ke Dashboard.
3. Pengguna dapat melihat katalog dan informasi stok buku.
4. Pengguna membuat pesanan melalui halaman Checkout.
5. Sistem menghitung total pembayaran dan memperbarui stok.
6. Transaksi tersimpan pada History Transaksi.
7. Pengguna dapat mencari informasi pengiriman menggunakan nomor DO.

## Penyimpanan Data

Aplikasi menggunakan data awal dari file `data.js`. Perubahan stok dan transaksi disimpan menggunakan LocalStorage pada browser.

Data tidak tersimpan pada server atau database. Penyimpanan LocalStorage berlaku pada browser dan origin yang digunakan.

## Batasan Aplikasi

- Aplikasi merupakan simulasi front-end.
- Belum menggunakan database.
- Belum terhubung dengan layanan pembayaran sungguhan.
- Informasi pengiriman menggunakan data simulasi.

## Tujuan Pembelajaran

Proyek ini menerapkan struktur HTML semantik, pengaturan tampilan menggunakan CSS, manipulasi DOM, validasi formulir, interaksi pengguna, dan pengelolaan data menggunakan JavaScript.

## Pengumpulan Tugas

- Repository GitHub: [Masukkan URL repository]
- Video penjelasan YouTube: [Masukkan URL video](https://youtu.be/Gd9f-IjCwg4)
