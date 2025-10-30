import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { Unsubscribe } from "firebase/auth";
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
    const vm: IJadwalRepository = new JadwalRepositoryImpl();

    const unsub: Unsubscribe | null = vm.getJadwalKaryawanRealTime(
      uid,
      (jadwalData: JadwalKaryawan | null) => {
        setJadwalKaryawan(jadwalData);
        setLoading(false);
      }
    );

    if (!unsub) {
      setLoading(false);
      return;
    }

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [uid]);

  return { jadwalKaryawan, loading, error };
};
