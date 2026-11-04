# ⚡ DEPLOY WORKFLOW HUB KE VERCEL

## ⚠️ PENTING: Setup Supabase Dulu!

Sebelum deploy ke Vercel, Anda **HARUS setup Supabase** terlebih dahulu karena aplikasi membutuhkan environment variables untuk berjalan.

---

## 🎯 Langkah Deploy yang Benar

### Step 1: Setup Supabase (5 menit)

```bash
# Login ke Supabase
supabase login

# Link atau create project
supabase link
# atau: supabase projects create workflow-hub

# Push database schema
supabase db push

# Get credentials
supabase status
```

**Simpan output dari `supabase status`:**
- API URL: `https://xxxxx.supabase.co`
- anon key: `eyJhbG...`

---

### Step 2: Push ke GitHub (sudah ✅)

Repository sudah terhubung ke GitHub:
```
https://github.com/genta3131/freelance-gmail.git
```

Commit dan push:
```bash
git add .
git commit -m "Ready to deploy"
git push origin main
```

---

### Step 3: Deploy ke Vercel

#### Option A: Via Vercel Dashboard (Termudah)

1. **Buka** https://vercel.com
2. **Login** dengan GitHub
3. **Click** "Import Project"
4. **Pilih** repository: `genta3131/freelance-gmail`
5. **Configure**:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Environment Variables** (PENTING!):
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbG...
   ```
7. **Click** "Deploy"

**Deployment URL akan muncul dalam 2-3 menit!**

---

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Saat prompt, jawab:
# - Link to existing project? No
# - Project name: workflow-hub
# - Directory: ./
# - Override settings? No

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://xxxxx.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbG...

# Deploy to production
vercel --prod
```

---

### Step 4: Setup Admin User

Setelah deploy berhasil:

1. **Buka** deployment URL
2. **Register** user pertama
3. User pertama otomatis jadi **admin**
4. **Login** dan explore!

---

## 🎯 Quick Deploy (Automated)

Jika Supabase sudah setup:

```bash
# 1. Commit changes
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Deploy via CLI
vercel --prod

# 3. Set environment variables (one time)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Done! URL akan muncul
```

---

## ✅ Post-Deploy Checklist

- [ ] Deployment successful (URL muncul)
- [ ] Environment variables set
- [ ] Can access deployment URL
- [ ] Can register new user
- [ ] User becomes admin
- [ ] Can login
- [ ] Dashboard loads correctly
- [ ] Can create clients/freelancers/tasks

---

## 🔄 Auto-Deploy

Setelah setup awal, setiap `git push` akan otomatis trigger deployment baru di Vercel!

```bash
# Make changes
git add .
git commit -m "Add feature X"
git push

# Vercel auto-deploys! 🚀
# Check deployment di Vercel dashboard
```

---

## 🐛 Troubleshooting

### Build fails on Vercel

**Error**: "Supabase URL required"

**Fix**: Set environment variables di Vercel dashboard
```
Settings > Environment Variables > Add
```

---

### Database connection fails

**Fix**: 
1. Check environment variables benar
2. Verify Supabase project masih aktif
3. Re-deploy dengan `vercel --prod`

---

### 404 Not Found

**Fix**: Pastikan framework preset = Next.js di Vercel settings

---

## 📊 Expected Results

**After successful deploy:**

```
✅ Build completed
✅ Deployment ready
🌐 https://workflow-hub-xxx.vercel.app

Preview: https://workflow-hub-git-main-xxx.vercel.app
Production: https://workflow-hub.vercel.app
```

---

## 💡 Tips

1. **Use Vercel Dashboard** untuk deploy pertama kali (lebih visual)
2. **Set environment variables** untuk Production, Preview, Development (all)
3. **Enable auto-deploy** dari GitHub (default)
4. **Monitor** deployment di Vercel dashboard
5. **Check logs** jika ada error

---

## 🎉 Summary

**Setup Sequence:**
1. Setup Supabase ✓
2. Get API credentials ✓
3. Push to GitHub ✓
4. Deploy to Vercel ✓
5. Set environment variables ✓
6. Register admin ✓
7. Done! 🎊

**Time: ~15 menit total**

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Supabase + Vercel: https://supabase.com/docs/guides/platform/vercel

---

**NEXT STEP:** Setup Supabase dengan `supabase login` dan `supabase link`, lalu deploy!

🚀 **Happy deploying!**
