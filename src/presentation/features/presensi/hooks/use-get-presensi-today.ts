import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiMasukStatus } from "@/src/common/types/presensi-masuk-status";
import { PresensiMasukRepository } from "@/src/domain/repositories/presensi-masuk-repository";
import { useEffect, useState } from "react";

const useGetPresensiToday = (uid: string) => {
  const [presensiStatus, setPresensiStatus] = useState<PresensiMasukStatus>({
    sudah_masuk: false,
    status: null,
    terlambat: false,
    durasi_terlambat: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new PresensiMasukRepository(uid, "", StatusPresensi.hadir);

    const unsubscribe = repo.getPresensiMasukToday((status) => {
      setPresensiStatus(status);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return {
    presensiStatus,
    loading,
  };
};

export default useGetPresensiToday;
