import { RiwayatRepositoryImpl } from "@/src/data/repositories/riwayat-repository-impl";
import { Presensi } from "@/src/domain/models/presensi";
import { IRiwayatRepository } from "@/src/domain/repositories/i-riwayat-repository";
import { useEffect, useState } from "react";

export const usePresensiByDate = (uid: string, tanggal: string) => {
  const [presensi, setPresensi] = useState<Presensi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid || !tanggal) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const repository: IRiwayatRepository = new RiwayatRepositoryImpl();

    const unsubscribe = repository.getPresensiByDate(uid, tanggal, (data) => {
      setPresensi(data);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [uid, tanggal]);

  return { presensi, loading, error };
};
