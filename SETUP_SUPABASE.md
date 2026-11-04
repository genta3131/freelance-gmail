# Setup Supabase - Step by Step Guide

Panduan lengkap setup Supabase untuk aplikasi WorkFlow Hub.

## 📋 Overview

Setup ini akan membuat:
- ✅ 6 tabel (profiles, clients, freelancers, tasks, submissions, activity_logs)
- ✅ Row Level Security (RLS) policies
- ✅ Automatic triggers dan functions
- ✅ Indexes untuk performa
- ✅ Auto-create profile saat signup
- ✅ User pertama otomatis jadi admin

---

## 🚀 Step 1: Buat Project Supabase

1. **Buka** https://supabase.com
2. **Login** atau **Sign up** jika belum punya akun
3. **Klik** "New Project"
4. **Isi form:**
   - **Name**: `workflow-hub` (atau nama lain)
   - **Database Password**: Buat password kuat (simpan baik-baik!)
   - **Region**: Pilih terdekat (Singapore untuk Indonesia)
   - **Pricing Plan**: Free (sudah cukup untuk development)
5. **Klik** "Create new project"
6. **Tunggu** ±2 menit sampai project selesai dibuat

---

## 🗄️ Step 2: Jalankan Migration SQL

### 2.1 Buka SQL Editor

1. Di Supabase Dashboard, klik menu **"SQL Editor"** di sidebar kiri
2. Klik tombol **"New query"**

### 2.2 Copy & Paste Migration

1. **Buka file** `supabase/migrations/0001_init.sql` di project Anda
2. **Copy seluruh isi file** (semua 326 baris)
3. **Paste** ke SQL Editor di Supabase
4. **Klik** tombol **"Run"** (atau tekan Ctrl+Enter)

### 2.3 Verifikasi

Jika berhasil, Anda akan lihat pesan:
```
Success. No rows returned
```

⚠️ **Jika ada error**, jangan panik:
- Baca pesan error dengan teliti
- Biasanya karena typo atau copy tidak lengkap
- Hapus semua dan paste ulang dari awal

---

## 🔐 Step 3: Verifikasi Database Schema

### 3.1 Cek Tables

1. Klik menu **"Table Editor"** di sidebar
2. Pastikan ada 6 tabel:
   - ✅ `profiles`
   - ✅ `clients`
   - ✅ `freelancers`
   - ✅ `tasks`
   - ✅ `submissions`
   - ✅ `activity_logs`

### 3.2 Cek RLS Status

Untuk setiap tabel di Table Editor:
1. Klik nama tabel
2. Lihat di tab atas, pastikan ada badge **"RLS enabled"**
3. Jika belum, klik dan enable RLS

---

## 🔑 Step 4: Get API Keys

### 4.1 Copy API Credentials

