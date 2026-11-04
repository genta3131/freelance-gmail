# Setup dengan Supabase CLI & Vercel

Panduan setup menggunakan Supabase CLI dan deploy ke Vercel - cara tercepat dan ter-integrasi!

## 🚀 Prerequisites

- ✅ Supabase CLI sudah terinstall
- ✅ Project sudah di-init (`supabase init` sudah dijalankan)
- ✅ Punya akun Supabase (https://supabase.com)
- ✅ Punya akun Vercel (https://vercel.com)
- ✅ Punya akun GitHub (untuk push code)

---

## 📦 Step 1: Login ke Supabase CLI

```bash
# Login ke Supabase
supabase login

# Browser akan terbuka untuk authentication
# Authorize CLI access
```

---

## 🔗 Step 2: Link ke Supabase Project

### Option A: Link ke Project yang Sudah Ada

```bash
# List projects
supabase projects list

# Link ke project
supabase link --project-ref your-project-ref
```

### Option B: Buat Project Baru via CLI

```bash
# Buat project baru
supabase projects create workflow-hub --org-id your-org-id

# Link otomatis
supabase link
```

---

## 🗄️ Step 3: Push Database Schema

```bash
# Push migrations ke Supabase
supabase db push

# Atau jika mau review dulu
supabase db diff

# Lalu push
supabase db push
```

Migrations dari folder `supabase/migrations/` akan otomatis ter-apply ke project Anda!

---

## 🔑 Step 4: Get Environment Variables

```bash
# Generate .env.local otomatis
supabase status --output env > .env.local

# Atau manual get credentials
supabase status
```

Environment variables akan otomatis ter-set di `.env.local`!

---

## ▶️ Step 5: Test Local

```bash
# Start development server
npm run dev

# Test di browser
# Buka http://localhost:3000
# Register user pertama (otomatis jadi admin)
```

---

## 🚢 Step 6: Deploy ke Vercel

### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy!
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: workflow-hub
# - Directory: ./
# - Override settings? No

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste URL dari supabase status

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# Paste anon key dari supabase status

# Deploy to production
vercel --prod
```

### Option B: Via Vercel Dashboard

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/workflow-hub.git
git push -u origin main

# 2. Import di Vercel
# - Login ke vercel.com
# - Import repository
# - Set environment variables:
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
# - Deploy!
```

---

## 🔄 Step 7: Link Vercel dengan Supabase (Optional but Recommended)

```bash
# Integrate Supabase dengan Vercel project
supabase link --project-ref your-project-ref

# Set Vercel environment variables otomatis
vercel env pull .env.vercel
vercel env add < .env.vercel
```

---

## ✅ Verification Checklist

### Local Development
- [ ] `supabase status` menunjukkan project linked
- [ ] `.env.local` sudah terisi otomatis
- [ ] `npm run dev` berjalan tanpa error
- [ ] Register user berhasil
- [ ] Login berhasil
- [ ] Dashboard muncul

### Production
- [ ] Vercel deployment success
- [ ] Environment variables ter-set
- [ ] Production URL accessible
- [ ] Register & login work
- [ ] Database queries work

---

## 🛠️ Useful Commands

### Supabase CLI

```bash
# Status project
supabase status

# List projects
supabase projects list

# Get API credentials
supabase status --output env

# Push database changes
supabase db push

# Pull remote changes
supabase db pull

# View logs
supabase logs

# Reset local database (development only)
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

### Vercel CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull

# Remove deployment
vercel remove
```

---

## 🔄 Development Workflow

### Daily Development

```bash
# 1. Start local Supabase (optional)
supabase start

# 2. Start Next.js dev server
npm run dev

# 3. Make changes
# 4. Test locally
# 5. Commit changes

git add .
git commit -m "Add feature X"
git push

# 6. Vercel auto-deploys on push!
```

### Database Changes

```bash
# 1. Create new migration
supabase migration new add_new_feature

# 2. Edit migration file in supabase/migrations/

# 3. Apply locally
supabase db reset

# 4. Test changes
npm run dev

# 5. Push to remote
supabase db push

# 6. Commit migration
git add supabase/migrations/
git commit -m "Add new feature migration"
git push
```

---

## 🎯 Quick Start (Dengan CLI)

```bash
# 1. Login
supabase login

# 2. Link atau buat project
supabase link

# 3. Push database
supabase db push

# 4. Get env vars
supabase status --output env > .env.local

# 5. Start dev
npm run dev

# 6. Deploy to Vercel
vercel login
vercel

# 7. Set env vars di Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 8. Deploy production
vercel --prod

# Done! 🎉
```

**Total time: ~10 menit**

---

## 🐛 Troubleshooting

### Supabase CLI Issues

**Problem**: `supabase: command not found`

**Solution**:
```bash
npm install -g supabase
# atau
npx supabase login
```

---

**Problem**: `Failed to link project`

**Solution**:
```bash
# Make sure logged in
supabase login

# Try manual link
supabase link --project-ref YOUR_PROJECT_REF
```

---

**Problem**: Database push fails

**Solution**:
```bash
# Check status
supabase status

# Review diff
supabase db diff

# Force push (careful!)
supabase db push --force
```

---

### Vercel Issues

**Problem**: Build fails on Vercel

**Solution**:
```bash
# Test build locally first
npm run build

# Check build logs di Vercel dashboard
# Usually environment variables missing
```

---

**Problem**: Environment variables not working

**Solution**:
```bash
# Set for all environments
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Select: Production, Preview, Development (all)

# Redeploy
vercel --prod
```

---

## 📊 Architecture

```
Developer Machine
    │
    ├─→ npm run dev (Local Development)
    │
    ├─→ supabase CLI
    │   ├─→ Login & Auth
    │   ├─→ Link to Project
    │   ├─→ Push/Pull Migrations
    │   └─→ Get Credentials
    │
    └─→ git push
        │
        └─→ GitHub Repository
            │
            └─→ Vercel (Auto Deploy)
                ├─→ Build Next.js
                ├─→ Set Env Vars
                └─→ Deploy to Production
                    │
                    └─→ Connect to Supabase (Cloud)
```

---

## 🎉 Benefits of CLI Setup

✅ **Faster**: Setup dalam 10 menit  
✅ **Automated**: Migrations auto-apply  
✅ **Type-safe**: Generate TypeScript types  
✅ **Git-friendly**: Migrations dalam version control  
✅ **Team-ready**: Easy collaboration  
✅ **CI/CD ready**: Auto-deploy on push  

---

## 🔐 Security Notes

- ✅ `.env.local` sudah di `.gitignore`
- ✅ Never commit API keys to Git
- ✅ Use environment variables di Vercel
- ✅ RLS policies protect data
- ✅ Use `service_role` key hanya di server-side

---

## 📚 Next Steps

1. **Setup CI/CD**: GitHub Actions untuk testing
2. **Add Staging**: Vercel preview deployments
3. **Monitor**: Vercel Analytics + Supabase Dashboard
4. **Scale**: Upgrade Supabase plan jika perlu

---

**Dokumentasi Lengkap:**
- Supabase CLI: https://supabase.com/docs/guides/cli
- Vercel: https://vercel.com/docs

---

**Happy deploying!** 🚀
