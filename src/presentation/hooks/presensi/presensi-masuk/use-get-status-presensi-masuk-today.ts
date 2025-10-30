import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { IPresensiRepository } from "@/src/domain/repositories/i-presensi-repository";
import { useEffect, useState } from "react";

const useGetStatusPresensiMasukToday = (uid: string) => {
  const [presensiMasukStatus, setPresensiMasukStatus] =
    useState<PresensiMasukStatus>({
      sudah_masuk: false,
      status: null,
      terlambat: false,
      durasi_terlambat: null,
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo: IPresensiRepository = new PresensiRepositoryImpl();
    const unsubscribe = repo.getPresensiMasukToday(uid, (status) => {
      setPresensiMasukStatus(status);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid]);

  return {
    presensiMasukStatus,
    loading,
  };
};

export default useGetStatusPresensiMasukToday;
