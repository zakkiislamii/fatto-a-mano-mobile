// use-presensi-by-date.ts
import { Presensi } from "@/src/domain/models/presensi";
import { RiwayatRepository } from "@/src/domain/repositories/riwayat/riwayat-repository";
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

    const repository = new RiwayatRepository(uid);

    const unsubscribe = repository.getPresensiByDate(tanggal, (data) => {
      setPresensi(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [uid, tanggal]);

  return { presensi, loading, error };
};
