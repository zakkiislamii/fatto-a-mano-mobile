import Today from "@/src/common/utils/get-today";
import { PengajuanIzinRepository } from "@/src/domain/repositories/pengajuan/pengajuan-izin-repository";
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
    const repo = new PengajuanIzinRepository(uid);

    setLoading(true);

    const unsubscribe = repo.getStatusIzinAktifRealtime(
      tanggalHariIni,
      (isAktif) => {
        setIsIzinAktif(isAktif);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [uid]);

  return {
    isIzinAktif,
    loading,
  };
};

export default useGetStatusIzinAktif;
