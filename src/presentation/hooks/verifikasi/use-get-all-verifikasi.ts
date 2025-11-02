import { VerifikasiRepositoryImpl } from "@/src/data/repositories/verifikasi-repository-impl";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import { useEffect, useState } from "react";

const useGetAllVerifikasi = () => {
  const [verifikasiList, setVerifikasiList] = useState<DaftarVerifikasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const repo: IVerifikasiRepository = new VerifikasiRepositoryImpl();

    const unsubscribe = repo.getAllVerifikasi((list) => {
      setVerifikasiList(list);
      setLoading(false);
    });

    if (!unsubscribe) {
      setError("Gagal memuat data verifikasi");
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    verifikasiList,
    loading,
    error,
  };
};

export default useGetAllVerifikasi;
