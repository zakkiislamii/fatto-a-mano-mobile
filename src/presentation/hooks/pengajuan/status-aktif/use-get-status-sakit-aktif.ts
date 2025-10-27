import Today from "@/src/common/utils/get-today";
import { PengajuanSakitRepository } from "@/src/domain/repositories/pengajuan/pengajuan-sakit-repository";
import { useEffect, useState } from "react";

const useGetStatusSakitAktif = (uid: string) => {
  const [isSakitAktif, setIsSakitAktif] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const tanggalHariIni = Today();
    const repo = new PengajuanSakitRepository(uid);

    setLoading(true);

    const unsubscribe = repo.getStatusSakitAktifRealtime(
      tanggalHariIni,
      (isAktif) => {
        setIsSakitAktif(isAktif);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [uid]);

  return {
    isSakitAktif,
    loading,
  };
};

export default useGetStatusSakitAktif;
