import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Daftar",
};

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">Buat akun baru</h1>
        <p className="text-xs text-muted-foreground">
          Akun pertama menjadi admin. Email asli tidak wajib; username berbentuk nama@akun.local bisa digunakan.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
