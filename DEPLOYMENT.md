# Deployment Guide - WorkFlow Hub

Panduan deploy aplikasi WorkFlow Hub ke production.

## 📋 Prerequisites

- Akun Supabase (https://supabase.com)
- Akun Vercel atau hosting Node.js lainnya
- Git repository

## 🗄️ Setup Database (Supabase)

### 1. Buat Project Baru

1. Login ke Supabase Dashboard
2. Klik "New Project"
3. Isi nama project, database password, dan region
4. Tunggu hingga project selesai dibuat

### 2. Setup Database Schema

1. Buka **SQL Editor** di Supabase Dashboard
2. Jalankan migrations dari folder `supabase/migrations` satu per satu:
   - `20240101000000_initial_schema.sql` (atau file migration yang ada)
3. Verifikasi tabel sudah terbuat di **Table Editor**

### 3. Setup Auth

1. Buka **Authentication** > **Providers**
2. Enable **Email** provider
3. (Opsional) Konfigurasi email templates di **Email Templates**

### 4. Get API Keys

1. Buka **Settings** > **API**
2. Copy:
   - Project URL
   - `anon` public key
3. Simpan untuk digunakan di environment variables

### 5. Setup Row Level Security (RLS)

Pastikan RLS sudah enabled untuk semua tabel. Policies akan otomatis dibuat melalui migrations.

## 🚀 Deploy ke Vercel

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/workflow-hub.git
git push -u origin main
```

### 2. Deploy di Vercel

1. Login ke https://vercel.com
2. Klik **"Add New Project"**
3. Import repository dari GitHub
4. Configure Project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Set Environment Variables

Di Vercel Dashboard > Settings > Environment Variables, tambahkan:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Deploy

1. Klik **"Deploy"**
2. Tunggu build selesai (±2-3 menit)
3. Akses aplikasi di URL yang diberikan

## 🔧 Deploy Manual (VPS/Server)

### 1. Setup Server

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2
```

### 2. Clone & Install

```bash
git clone https://github.com/username/workflow-hub.git
cd workflow-hub
npm install
```

### 3. Configure Environment

```bash
# Buat .env.local
nano .env.local

# Isi dengan:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Build & Start

```bash
# Build aplikasi
npm run build

# Start dengan PM2
pm2 start npm --name "workflow-hub" -- start

# Save PM2 config
pm2 save
pm2 startup
```

### 5. Setup Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Setup SSL dengan Certbot

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 👤 Setup Admin User

Setelah deploy, buat admin pertama:

### 1. Register User

1. Buka aplikasi
2. Register akun baru di `/register`
3. Verifikasi email (jika enabled)

### 2. Set Role ke Admin

Di Supabase Dashboard > SQL Editor, jalankan:

```sql
-- Ganti 'user_email@example.com' dengan email admin
UPDATE profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'user_email@example.com'
);
```

### 3. Login sebagai Admin

Logout dan login kembali untuk apply role baru.

## 🔍 Verifikasi Deployment

Checklist untuk memastikan deployment sukses:

- [ ] Aplikasi dapat diakses di browser
- [ ] Halaman login berfungsi
- [ ] Register user baru berfungsi
- [ ] Dashboard muncul setelah login
- [ ] Admin dapat membuat task
- [ ] Admin dapat menambah freelancer/client
- [ ] Freelancer dapat submit submission
- [ ] Activity logs tercatat

## 🐛 Troubleshooting

### Build Error di Vercel

**Problem**: Build gagal dengan error TypeScript

**Solution**:
```bash
# Hapus cache dan rebuild
npm run build

# Jika masih error, cek tsconfig.json dan fix type errors
```

### Database Connection Error

**Problem**: `Failed to fetch` atau connection error

**Solution**:
1. Pastikan environment variables benar
2. Cek Supabase project masih aktif
3. Verifikasi API keys belum expired

### RLS Policy Error

**Problem**: `new row violates row-level security policy`

**Solution**:
1. Cek RLS policies di Supabase
2. Pastikan migrations sudah dijalankan semua
3. Verifikasi user role di profiles table

### CORS Error

**Problem**: CORS error saat fetch ke Supabase

**Solution**:
1. Tambahkan domain di Supabase > Settings > API > URL Configuration
2. Pastikan menggunakan `createClient` yang benar (server/client)

## 📊 Monitoring

### Vercel Analytics

Enable Vercel Analytics untuk monitoring:
1. Buka project di Vercel
2. Settings > Analytics
3. Enable Analytics

### Supabase Logs

Monitor database di Supabase Dashboard:
1. Reports > Database
2. Logs > Postgres Logs
3. Auth > Users untuk user activity

## 🔄 Update Aplikasi

### Vercel (Auto Deploy)

Setiap push ke `main` branch akan otomatis deploy.

### Manual Server

```bash
cd workflow-hub
git pull origin main
npm install
npm run build
pm2 restart workflow-hub
```

## 🔐 Security Checklist

- [ ] Environment variables tidak di-commit ke Git
- [ ] RLS policies enabled di semua tabel
- [ ] SSL/HTTPS enabled
- [ ] Strong database password
- [ ] Regular backup database
- [ ] Rate limiting enabled (jika perlu)

## 💾 Backup Strategy

### Database Backup (Supabase)

1. Database Settings > Backups
2. Enable automatic daily backups (Pro plan)
3. Manual backup via pg_dump:

```bash
pg_dump -h db.xxxxx.supabase.co -U postgres dbname > backup.sql
```

### Code Backup

- Push ke GitHub/GitLab secara regular
- Tag releases penting: `git tag v1.0.0`

---

Selamat! Aplikasi WorkFlow Hub Anda sudah production-ready! 🎉
