import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(3, "Masukkan email atau username")
    .max(254, "Email/username terlalu panjang")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Gunakan format nama@akun.local atau email Anda"),
  password: z.string().min(1, "Password wajib diisi"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
    email: z
      .string()
      .min(3, "Masukkan email atau username")
      .max(254, "Email/username terlalu panjang")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Gunakan format nama@akun.local atau email Anda"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-zA-Z]/, "Password harus mengandung huruf")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[a-zA-Z]/, "Password harus mengandung huruf")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const taskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter"),
  description: z.string().max(2000, "Deskripsi maksimal 2000 karakter").optional().nullable(),
  clientId: z.string().uuid("Pilih client").nullable().optional(),
  freelancerId: z.string().uuid("Pilih freelancer").nullable().optional(),
  status: z.enum(["pending", "in_progress", "review", "completed", "rejected"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional().nullable(),
});
export type TaskInput = z.infer<typeof taskSchema>;

export const clientSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120, "Nama maksimal 120 karakter"),
  company: z.string().max(120).optional().nullable(),
  email: z.string().email("Format email tidak valid").optional().nullable().or(z.literal("")),
  phone: z.string().max(24).optional().nullable().or(z.literal("")),
  notes: z.string().max(1000).optional().nullable(),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const freelancerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(120, "Nama maksimal 120 karakter"),
  email: z.string().email("Format email tidak valid").optional().nullable().or(z.literal("")),
  phone: z.string().max(24).optional().nullable().or(z.literal("")),
  skills: z.array(z.string().min(1)).default([]),
  hourlyRate: z.coerce.number().min(0, "Tidak boleh negatif").max(99999999).optional().nullable(),
  status: z.enum(["active", "inactive"]),
  userId: z.string().uuid("Format User ID tidak valid").optional().nullable().or(z.literal("")),
});
export type FreelancerInput = z.infer<typeof freelancerSchema>;

export const submissionSchema = z.object({
  notes: z.string().min(5, "Catatan minimal 5 karakter").max(2000, "Catatan maksimal 2000 karakter"),
  fileUrl: z.string().url("Format URL tidak valid").optional().nullable().or(z.literal("")),
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

export const reviewSchema = z.object({
  feedback: z.string().max(1000).optional().nullable(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const profileSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  avatarUrl: z.string().url("Format URL tidak valid").optional().nullable().or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;
