-- ============================================================
-- WorkFlow Hub — Hapus Data Demo (seed-cleanup.sql)
--
-- Jalankan file ini di SQL Editor Supabase jika ingin menghapus
-- SEMUA data demo yang dibuat oleh seed.sql.
-- Urutan delete mengikuti FK, aman dijalankan berulang kali.
--
-- Catatan: tabel profiles & auth users TIDAK dihapus.
-- ============================================================

begin;

delete from public.activity_logs
  where id::text like 'aa000000-0000-4000-8000-0000000000%';

delete from public.submissions
  where id::text like 'b1000000-0000-4000-8000-0000000000%';

delete from public.tasks
  where id::text like '6a000000-0000-4000-8000-0000000000%';

delete from public.freelancers
  where id::text like 'f1000000-0000-4000-8000-0000000000%';

delete from public.clients
  where id::text like 'c1000000-0000-4000-8000-0000000000%';

commit;

-- Verifikasi: seharusnya semua 0
select 'activity_logs' as tabel, count(*) from public.activity_logs
  where id::text like 'aa000000-0000-4000-8000-0000000000%'
union all
select 'submissions', count(*) from public.submissions
  where id::text like 'b1000000-0000-4000-8000-0000000000%'
union all
select 'tasks', count(*) from public.tasks
  where id::text like '6a000000-0000-4000-8000-0000000000%'
union all
select 'freelancers', count(*) from public.freelancers
  where id::text like 'f1000000-0000-4000-8000-0000000000%'
union all
select 'clients', count(*) from public.clients
  where id::text like 'c1000000-0000-4000-8000-0000000000%';
