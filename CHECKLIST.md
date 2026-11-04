# Setup Checklist - WorkFlow Hub

Checklist untuk memastikan setup Supabase berhasil.

## 📋 Pre-Setup

- [ ] Punya akun Supabase (https://supabase.com)
- [ ] Node.js 18+ terinstall
- [ ] Git terinstall (opsional)
- [ ] Text editor (VS Code recommended)

---

## 🗄️ Database Setup

### Buat Project
- [ ] Login ke Supabase Dashboard
- [ ] Klik "New Project"
- [ ] Isi nama project: `workflow-hub`
- [ ] Set database password (simpan baik-baik!)
- [ ] Pilih region terdekat (Singapore untuk ID)
- [ ] Tunggu hingga project ready (~2 menit)

### Run Migration
- [ ] Buka menu "SQL Editor"
- [ ] Klik "New query"
- [ ] Copy isi file `supabase/migrations/0001_init.sql`
- [ ] Paste ke SQL Editor
- [ ] Klik "Run" atau Ctrl+Enter
- [ ] Verifikasi muncul "Success. No rows returned"

### Verifikasi Tables
- [ ] Buka menu "Table Editor"
- [ ] Pastikan ada 6 tabel:
  - [ ] `profiles` (RLS enabled)
  - [ ] `clients` (RLS enabled)
  - [ ] `freelancers` (RLS enabled)
  - [ ] `tasks` (RLS enabled)
  - [ ] `submissions` (RLS enabled)
  - [ ] `activity_logs` (RLS enabled)

### Get API Keys
- [ ] Buka "Settings" > "API"
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key
- [ ] Simpan untuk step selanjutnya

---

## ⚙️ Local Setup

### Environment Variables
- [ ] Copy `.env.example` ke `.env.local`
- [ ] Edit `.env.local`
- [ ] Paste Supabase URL
- [ ] Paste Supabase anon key
- [ ] Save file

### Install Dependencies
- [ ] Buka terminal di folder project
- [ ] Run `npm install`
- [ ] Tunggu hingga selesai (~1-2 menit)
- [ ] Verifikasi tidak ada error

### Start Development Server
- [ ] Run `npm run dev`
- [ ] Tunggu hingga "Ready" muncul
- [ ] Verifikasi berjalan di http://localhost:3000
- [ ] Tidak ada error di terminal

---

## 👤 User Setup

### Register Admin (User Pertama)
- [ ] Buka http://localhost:3000
- [ ] Klik "Register" atau buka `/register`
- [ ] Isi form:
  - [ ] Full Name: Nama Anda
  - [ ] Email: email@anda.com
  - [ ] Password: minimal 6 karakter
- [ ] Klik "Register"
- [ ] Verifikasi tidak ada error

### Verifikasi di Supabase
- [ ] Buka Supabase Dashboard
- [ ] Menu "Authentication" > "Users"
- [ ] User baru muncul dengan email yang didaftarkan
- [ ] Buka menu "Table Editor" > "profiles"
- [ ] Ada row dengan `role = 'admin'` (user pertama otomatis admin!)

### Login
- [ ] Buka http://localhost:3000/login
- [ ] Login dengan email & password yang didaftarkan
- [ ] Redirect ke `/dashboard`
- [ ] Dashboard muncul dengan lengkap

---

## 🎯 Feature Testing

### Dashboard
- [ ] Dashboard menampilkan stats cards
- [ ] Sidebar lengkap (8 menu items)
- [ ] Theme toggle berfungsi (dark/light)
- [ ] User menu berfungsi

### Client Management
- [ ] Buka menu "Client"
- [ ] Klik "Tambah Client"
- [ ] Isi form dan simpan
- [ ] Client muncul di list
- [ ] Klik client untuk lihat detail
- [ ] Edit client berfungsi
- [ ] Search & filter berfungsi

### Freelancer Management
- [ ] Buka menu "Freelancer"
- [ ] Klik "Tambah Freelancer"
- [ ] Isi form (termasuk skills dengan koma)
- [ ] Simpan
- [ ] Freelancer muncul di list dengan badge status
- [ ] Skills muncul sebagai chips/badges
- [ ] Detail & edit berfungsi

### Task Management
- [ ] Buka menu "Task"
- [ ] Klik "Buat Task"
- [ ] Isi form:
  - [ ] Title task
  - [ ] Pilih client
  - [ ] Pilih freelancer
  - [ ] Set status & priority
  - [ ] Set deadline (opsional)
- [ ] Simpan
- [ ] Task muncul di list dengan badge status
- [ ] Filter & search berfungsi
- [ ] Klik task untuk detail
- [ ] Edit & delete berfungsi

### Activity Logs
- [ ] Buka menu "Aktivitas"
- [ ] Activity logs muncul dengan:
  - [ ] User yang melakukan action
  - [ ] Action yang dilakukan
  - [ ] Timestamp

### Settings
- [ ] Buka menu "Pengaturan"
- [ ] Tab Profile: update nama berfungsi
- [ ] Tab Security: ubah password (test dengan password dummy)
- [ ] Tab Account: menampilkan email & role

### Submission Flow (Butuh 2 User)
- [ ] **Sebagai Admin**: Assign task ke freelancer
- [ ] **Logout** dan **Register user baru**
- [ ] **Link user ke freelancer** (via SQL jika perlu)
- [ ] **Login sebagai freelancer**
- [ ] Dashboard hanya menampilkan task yang assigned
- [ ] Klik task > "Kirim Submission"
- [ ] Isi notes dan file URL
- [ ] Submit
- [ ] **Logout dan login sebagai admin**
- [ ] Menu "Submission" > klik submission
- [ ] Review dengan approve/reject
- [ ] Verifikasi status berubah

---

## ✅ Final Verification

### Database
- [ ] Semua tabel terisi dengan data test
- [ ] Activity logs tercatat otomatis
- [ ] RLS policies berfungsi (non-admin tidak bisa akses data admin)

### Application
- [ ] Tidak ada error di browser console
- [ ] Tidak ada error di terminal
- [ ] Semua halaman bisa diakses
- [ ] Responsive di mobile (test dengan resize browser)
- [ ] Dark mode berfungsi sempurna

### Performance
- [ ] Halaman load cepat (<2 detik)
- [ ] Tidak ada console warnings
- [ ] Form validation berfungsi
- [ ] Toast notifications muncul dengan benar

---

## 🎉 Setup Complete!

Jika semua checklist di atas ✅, maka:

**🚀 Aplikasi WorkFlow Hub Anda sudah siap digunakan!**

### Next Steps:
1. Explore semua fitur lebih dalam
2. Customize sesuai kebutuhan (warna, logo, dll)
3. Tambah data real untuk production
4. Deploy ke production (lihat `DEPLOYMENT.md`)

### Need Help?
- Check `QUICKSTART.md` untuk panduan cepat
- Check `SETUP_SUPABASE.md` untuk troubleshooting
- Check `README.md` untuk dokumentasi lengkap

---

## 📞 Support

Jika ada masalah:
1. Check troubleshooting di `SETUP_SUPABASE.md`
2. Verifikasi environment variables benar
3. Restart development server
4. Clear browser cache
5. Check Supabase logs

**Happy coding!** 🎊
