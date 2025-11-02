import { VerifikasiRepositoryImpl } from "@/src/data/repositories/verifikasi-repository-impl";
import { DetailVerifikasi } from "@/src/domain/models/detail-verifikasi";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useDetailVerifikasi = () => {
  const [detail, setDetail] = useState<DetailVerifikasi | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Function to fetch detail by uid and pengajuanId
  const fetchDetail = useCallback((uid: string, pengajuanId: string) => {
    if (!uid || !pengajuanId) {
      setLoading(false);
      setError("UID atau Pengajuan ID tidak tersedia");
      return;
    }

    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);
    setError(null);
    setDetail(null);

    const repo: IVerifikasiRepository = new VerifikasiRepositoryImpl();

    const unsubscribe = repo.getDetailKaryawan(uid, pengajuanId, (data) => {
      if (data) {
        setDetail(data);
        setError(null);
      } else {
        setDetail(null);
        setError("Data tidak ditemukan");
      }
      setLoading(false);
    });

    if (!unsubscribe) {
      setError("Gagal memuat detail verifikasi");
      setLoading(false);
    } else {
      unsubscribeRef.current = unsubscribe;
    }
  }, []);

  // Function to clear data
  const clearDetail = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setDetail(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    detail,
    loading,
    error,
    fetchDetail,
    clearDetail,
  };
};

export default useDetailVerifikasi;
