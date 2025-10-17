import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { useEffect, useState } from "react";
import { JadwalViewModel } from "../../viewModels/jadwal-viewModel";

export const useGetJadwal = (uid?: string | null) => {
  const [jadwalKaryawan, setJadwalKaryawan] = useState<JadwalKaryawan | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(!!uid);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJadwalKaryawan(null);
    setError(null);

    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const vm = new JadwalViewModel(uid);

    const unsub = vm.getJadwalKaryawanRealtime(
      (jadwalData: JadwalKaryawan | null) => {
        setJadwalKaryawan(jadwalData);
        setLoading(false);
      }
    );

    if (!unsub) {
      setLoading(false);
      return;
    }

    return () => unsub();
  }, [uid]);

  return { jadwalKaryawan, loading, error };
};
