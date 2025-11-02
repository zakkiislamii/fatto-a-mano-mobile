import { VerifikasiRepositoryImpl } from "@/src/data/repositories/verifikasi-repository-impl";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import { DetailVerifikasi } from "@/src/domain/models/detail-verifikasi";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import { useCallback, useEffect, useRef, useState } from "react";

const useGetDetailVerifikasi = () => {
  const [detail, setDetail] = useState<DetailVerifikasi | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailSheetVisible, setDetailSheetVisible] = useState(false);
  const [selectedVerifikasi, setSelectedVerifikasi] =
    useState<DaftarVerifikasi | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const fetchDetail = useCallback((uid: string, pengajuanId: string) => {
    if (!uid || !pengajuanId) {
      setLoading(false);
      setError("UID atau Pengajuan ID tidak tersedia");
      return;
    }

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

  const clearDetail = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setDetail(null);
    setError(null);
    setLoading(false);
  }, []);

  const handleDetailClick = useCallback(
    (item: DaftarVerifikasi) => {
      setSelectedVerifikasi(item);
      fetchDetail(item.uid, item.id);
      setDetailSheetVisible(true);
    },
    [fetchDetail]
  );

  const handleCloseDetailSheet = useCallback(() => {
    setDetailSheetVisible(false);
    clearDetail();
    setSelectedVerifikasi(null);
  }, [clearDetail]);

  return {
    detail,
    loading,
    error,
    isDetailSheetVisible,
    selectedVerifikasi,
    fetchDetail,
    clearDetail,
    handleDetailClick,
    handleCloseDetailSheet,
  };
};

export default useGetDetailVerifikasi;
