import Today from "@/src/common/utils/get-today";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan/pengajuan-repository-impl";
import { IPengajuanRepository } from "@/src/domain/repositories/pengajuan/i-pengajuan-repository";
import { useEffect, useState } from "react";

const useGetStatusIzinAktif = (uid: string) => {
  const [isIzinAktif, setIsIzinAktif] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const tanggalHariIni = Today();
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    setLoading(true);

    const unsubscribe = repo.getStatusIzinAktif(
      uid,
      tanggalHariIni,
      (isAktif) => {
        setIsIzinAktif(isAktif);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid]);

  return {
    isIzinAktif,
    loading,
  };
};

export default useGetStatusIzinAktif;
