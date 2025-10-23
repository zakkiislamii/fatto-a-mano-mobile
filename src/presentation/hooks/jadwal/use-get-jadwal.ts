import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { JadwalRepository } from "@/src/domain/repositories/jadwal/jadwal-repository";
import { useEffect, useState } from "react";

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
    const vm = new JadwalRepository(uid);

    const unsub = vm.getJadwalKaryawanRealTime(
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