1. Klik menu **"Settings"** di sidebar (icon gear)
2. Pilih **"API"**
3. **Copy** informasi berikut:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI...
```

### 4.2 Setup Environment Variables

1. **Buka terminal** di root project Anda
2. **Copy .env.example** ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. **Edit `.env.local`**:
   ```bash
   nano .env.local
   # atau buka dengan editor favorit Anda
   ```

4. **Isi dengan credentials** yang sudah dicopy:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **Save file**

---

## ✉️ Step 5: Configure Email Auth (Opsional)

### 5.1 Email Templates (Recommended)

1. Klik menu **"Authentication"** > **"Email Templates"**
2. Customize templates untuk:
   - Confirm signup
   - Reset password
   - Magic Link

### 5.2 SMTP Settings (Production)

Untuk production, setup SMTP sendiri:

1. **Authentication** > **"Settings"** 
2. Scroll ke **"SMTP Settings"**
3. Enable dan isi:
   - SMTP Host (misal: smtp.gmail.com)
   - Port (587)
   - Username & Password
   - Sender email & name

Untuk development, bisa pakai Supabase SMTP default.

---

## 🧪 Step 6: Test Connection

### 6.1 Start Development Server

```bash
npm run dev
```

### 6.2 Test di Browser

1. Buka http://localhost:3000
2. Klik **"Register"** atau buka `/register`
3. **Isi form:**
   - Full Name: Test Admin
   - Email: admin@test.com
   - Password: password123
4. **Klik** "Register"

### 6.3 Cek di Supabase

1. Buka **"Authentication"** > **"Users"**
2. Pastikan user baru muncul
3. Buka **"Table Editor"** > **"profiles"**
4. Pastikan ada row baru dengan:
   - `id` sama dengan user ID
   - `role` = `'admin'` (user pertama otomatis admin!)
   - `full_name` = "Test Admin"

✅ **Jika semua muncul, setup berhasil!**

---

## 👤 Step 7: Login sebagai Admin

### 7.1 Konfirmasi Email (Jika Required)

Jika email confirmation enabled:
1. Cek email Anda (atau inbox Supabase jika development)
2. Klik link konfirmasi
3. Atau disable email confirmation di **Authentication** > **Settings** untuk testing

### 7.2 Login

1. Buka http://localhost:3000/login
2. Login dengan:
   - Email: admin@test.com
   - Password: password123
3. **Redirect** ke `/dashboard`

### 7.3 Verifikasi Role

Dashboard admin harus menampilkan:
- ✅ Sidebar lengkap dengan semua menu
- ✅ Menu "Freelancer" (hanya admin)
- ✅ Menu "Client" (hanya admin)
- ✅ Stats cards di dashboard

---

## 🎯 Step 8: Test Basic Features

### 8.1 Tambah Client

1. Klik menu **"Client"**
2. Klik **"Tambah Client"**
3. Isi form dan save
4. Verifikasi muncul di list

### 8.2 Tambah Freelancer

1. Klik menu **"Freelancer"**
2. Klik **"Tambah Freelancer"**
3. Isi form:
   - Name: John Doe
   - Email: john@example.com
   - Skills: React, Node.js, TypeScript
   - Status: Aktif
4. Save dan verifikasi

### 8.3 Buat Task

1. Klik menu **"Task"**
2. Klik **"Buat Task"**
3. Isi form:
   - Title: Test Task
   - Description: Testing task creation
   - Client: Pilih client yang sudah dibuat
   - Freelancer: Pilih freelancer yang sudah dibuat
   - Status: Pending
   - Priority: Medium
4. Save dan verifikasi muncul di list

---

## 📊 Step 9: Verifikasi Database

### 9.1 Cek di Table Editor

1. Buka **"Table Editor"**
2. Cek tabel satu per satu:
   - **clients**: Ada 1 row
   - **freelancers**: Ada 1 row
   - **tasks**: Ada 1 row
   - **activity_logs**: Ada beberapa row (otomatis tercatat)

### 9.2 Test Query

Di **SQL Editor**, test query:

```sql
-- Cek total data
SELECT 'profiles' as table_name, count(*) as total FROM profiles
UNION ALL
SELECT 'clients', count(*) FROM clients
UNION ALL
SELECT 'freelancers', count(*) FROM freelancers
UNION ALL
SELECT 'tasks', count(*) FROM tasks
UNION ALL
SELECT 'submissions', count(*) FROM submissions
UNION ALL
SELECT 'activity_logs', count(*) FROM activity_logs;
```

---

## 🎓 Step 10: Buat User Freelancer (Opsional)

### 10.1 Register Freelancer Baru

1. **Logout** dari admin
2. Buka `/register`
3. Register user baru:
   - Full Name: Jane Freelancer
   - Email: jane@test.com
   - Password: password123

### 10.2 Link ke Freelancer

Di Supabase SQL Editor:

```sql
-- Cari user_id Jane
SELECT id, email FROM auth.users WHERE email = 'jane@test.com';

-- Update freelancer dengan user_id Jane
UPDATE freelancers 
SET user_id = 'user_id_jane_dari_query_atas'
WHERE email = 'john@example.com';
-- Ganti dengan freelancer_id yang sesuai
```

### 10.3 Test Login sebagai Freelancer

1. Login sebagai jane@test.com
2. Dashboard harus menampilkan:
   - ✅ Hanya task yang assigned ke dia
   - ❌ Tidak ada menu Freelancer/Client (admin only)
   - ✅ Bisa submit submission

---

## ✅ Checklist Setup Complete

Pastikan semua ini sudah berhasil:

- [ ] Project Supabase dibuat
- [ ] Migration SQL berhasil dijalankan
- [ ] 6 tabel terbuat dengan RLS enabled
- [ ] API keys sudah dicopy ke `.env.local`
- [ ] Development server berjalan tanpa error
- [ ] User pertama berhasil register sebagai admin
- [ ] Login berhasil dan redirect ke dashboard
- [ ] Client, Freelancer, Task berhasil dibuat
- [ ] Activity logs tercatat otomatis
- [ ] (Opsional) User freelancer berhasil dibuat dan linked

---

## 🐛 Troubleshooting

### Problem: Migration SQL Error

**Error**: `relation "profiles" already exists`

**Solution**: Drop tables dulu jika ada:
```sql
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS freelancers CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS set_updated_at CASCADE;
DROP FUNCTION IF EXISTS is_admin CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
```
Lalu jalankan migration lagi.

---

### Problem: User tidak bisa register

**Error**: `Failed to fetch` atau network error

**Solution**: 
1. Cek `.env.local` sudah benar
2. Restart development server
3. Clear browser cache
4. Cek Supabase project masih aktif

---

### Problem: User role bukan admin

**Solution**: Update manual via SQL:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

---

### Problem: RLS Policy Error saat insert

**Error**: `new row violates row-level security policy`

**Solution**:
1. Pastikan RLS policies sudah dibuat (cek di migration)
2. Test dengan disable RLS sementara untuk debug
3. Login ulang untuk refresh token

---

## 🎉 Setup Selesai!

Aplikasi WorkFlow Hub Anda sudah siap digunakan!

**Next Steps:**
- Explore semua fitur
- Customize sesuai kebutuhan
- Deploy ke production (lihat `DEPLOYMENT.md`)

Need help? Check `README.md` dan `SUMMARY.md` untuk dokumentasi lengkap.
