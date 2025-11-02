import { UserRepositoryImpl } from "@/src/data/repositories/user-repository-impl";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { IUserRepository } from "@/src/domain/repositories/i-user-repository";
import { Unsubscribe } from "firebase/firestore";
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
    const repo: IUserRepository = new UserRepositoryImpl();

    const unsub: Unsubscribe | null = repo.getProfilRealTime(
      uid,
      (raw: ProfilKaryawan | null) => {
        if (!raw) {
          setProfilKaryawan(null);
          setLoading(false);
          return;
        }

        setProfilKaryawan({
          nama: typeof raw.nama === "string" ? raw.nama : "",
          nomor_hp: typeof raw.nomor_hp === "string" ? raw.nomor_hp : "",
          email: typeof raw.email === "string" ? raw.email : "",
          divisi: typeof raw.divisi === "string" ? raw.divisi : "",
          updated_at: raw.updated_at,
        });
        setLoading(false);
      }
    );

    if (!unsub) {
      setLoading(false);
      setError("Tidak dapat berlangganan profil pengguna.");
      return;
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [uid]);

  return { profilKaryawan, loading, error };
};
