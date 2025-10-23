import { ProfilKaryawan } from "@/src/common/types/profil-karyawan";
import { UserRepository } from "@/src/domain/repositories/user/user-repository";
import { useEffect, useState } from "react";

export const useGetProfile = (uid?: string | null) => {
  const [profilKaryawan, setProfilKaryawan] = useState<ProfilKaryawan | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(!!uid);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfilKaryawan(null);
    setError(null);

    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo = new UserRepository(uid);

    const unsub = repo.getProfilRealTime((raw: ProfilKaryawan | null) => {
      if (!raw) {
        setProfilKaryawan(null);
        setLoading(false);
        return;
      }

      const cleanedNik = String(raw.nik ?? "")
        .replace(/\D+/g, "")
        .slice(0, 16);

      setProfilKaryawan({
        nama: typeof raw.nama === "string" ? raw.nama : "",
        nik: cleanedNik,
        nomor_hp: typeof raw.nomor_hp === "string" ? raw.nomor_hp : "",
        email: typeof raw.email === "string" ? raw.email : "",
        divisi: typeof raw.divisi === "string" ? raw.divisi : "",
      });
      setLoading(false);
    });

    if (!unsub) {
      setLoading(false);
      setError("Tidak dapat berlangganan profil pengguna.");
      return;
    }

    return () => unsub();
  }, [uid]);

  return { profilKaryawan, loading, error };
};
