# 🚀 WorkFlow Hub - Quick Setup dengan CLI

Setup aplikasi dalam **5 menit** menggunakan automated script!

---

## ⚡ Automated Setup (Recommended)

### 1. Run Setup Script

```bash
# Run automated setup
npm run setup

# Script akan:
# ✓ Install Supabase CLI (jika belum)
# ✓ Login ke Supabase
# ✓ Link/Create project
# ✓ Push database schema
# ✓ Generate .env.local otomatis
# ✓ Install dependencies
```

### 2. Start Development

```bash
npm run dev
```

### 3. Register Admin

- Buka http://localhost:3000
- Register user pertama (otomatis admin!)
- Login dan explore

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npm run vercel:prod

# Set environment variables saat prompt
```

**Done! 🎉**

---

## 📋 Manual Setup (Jika Script Gagal)

### 1. Login Supabase

```bash
supabase login
```

### 2. Link Project

```bash
# List projects
supabase projects list

# Link
supabase link --project-ref your-project-ref
```

### 3. Push Database

```bash
supabase db push
```

### 4. Get Credentials

```bash
supabase status --output env > .env.local
```

### 5. Install & Run

```bash
npm install
npm run dev
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Setup
npm run setup            # Automated setup script

# Supabase
npm run supabase:status  # View project status
npm run supabase:push    # Push database changes
npm run supabase:pull    # Pull remote changes
npm run supabase:reset   # Reset local database
npm run supabase:types   # Generate TypeScript types

# Vercel
npm run vercel:deploy    # Deploy to preview
npm run vercel:prod      # Deploy to production
```

---

## 🎯 Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes
# 3. Test locally
# 4. Commit & push

git add .
git commit -m "Add feature"
git push

# Vercel auto-deploys!
```

### Database Changes

```bash
# 1. Create migration
supabase migration new add_feature

# 2. Edit migration file

# 3. Apply locally
npm run supabase:reset

# 4. Test
npm run dev

# 5. Push to remote
npm run supabase:push

# 6. Commit
git add supabase/migrations/
git commit -m "Add feature migration"
git push
```

---

## ✅ Verification

### After Setup

- [ ] `supabase status` shows linked project
- [ ] `.env.local` exists with credentials
- [ ] `npm run dev` works without errors
- [ ] Can register & login
- [ ] Dashboard loads correctly

### After Deployment

- [ ] Vercel deployment successful
- [ ] Production URL accessible
- [ ] Can register & login on production
- [ ] Database operations work

---

## 🐛 Quick Troubleshooting

### Setup script fails
```bash
# Run manually step by step
supabase login
supabase link
supabase db push
supabase status --output env > .env.local
npm install
npm run dev
```

### Can't login to Supabase
```bash
# Check login status
supabase status

# Re-login
supabase login
```

### Database push fails
```bash
# Check diff
supabase db diff

# Force push (careful!)
supabase db push --force
```

### Environment variables not working
```bash
# Regenerate
supabase status --output env > .env.local

# Restart server
npm run dev
```

---

## 📚 Full Documentation

- **Quick Start**: `QUICKSTART.md`
- **CLI Setup**: `SETUP_CLI.md`
- **Manual Setup**: `SETUP_SUPABASE.md`
- **Deployment**: `DEPLOYMENT.md`
- **Full Docs**: `DOCS.md`

---

## 🎉 That's It!

Setup selesai dalam 5 menit dengan automated script!

**Next**: Deploy to production dengan `npm run vercel:prod`

Happy coding! 🚀
