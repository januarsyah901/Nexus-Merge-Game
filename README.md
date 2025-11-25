# Nexus Merge - Integration Simulation Game

**Nexus Merge** adalah game edukasi interaktif yang mensimulasikan proses **Nexus Integration** dalam framework Scrum berskala (Scaled Scrum). Anda berperan sebagai **Nexus Integration Team (NIT)** yang bertugas mengintegrasikan pekerjaan dari 3 Tim Scrum yang berbeda.

## Deskripsi Game

Dalam game ini, Anda harus:
- Menggabungkan modul-modul dari 3 tim yang berbeda (Team Alpha, Team Beta, Team Gamma)
- Memastikan interface/connector antar modul cocok (matching shapes)
- Menyelesaikan konflik integrasi menggunakan Action Points (AP)
- Menyelesaikan semua integrasi dalam waktu yang ditentukan
- Mendapatkan skor setinggi-tingginya

## Instalasi & Setup

### Prasyarat

Pastikan Anda sudah menginstall:
- **Node.js** (versi 14.0 atau lebih baru) - [Download Node.js](https://nodejs.org/)
- **npm** (biasanya sudah terinstall bersama Node.js)
- **Git** - [Download Git](https://git-scm.com/)

### Langkah-Langkah Instalasi

#### 1. Clone Repository

Buka terminal/command prompt, lalu jalankan:

```bash
git clone https://github.com/januarsyah901/Nexus-Merge-Game.git
```

Atau jika menggunakan SSH:

```bash
git clone git@github.com:januarsyah901/Nexus-Merge-Game.git
```

#### 2. Masuk ke Direktori Project

```bash
cd nexusmerge-app
```

#### 3. Install Dependencies

Install semua package yang diperlukan:

```bash
npm install
```

Proses ini akan menginstall:
- React
- Tailwind CSS
- Lucide React (untuk icons)
- Dan dependencies lainnya

#### 4. Jalankan Aplikasi

```bash
npm start
```

Aplikasi akan terbuka secara otomatis di browser Anda pada alamat:
```
http://localhost:3000
```

Jika tidak terbuka otomatis, buka browser dan masukkan URL di atas.

## Cara Bermain

### 1. **Mulai Game**
- Klik tombol **"Mulai Sprint"** di header
- Timer akan mulai berjalan (default: 120 detik)
- Anda akan mendapatkan 3 Action Points (AP) untuk digunakan

### 2. **Interface Game**

#### A. Header (Bagian Atas)
- **Waktu**: Menunjukkan sisa waktu (berubah merah dan berkedip jika < 10 detik)
- **Score**: Skor Anda saat ini
- **Action Cards**: Jumlah AP yang tersisa

#### B. Zona Integrasi (Area Drop)
- Area besar dengan border putus-putus
- **Drop modul di sini** untuk mengintegrasikan
- Modul akan tersusun berurutan dari kiri ke kanan
- Connector otomatis akan terbentuk antar modul

#### C. Team Backlogs (3 Area Bawah)
- **Team Alpha** (Hijau): Fokus pada Backend
- **Team Beta** (Biru): Fokus pada API
- **Team Gamma** (Ungu): Fokus pada Frontend
- Setiap tim memiliki modul dengan connector di kiri dan kanan

#### D. Sidebar (Kanan)
- Informasi tentang game
- Panduan connector shapes
- Penjelasan Action Cards

### 3. **Gameplay**

#### Drag & Drop Modul
1. **Klik dan tahan** modul dari salah satu tim
2. **Drag** modul ke Zona Integrasi
3. **Drop** untuk menempatkan modul

#### Matching Connectors
- Setiap modul memiliki 2 connector: **Kiri** dan **Kanan**
- Ada 3 jenis connector:
  - **Lingkaran** = API Interface
  - **Kotak** = Database Schema
  - **Segitiga** = UI Component

- **MATCH**: Jika connector kanan modul sebelumnya sama dengan connector kiri modul baru
  - Modul akan berwarna **HIJAU**
  - Anda mendapat **+10 poin**

- **CONFLICT**: Jika connector tidak cocok
  - Modul akan berwarna **MERAH** dengan icon peringatan
  - Anda kehilangan **-5 poin**
  - Muncul tombol **"Fix (1 AP)"**

#### Menyelesaikan Konflik
Jika ada konflik:
1. Klik tombol **"Fix (1 AP)"** pada modul yang konflik
2. Menggunakan 1 Action Point
3. Connector akan berubah menjadi cocok
4. Warna modul berubah jadi **HIJAU**

#### Action: Reshuffle
- Jika modul di backlog tidak cocok, klik **"Reshuffle (1 AP)"**
- Menggunakan 1 AP
- Modul di backlog tim tersebut akan diacak ulang

### 4. **Scoring System**

| Aksi | Poin |
|------|------|
| Modul terintegrasi dengan benar | +10 |
| Modul dengan konflik | -5 |
| Menyelesaikan semua modul tanpa konflik | +50 (Bonus) |

### 5. **Kondisi Menang/Kalah**

#### **Menang**
- Semua modul dari ketiga tim berhasil diintegrasikan
- Tidak ada konflik yang tersisa (atau semua sudah di-fix)
- Bonus +50 poin!

#### **Waktu Habis**
- Timer mencapai 0
- Game over dengan skor akhir Anda
- Klik **"Main Lagi"** untuk mencoba lagi

## Responsive Design

Game ini **fully responsive** dan dapat dimainkan di:
- **Desktop/Laptop** (1024px+)
- **Tablet** (640px - 1023px)
- **Mobile** (< 640px)

### Tips untuk Mobile:
- Interface otomatis menyesuaikan ukuran layar
- Drag & drop tetap berfungsi dengan touch gestures
- Zona integrasi dapat di-scroll horizontal jika modul terlalu panjang

## Development Commands

### `npm start`
Menjalankan aplikasi dalam mode development.
- Buka [http://localhost:3000](http://localhost:3000) di browser
- Auto-reload saat ada perubahan code

### `npm test`
Menjalankan test runner dalam mode interaktif.

### `npm run build`
Build aplikasi untuk production ke folder `build/`.
- Optimasi untuk performa terbaik
- File di-minify dan hash untuk caching
- Siap untuk deployment

### `npm run eject`
**One-way operation!** Mengeluarkan konfigurasi build untuk customisasi penuh.

## Teknologi yang Digunakan

- **React** - UI Library
- **Tailwind CSS** - Styling & Responsive Design
- **Lucide React** - Icon Library
- **Create React App** - Build Tools

## Konsep Scrum yang Disimulasikan

Game ini mengajarkan konsep:
- **Nexus Integration Team (NIT)**: Tim khusus yang menangani integrasi antar Tim Scrum
- **Integration Conflicts**: Masalah yang muncul saat menggabungkan pekerjaan dari tim berbeda
- **Refactoring**: Memperbaiki interface untuk menyelesaikan konflik
- **Sprint Goal**: Menyelesaikan semua integrasi dalam waktu terbatas
- **Collaboration**: Koordinasi antar tim untuk kesuksesan project

## Troubleshooting

### Port 3000 sudah digunakan?
```bash
# Ubah port dengan environment variable
PORT=3001 npm start
```

### Dependencies error?
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Browser tidak auto-open?
Buka manual: http://localhost:3000

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Kontribusi

Project ini dibuat untuk keperluan edukasi. Silakan fork dan modifikasi sesuai kebutuhan!

---

**Selamat Bermain!**  
Semoga game ini membantu memahami konsep Nexus Integration dalam Scaled Scrum!
