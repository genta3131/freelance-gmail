-- ============================================================
-- WorkFlow Hub — Seed Data Demo (seed.sql)
--
-- ⚠️ HANYA DATA DEMO. Tidak menyentuh struktur tabel.
-- Semua row memakai UUID deterministik dengan pola prefix khusus,
-- sehingga bisa dihapus semua lewat `seed-cleanup.sql`
-- atau dengan menjalankan: supabase db reset
--
-- Jalankan SETELAH migrations via SQL Editor Supabase.
-- ============================================================

-- ============ CLIENTS (5) ============
insert into public.clients (id, name, company, email, phone, notes) values
  ('c1000000-0000-4000-8000-000000000001', 'Rizky Pratama', 'Kopi Nusantara', 'rizky@kopinusantara.id', '+62 812-3456-7801', 'Client F&B, sering request landing page & promo assets.'),
  ('c1000000-0000-4000-8000-000000000002', 'Sari Wijaya', 'Modaika', 'sari@modaika.co.id', '+62 812-3456-7802', 'E-commerce fashion. Feedback cukup cepat, bayar tepat waktu.'),
  ('c1000000-0000-4000-8000-000000000003', 'Andi Saputra', 'FinTrack', 'andi@fintrack.io', '+62 812-3456-7803', 'Startup fintech, fokus dashboard & mobile app.'),
  ('c1000000-0000-4000-8000-000000000004', 'Maya Lestari', 'KelasGit', 'maya@kelasgit.com', '+62 812-3456-7804', 'Edutech. Konten video & materi kursus.'),
  ('c1000000-0000-4000-8000-000000000005', 'Budi Hartono', 'PT Sumber Rejeki', 'budi@sumberrejeki.co.id', '+62 812-3456-7805', 'Perusahaan manufaktur, butuh company profile.');

-- ============ FREELANCERS (6) ============
insert into public.freelancers (id, user_id, name, email, phone, skills, hourly_rate, status) values
  ('f1000000-0000-4000-8000-000000000001', null, 'Dian Anggraini', 'dian.anggraini@mail.com', '+62 813-1111-2201', array['Figma', 'UI Design', 'Illustrator', 'Branding'], 250000, 'active'),
  ('f1000000-0000-4000-8000-000000000002', null, 'Fajar Nugroho', 'fajar.nugroho@mail.com', '+62 813-1111-2202', array['React', 'Next.js', 'TypeScript', 'Tailwind'], 450000, 'active'),
  ('f1000000-0000-4000-8000-000000000003', null, 'Putri Maharani', 'putri.maharani@mail.com', '+62 813-1111-2203', array['Copywriting', 'SEO', 'Content Writing'], 180000, 'active'),
  ('f1000000-0000-4000-8000-000000000004', null, 'Raka Aditya', 'raka.aditya@mail.com', '+62 813-1111-2204', array['Video Editing', 'After Effects', 'Motion Graphics'], 300000, 'active'),
  ('f1000000-0000-4000-8000-000000000005', null, 'Nadia Salsabila', 'nadia.salsabila@mail.com', '+62 813-1111-2205', array['Flutter', 'Mobile Dev', 'Firebase'], 400000, 'active'),
  ('f1000000-0000-4000-8000-000000000006', null, 'Ilham Ramadhan', 'ilham.ramadhan@mail.com', '+62 813-1111-2206', array['Laravel', 'PHP', 'MySQL'], 350000, 'inactive');

