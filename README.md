# WorkFlow Hub - Freelance Management System

Aplikasi manajemen freelance modern yang dibangun dengan Next.js, Supabase, dan TypeScript.

## 🚀 Fitur

### Admin
- **Dashboard** - Overview statistik dan metrics
- **Task Management** - Buat, edit, hapus, dan assign task ke freelancer
- **Freelancer Management** - Kelola database freelancer dengan skills dan hourly rate
- **Client Management** - Kelola database client dan perusahaan
- **Submission Review** - Review dan approve/reject submission dari freelancer
- **Analytics** - Lihat performa dan statistik
- **Activity Logs** - Track semua aktivitas sistem

### Freelancer
- **Task List** - Lihat task yang ditugaskan
- **Submit Work** - Kirim submission untuk task
- **Track Progress** - Monitor status submission
- **Profile Settings** - Update profil dan password

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **Language**: TypeScript

## 📦 Setup

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run migrations (setup database schema)
# Jalankan file SQL di folder supabase/migrations di Supabase Dashboard

# Start development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Folder

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register, etc)
│   ├── (dashboard)/       # Dashboard pages
│   │   ├── dashboard/     # Overview
│   │   ├── tasks/         # Task management
│   │   ├── freelancers/   # Freelancer management
│   │   ├── clients/       # Client management
│   │   ├── submissions/   # Submission management
│   │   ├── analytics/     # Analytics
│   │   ├── activity/      # Activity logs
│   │   └── settings/      # User settings
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── tasks/            # Task-related components
│   ├── freelancers/      # Freelancer components
│   ├── clients/          # Client components
│   ├── submissions/      # Submission components
│   ├── settings/         # Settings components
│   ├── activity/         # Activity components
│   ├── shell/            # Layout components (sidebar, menu)
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client setup
│   ├── utils.ts         # Helper functions
│   ├── activity.ts      # Activity logging
│   ├── constants.ts     # Constants & mappings
│   └── validations.ts   # Form validation schemas
└── types/               # TypeScript types
    └── database.ts      # Database types
```

## 🔐 Authentication

Aplikasi menggunakan Supabase Auth dengan 2 role:

- **admin**: Full access ke semua fitur
- **freelancer**: Akses terbatas hanya ke task dan submission mereka

### Default Admin

Buat admin pertama melalui SQL:

```sql
-- Setelah register user pertama, update role menjadi admin
UPDATE profiles SET role = 'admin' WHERE id = 'user_id_dari_auth_users';
```

## 📊 Database Schema

Database terdiri dari 6 tabel utama:

1. **profiles** - User profiles dengan role
2. **clients** - Client/customer data
3. **freelancers** - Freelancer database
4. **tasks** - Task/project assignments
5. **submissions** - Work submissions dari freelancer
6. **activity_logs** - System activity tracking

Lihat file `supabase/migrations` untuk schema lengkap.

## 🎨 UI Components

Menggunakan komponen dari:
- Radix UI untuk primitives
- Tailwind CSS untuk styling
- Custom components di `src/components/ui/`

## 📝 Development Workflow

### Admin Workflow

1. Tambah freelancer dan client
2. Buat task dan assign ke freelancer
3. Review submission yang masuk
4. Track progress di analytics

### Freelancer Workflow

1. Login dan lihat task yang ditugaskan
2. Kerjakan task
3. Submit hasil pekerjaan dengan notes dan file
4. Tunggu review dari admin

## 🔧 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js and Supabase
# freelance-gmail
