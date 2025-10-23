import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { PresensiMasukRepository } from "@/src/domain/repositories/presensi/presensi-masuk-repository";
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
    const repo = new PresensiMasukRepository(uid, "");
    const unsubscribe = repo.getPresensiMasukToday((status) => {
      setPresensiMasukStatus(status);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return {
    presensiMasukStatus,
    loading,
  };
};

export default useGetStatusPresensiMasukToday;