-- ============ TASKS (20) ============
insert into public.tasks (id, title, description, client_id, freelancer_id, status, priority, due_date, created_at) values
  -- Pending (4)
  ('6a000000-0000-4000-8000-000000000001', 'Landing page promo menu Ramadan', 'Landing page satu halaman untuk promo paket menu Ramadan: hero, menu, testimoni, CTA whatsapp. Referensi visual ada di brief klien.', 'c1000000-0000-4000-8000-000000000001', 'f1000000-0000-4000-8000-000000000002', 'pending', 'high', current_date + 5, now() - interval '3 days'),
  ('6a000000-0000-4000-8000-000000000002', 'Artikel blog SEO: tips berhemat belanja online', 'Artikel 1200 kata, keyword utama "tips belanja online hemat", minimal 2 H2 internal link ke koleksi.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000003', 'pending', 'medium', current_date + 9, now() - interval '2 days'),
  ('6a000000-0000-4000-8000-000000000003', 'Desain cover materi kursus Git', 'Set cover 3 modul: Git Dasar, Branching, Collaboration. Style konsisten dengan brand colors KelasGit.', 'c1000000-0000-4000-8000-000000000004', null, 'pending', 'low', current_date + 14, now() - interval '1 day'),
  ('6a000000-0000-4000-8000-000000000004', 'Company profile PDF PT Sumber Rejeki', 'Company profile 8 halaman: sejarah, visi misi, lini produk, kontak. Referensi brosur lama ada di Google Drive klien.', 'c1000000-0000-4000-8000-000000000005', null, 'pending', 'medium', current_date + 12, now() - interval '12 hours'),

  -- In Progress (5)
  ('6a000000-0000-4000-8000-000000000005', 'Redesign halaman checkout Modaika', 'Perbaikan UX checkout: ringkas langkah, tambah estimasi ongkir, trust badge. Deliver via Figma.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000001', 'in_progress', 'urgent', current_date + 2, now() - interval '6 days'),
  ('6a000000-0000-4000-8000-000000000006', 'Dashboard chart FinTrack — modul cashflow', 'Komponen chart cashflow harian & bulanan. Warna mengikuti design token mobile app yang ada.', 'c1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000002', 'in_progress', 'high', current_date + 4, now() - interval '5 days'),
  ('6a000000-0000-4000-8000-000000000007', 'Video promo 30 detik menu andalan Kopi Nusantara', 'Menggunakan footage existing + motion text. Output: MP4 1080p, rasio 16:9 dan 9:16.', 'c1000000-0000-4000-8000-000000000001', 'f1000000-0000-4000-8000-000000000004', 'in_progress', 'medium', current_date + 6, now() - interval '4 days'),
  ('6a000000-0000-4000-8000-000000000008', 'Aplikasi mobile tracking pengeluaran (MVP)', 'Flutter MVP: onboarding, input transaksi, kategori, laporan sederhana. Sinkron Firebase.', 'c1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000005', 'in_progress', 'urgent', current_date + 8, now() - interval '7 days'),
  ('6a000000-0000-4000-8000-000000000009', 'Banner carousel katalog fashion mingguan', '5 banner carousel untuk homepage Modaika, mengikuti template mingguan.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000001', 'in_progress', 'medium', current_date + 1, now() - interval '2 days'),

  -- Review (3)
  ('6a000000-0000-4000-8000-000000000010', 'Artikel blog: panduan memilih hem untuk proyek dev', '2000 kata, tone santai-edukatif. Perlu referensi kain & harga pasar.', 'c1000000-0000-4000-8000-000000000005', 'f1000000-0000-4000-8000-000000000003', 'review', 'medium', current_date, now() - interval '8 days'),
  ('6a000000-0000-4000-8000-000000000011', 'Ilustrasi empty state aplikasi FinTrack', '3 ilustrasi empty state: tanpa data, tidak ada koneksi, pertama kali pakai.', 'c1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000001', 'review', 'low', current_date + 1, now() - interval '6 days'),
  ('6a000000-0000-4000-8000-000000000012', 'Video tutorial 5 menit: push project ke GitHub', 'Screen recording + voice over. Script sudah disetujui klien.', 'c1000000-0000-4000-8000-000000000004', 'f1000000-0000-4000-8000-000000000004', 'review', 'high', current_date - 1, now() - interval '5 days'),

  -- Completed (6)
  ('6a000000-0000-4000-8000-000000000013', 'Landing page FinTrack versi beta', 'Halaman utama beta launch: hero, fitur, early access form.', 'c1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000002', 'completed', 'high', current_date - 10, now() - interval '20 days'),
  ('6a000000-0000-4000-8000-000000000014', 'Logo refresh Kopi Nusantara', 'Refresh logo + brand guideline singkat (2 halaman).', 'c1000000-0000-4000-8000-000000000001', 'f1000000-0000-4000-8000-000000000001', 'completed', 'medium', current_date - 14, now() - interval '25 days'),
  ('6a000000-0000-4000-8000-000000000015', 'Copywriting halaman "Tentang Kami"', 'Copy 400 kata, tone profesional namun mudah dibaca.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000003', 'completed', 'low', current_date - 9, now() - interval '15 days'),
  ('6a000000-0000-4000-8000-000000000016', 'Video teaser kelas "Belajar Git dari Nol"', 'Teaser 45 detik untuk iklan sosial media.', 'c1000000-0000-4000-8000-000000000004', 'f1000000-0000-4000-8000-000000000004', 'completed', 'high', current_date - 7, now() - interval '12 days'),
  ('6a000000-0000-4000-8000-000000000017', 'Fix bug kalkulasi ongkir (backend)', 'Perbaikan kalkulasi berat volumetrik di Laravel.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000006', 'completed', 'urgent', current_date - 12, now() - interval '18 days'),
  ('6a000000-0000-4000-8000-000000000018', 'UI kit dasar aplikasi FinTrack', 'Komponen dasar: button, input, card, chart states.', 'c1000000-0000-4000-8000-000000000003', 'f1000000-0000-4000-8000-000000000001', 'completed', 'medium', current_date - 20, now() - interval '30 days'),

  -- Rejected (2)
  ('6a000000-0000-4000-8000-000000000019', 'Copywriting email campaign flash sale', '3 varian email promosi. Ditolak: tone tidak cocok dengan brand voice Modaika.', 'c1000000-0000-4000-8000-000000000002', 'f1000000-0000-4000-8000-000000000003', 'rejected', 'medium', current_date - 3, now() - interval '9 days'),
  ('6a000000-0000-4000-8000-000000000020', 'Story board video company profile', 'Storyboard 8 scene. Ditolak: klien minta gaya sinematik, bukan animasi.', 'c1000000-0000-4000-8000-000000000005', 'f1000000-0000-4000-8000-000000000004', 'rejected', 'low', current_date - 2, now() - interval '7 days');

