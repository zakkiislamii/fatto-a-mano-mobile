import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { useEffect, useState } from "react";
import { UserViewModel } from "../viewModels/user-viewModel";

export const useGetProfile = (uid?: string | null) => {
  const [profilKaryawan, setProfilKaryawan] = useState<ProfilKaryawan | null>(null);
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
    const vm = new UserViewModel(uid);

    const unsub = vm.getUserDataProfileRealtime(
      (userData: ProfilKaryawan | null) => {
        setProfilKaryawan(userData);
        setLoading(false);
      }
    );

    if (!unsub) {
      setLoading(false);
      setError("Tidak dapat berlangganan profil pengguna.");
      return;
    }

    return () => unsub();
  }, [uid]);

  return { profilKaryawan, loading, error };
};
