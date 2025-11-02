import { RiwayatRepositoryImpl } from "@/src/data/repositories/riwayat-repository-impl";
import { Presensi } from "@/src/domain/models/presensi";
import { IRiwayatRepository } from "@/src/domain/repositories/i-riwayat-repository";
import { useEffect, useState } from "react";

export const useRiwayatByMonth = (uid: string, month: Date) => {
  const [riwayat, setRiwayat] = useState<Presensi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const repository: IRiwayatRepository = new RiwayatRepositoryImpl();
    const year = month.getFullYear();
    const monthNum = month.getMonth();

    const unsubscribe = repository.getAllPresensiByMonth(
      uid,
      year,
      monthNum,
      (data) => {
        setRiwayat(data);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [month, uid]);

  return { riwayat, loading, error };
};
