import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user: actor },
  } = await supabase.auth.getUser();

  if (!actor) return NextResponse.json({ error: "Silakan login kembali." }, { status: 401 });

  const { data: actorProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", actor.id)
    .single();

  if (actorProfile?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang dapat menambah user." }, { status: 403 });
  }

  let body: { fullName?: unknown; email?: unknown; password?: unknown; role?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "admin" ? "admin" : body.role === "freelancer" ? "freelancer" : null;

  if (fullName.length < 2 || fullName.length > 100) {
    return NextResponse.json({ error: "Nama harus 2–100 karakter." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Masukkan email atau username yang bisa dipakai untuk login." }, { status: 400 });
  }
  if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json({ error: "Password minimal 8 karakter dan mengandung huruf serta angka." }, { status: 400 });
  }
  if (!role) return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({ role, full_name: fullName })
      .eq("id", data.user.id);

    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);
      return NextResponse.json({ error: "Akun gagal disiapkan. Coba lagi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Konfigurasi server admin belum tersedia.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
