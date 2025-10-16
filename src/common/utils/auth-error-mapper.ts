export function mapFirebaseAuthError(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as any).code)
      : "";

  switch (code) {
    // kredensial salah / user tidak ada
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email atau password salah.";

    // format email / input invalid
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/missing-password":
      return "Password wajib diisi.";

    // user bermasalah
    case "auth/user-disabled":
      return "Akun Anda dinonaktifkan. Hubungi admin.";

    // rate limit / brute force
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi beberapa saat.";

    // jaringan
    case "auth/network-request-failed":
      return "Koneksi jaringan bermasalah. Periksa internet Anda.";

    // pendaftaran
    case "auth/email-already-in-use":
      return "Email sudah terdaftar.";

    // Google Sign-In
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Proses login dibatalkan.";
    case "auth/operation-not-allowed":
      return "Metode login belum diaktifkan. Hubungi admin.";

    default:
      // fallback aman
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}
