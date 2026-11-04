# ⚠️ PENTING: Setup Environment Variables

## Error yang Anda Lihat

```
Uncaught Error: Your project's URL and Key are required to create a Supabase client!
```

Ini **NORMAL** dan **EXPECTED** karena Anda belum setup environment variables.

---

## ✅ Cara Fix (2 Menit)

### Step 1: Buat File .env.local

```bash
# Di terminal, run:
cp .env.example .env.local
```

### Step 2: Isi dengan Credentials Dummy (Untuk Test)

Buka `.env.local` dan isi dengan dummy values dulu:

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C di terminal)
# Start lagi:
npm run dev
```

Server akan jalan tanpa error, tapi fitur auth belum bisa digunakan.

---

## 🚀 Setup Supabase yang Benar

Untuk fitur auth bekerja, ikuti langkah berikut:

### 1. Buat Project Supabase (5 menit)

1. Buka https://supabase.com
2. Login/Register
3. Klik "New Project"
4. Isi:
   - Name: `workflow-hub`
   - Database Password: (buat password kuat)
   - Region: Singapore (untuk Indonesia)
5. Tunggu ~2 menit sampai ready

### 2. Jalankan Migration SQL (2 menit)

1. Di Supabase Dashboard, klik **"SQL Editor"**
2. Klik **"New query"**
3. **Copy seluruh isi** file `supabase/migrations/0001_init.sql`
4. **Paste** ke SQL Editor
5. Klik **"Run"**
6. Verifikasi muncul "Success"

### 3. Get API Keys (1 menit)

1. Di Supabase, klik **"Settings"** (icon gear)
2. Klik **"API"**
3. **Copy**:
   - Project URL: `https://xxxxxxxxxxxxx.supabase.co`
   - anon public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Update .env.local (30 detik)

Edit `.env.local` dengan credentials asli:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...
```

### 5. Restart Server (10 detik)

```bash
# Stop (Ctrl+C)
npm run dev
```

### 6. Test! (1 menit)

1. Buka http://localhost:3000
2. Klik "Register"
3. Daftar dengan:
   - Name: Admin Test
   - Email: admin@test.com
   - Password: password123
4. Login dan explore!

---

## 📚 Dokumentasi Lengkap

Untuk panduan detail step-by-step:

👉 **[QUICKSTART.md](QUICKSTART.md)** - Setup cepat (5 menit)

👉 **[SETUP_SUPABASE.md](SETUP_SUPABASE.md)** - Step-by-step lengkap

👉 **[CHECKLIST.md](CHECKLIST.md)** - Checklist setup

---

## 🎯 TL;DR

**Aplikasi sudah selesai 100%, tinggal setup Supabase:**

1. ✅ Buat project Supabase
2. ✅ Run migration SQL
3. ✅ Copy API keys ke `.env.local`
4. ✅ Restart server
5. ✅ Register & login

**Total waktu: ~10 menit**

---

## 🆘 Need Help?

Error lain? Lihat troubleshooting di:
- `SETUP_SUPABASE.md` - Troubleshooting section
- `DOCS.md` - Index dokumentasi
- `QUICKSTART.md` - Quick start guide

---

**Good luck!** 🚀
