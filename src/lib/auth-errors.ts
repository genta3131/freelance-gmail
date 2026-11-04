export function translateAuthError(message: string) {
  switch (message) {
    case "Invalid login credentials":
      return "Email atau password salah";
    case "Email not confirmed":
      return "Email belum dikonfirmasi. Cek kotak masuk Anda.";
    case "User already registered":
      return "Email sudah terdaftar. Coba login.";
    default:
      return message;
  }
}
