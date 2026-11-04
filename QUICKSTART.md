# Quick Start Guide - WorkFlow Hub

Panduan cepat untuk menjalankan aplikasi dalam 5 menit.

## ⚡ Quick Setup (5 menit)

### 1. Setup Supabase (2 menit)

```bash
# 1. Buka https://supabase.com
# 2. Buat project baru
# 3. Di SQL Editor, paste & run isi file: supabase/migrations/0001_init.sql
# 4. Copy API keys dari Settings > API
```

### 2. Setup Environment (30 detik)

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dengan API keys Anda
nano .env.local
```

Isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
```

### 3. Install & Run (1 menit)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Register Admin (1 menit)

```bash
# 1. Buka http://localhost:3000
# 2. Klik "Register"
# 3. Isi form dan register
# 4. User pertama otomatis jadi admin!
# 5. Login dan mulai gunakan
```

---

## 🎯 Test Fitur (5 menit)

### Admin Dashboard

1. **Tambah Client**
   - Menu "Client" > "Tambah Client"
   - Nama: "PT ABC", Email: abc@company.com
   
2. **Tambah Freelancer**
   - Menu "Freelancer" > "Tambah Freelancer"  
   - Nama: "John Doe", Skills: "React, Node.js"
   
3. **Buat Task**
   - Menu "Task" > "Buat Task"
   - Title: "Build Landing Page"
   - Assign ke freelancer yang dibuat
   
4. **Test Submission** (dari freelancer)
   - Buat user freelancer baru (logout & register)
   - Link user ke freelancer (via SQL atau manual)
   - Login sebagai freelancer
   - Klik task > "Kirim Submission"

---

## 📁 Struktur Project

```
workflow-hub/
├── src/
│   ├── app/                 # Next.js pages (24 pages)
│   │   ├── (auth)/         # Auth pages
│   │   └── (dashboard)/    # Dashboard pages
│   ├── components/         # React components (33 files)
│   ├── lib/               # Utils & helpers
│   └── types/             # TypeScript types
├── supabase/
│   └── migrations/        # Database schema
├── .env.local            # Environment variables (create this)
└── package.json
```

---

## 🔑 Default Users

### Admin (User Pertama)
- **Role**: Admin
- **Access**: Full access semua fitur
- **Can**: CRUD tasks, freelancers, clients, review submissions

### Freelancer (User Kedua+)
- **Role**: Freelancer  
- **Access**: Hanya task & submission mereka
- **Can**: View tasks, submit work

---

## 📚 Documentation

- **Setup Lengkap**: `SETUP_SUPABASE.md` (step-by-step dengan troubleshooting)
- **Deployment**: `DEPLOYMENT.md` (production deployment guide)
- **Summary**: `SUMMARY.md` (detail lengkap aplikasi)
- **README**: `README.md` (overview & features)

---

## 🐛 Common Issues

### Database Error
```bash
# Restart dev server
npm run dev
```

### User bukan admin
```sql
-- Di Supabase SQL Editor
UPDATE profiles SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
PORT=3001 npm run dev
```

---

## 🎉 Done!

Aplikasi siap digunakan di http://localhost:3000

**Happy coding!** 🚀