-- ============ SUBMISSIONS (11) ============
insert into public.submissions (id, task_id, freelancer_id, notes, file_url, status, feedback, reviewed_by, reviewed_at, created_at) values
  ('b1000000-0000-4000-8000-000000000001', '6a000000-0000-4000-8000-000000000013', 'f1000000-0000-4000-8000-000000000002', 'Landing page beta selesai, live di staging Vercel. Satu bug minor form sudah diperbaiki.', 'https://example.com/fintrack-beta.zip', 'approved', 'Bagus, clean code dan momentum bagus. Lanjut ke dashboard.', null, now() - interval '10 days', now() - interval '11 days'),
  ('b1000000-0000-4000-8000-000000000002', '6a000000-0000-4000-8000-000000000014', 'f1000000-0000-4000-8000-000000000001', 'Logo refresh + guideline diupload. Lebih segar tapi tetap familiar.', 'https://example.com/kopi-logo.zip', 'approved', 'Direktur suka dengan versi final. Nice!', null, now() - interval '13 days', now() - interval '14 days'),
  ('b1000000-0000-4000-8000-000000000003', '6a000000-0000-4000-8000-000000000015', 'f1000000-0000-4000-8000-000000000003', 'Copy Tentang Kami final sudah sesuai brief.', 'https://example.com/tentang-kami.docx', 'approved', 'Copy ok. Tinggal kecil-tidakpolisikan beberapa frasa.', null, now() - interval '9 days', now() - interval '10 days'),
  ('b1000000-0000-4000-8000-000000000004', '6a000000-0000-4000-8000-000000000016', 'f1000000-0000-4000-8000-000000000004', 'Teaser 45s, ada 2 versi (with/without voice over).', 'https://example.com/kelasgit-teaser.mp4', 'approved', 'Klien suka! Dipakai untuk iklan pertama.', null, now() - interval '8 days', now() - interval '9 days'),
  ('b1000000-0000-4000-8000-000000000005', '6a000000-0000-4000-8000-000000000017', 'f1000000-0000-4000-8000-000000000006', 'Fix sudah diterapkan ke main branch via PR #42.', 'https://example.com/pr-42.patch', 'approved', 'LGTM. Terima kasih, ongkir sudah akurat.', null, now() - interval '11 days', now() - interval '12 days'),
  ('b1000000-0000-4000-8000-000000000006', '6a000000-0000-4000-8000-000000000018', 'f1000000-0000-4000-8000-000000000001', 'UI kit 24 komponen, sudah dihandoff di Figma.', 'https://example.com/fintrack-uikit.zip', 'approved', 'Sangat konsisten. Ini jadi acuan modul berikutnya.', null, now() - interval '19 days', now() - interval '20 days'),
  ('b1000000-0000-4000-8000-000000000007', '6a000000-0000-4000-8000-000000000019', 'f1000000-0000-4000-8000-000000000003', '3 varian email campaign terlampir.', 'https://example.com/email-campaign.docx', 'rejected', 'Tone terlalu agresif. Brand voice Modaika lebih ramah, coba versi kedua.', null, now() - interval '7 days', now() - interval '8 days'),
  ('b1000000-0000-4000-8000-000000000008', '6a000000-0000-4000-8000-000000000020', 'f1000000-0000-4000-8000-000000000004', 'Storyboard 8 scene terlampir.', 'https://example.com/storyboard.pdf', 'rejected', 'Klien minta gaya live-action sinematik, bukan animasi. Perlu pendekatan ulang.', null, now() - interval '6 days', now() - interval '7 days'),

  -- Pending reviews (review tasks tanpa keputusan)
  ('b1000000-0000-4000-8000-000000000009', '6a000000-0000-4000-8000-000000000010', 'f1000000-0000-4000-8000-000000000003', 'Draft artikel panduan memilih hem, 2100 kata.', 'https://example.com/panduan-hem.docx', 'pending', null, null, null, now() - interval '1 day'),
  ('b1000000-0000-4000-8000-000000000010', '6a000000-0000-4000-8000-000000000011', 'f1000000-0000-4000-8000-000000000001', '3 ilustrasi empty state, sudah konsisten palet FinTrack.', 'https://example.com/empty-states.zip', 'pending', null, null, null, now() - interval '4 hours'),
  ('b1000000-0000-4000-8000-000000000011', '6a000000-0000-4000-8000-000000000012', 'f1000000-0000-4000-8000-000000000004', 'Video tutorial final, 5m12s. Audio sudah dirapikan.', 'https://example.com/git-tutorial.mp4', 'pending', null, null, null, now() - interval '2 days');

