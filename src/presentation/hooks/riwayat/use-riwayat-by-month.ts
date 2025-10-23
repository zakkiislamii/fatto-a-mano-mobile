import { Presensi } from "@/src/domain/models/presensi";
import { RiwayatRepository } from "@/src/domain/repositories/riwayat/riwayat-repository";
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

    const repository = new RiwayatRepository(uid);
    const year = month.getFullYear();
    const monthNum = month.getMonth();

    const unsubscribe = repository.getAllPresensiByMonth(
      year,
      monthNum,
      (data) => {
        setRiwayat(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [uid, month.getFullYear(), month.getMonth()]);

  return { riwayat, loading, error };
};
