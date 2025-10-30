import Today from "@/src/common/utils/get-today";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan/pengajuan-repository-impl";
import { IPengajuanRepository } from "@/src/domain/repositories/pengajuan/i-pengajuan-repository";
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
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    setLoading(true);

    const unsubscribe = repo.getStatusSakitAktif(
      uid,
      tanggalHariIni,
      (isAktif) => {
        setIsSakitAktif(isAktif);
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
    isSakitAktif,
    loading,
  };
};

export default useGetStatusSakitAktif;