-- ============ ACTIVITY LOGS (8) ============
insert into public.activity_logs (id, user_id, action, entity_type, entity_id, metadata, created_at) values
  ('aa000000-0000-4000-8000-000000000001', null, 'task_updated', 'task', '6a000000-0000-4000-8000-000000000009', '{"title": "Banner carousel katalog fashion mingguan", "status": "in_progress"}', now() - interval '2 hours'),
  ('aa000000-0000-4000-8000-000000000002', null, 'submission_created', 'submission', 'b1000000-0000-4000-8000-000000000010', '{"task": "Ilustrasi empty state aplikasi FinTrack"}', now() - interval '4 hours'),
  ('aa000000-0000-4000-8000-000000000003', null, 'task_created', 'task', '6a000000-0000-4000-8000-000000000004', '{"title": "Company profile PDF PT Sumber Rejeki"}', now() - interval '12 hours'),
  ('aa000000-0000-4000-8000-000000000004', null, 'task_created', 'task', '6a000000-0000-4000-8000-000000000003', '{"title": "Desain cover materi kursus Git"}', now() - interval '1 day'),
  ('aa000000-0000-4000-8000-000000000005', null, 'submission_approved', 'submission', 'b1000000-0000-4000-8000-000000000006', '{"task": "UI kit dasar aplikasi FinTrack"}', now() - interval '19 days'),
  ('aa000000-0000-4000-8000-000000000006', null, 'freelancer_assigned', 'task', '6a000000-0000-4000-8000-000000000008', '{"freelancer": "Nadia Salsabila"}', now() - interval '7 days'),
  ('aa000000-0000-4000-8000-000000000007', null, 'client_created', 'client', 'c1000000-0000-4000-8000-000000000005', '{"name": "PT Sumber Rejeki"}', now() - interval '9 days'),
  ('aa000000-0000-4000-8000-000000000008', null, 'task_completed', 'task', '6a000000-0000-4000-8000-000000000016', '{"title": "Video teaser kelas \"Belajar Git dari Nol\""}', now() - interval '7 days');
