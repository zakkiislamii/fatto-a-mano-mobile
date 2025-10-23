import { PresensiKeluarStatus } from "@/src/common/types/presensi-keluar-status";
import { PresensiKeluarRepository } from "@/src/domain/repositories/presensi/presensi-keluar-repository";
import { useEffect, useState } from "react";

const useGetStatusPresensiKeluarToday = (uid: string) => {
  const [presensiKeluarStatus, setPresensiKeluarStatus] =
    useState<PresensiKeluarStatus>({
      sudah_keluar: false,
      lembur: false,
    });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const repo = new PresensiKeluarRepository(uid, "");
    const unsubscribe = repo.getPresensiKeluarToday((status) => {
      setPresensiKeluarStatus(status);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return {
    presensiKeluarStatus,
    loading,
  };
};

export default useGetStatusPresensiKeluarToday;
