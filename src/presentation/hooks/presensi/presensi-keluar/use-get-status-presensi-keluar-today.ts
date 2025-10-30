import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi/presensi-repository-impl";
import { IPresensiRepository } from "@/src/domain/repositories/presensi/i-presensi-repository";
import { useEffect, useState } from "react";

const useGetStatusPresensiKeluarToday = (uid: string) => {
  const [presensiKeluarStatus, setPresensiKeluarStatus] =
    useState<PresensiKeluarStatus>({
      sudah_keluar: false,
      lembur: false,
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo: IPresensiRepository = new PresensiRepositoryImpl();
    const unsubscribe = repo.getPresensiKeluarToday(uid, (status) => {
      setPresensiKeluarStatus(status);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid]);

  return {
    presensiKeluarStatus,
    loading,
  };
};

export default useGetStatusPresensiKeluarToday;
