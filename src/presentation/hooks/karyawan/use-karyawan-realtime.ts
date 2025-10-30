import { Karyawan } from "@/src/common/types/karyawan";
import { KaryawanRepositoryImpl } from "@/src/data/repositories/karyawan/karyawan-repository-impl";
import { IKaryawanRepository } from "@/src/domain/repositories/karyawan/i-karyawan-repository";
import usePagination from "@/src/hooks/use-pagination";
import { useEffect, useMemo, useState } from "react";

export const useKaryawanRealTime = () => {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time listener
  useEffect(() => {
    const repo: IKaryawanRepository = new KaryawanRepositoryImpl();
    const unsub = repo.getAllKaryawanRealTime((data) => {
      if (data) {
        setKaryawanList(data);
      } else {
        setKaryawanList([]);
      }
      setLoading(false);
    });

    return () => {
      unsub?.();
    };
  }, []);

  // Filter data based on search query
  const filteredKaryawan = useMemo(() => {
    if (!searchQuery.trim()) {
      return karyawanList;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = karyawanList.filter((karyawan) => {
      const nama = karyawan.nama?.toLowerCase() || "";
      const email = karyawan.email?.toLowerCase() || "";
      const nik = karyawan.nik?.toLowerCase() || "";

      const match =
        nama.includes(query) || email.includes(query) || nik.includes(query);

      return match;
    });
    return filtered;
  }, [karyawanList, searchQuery]);

  // Pagination
  const pagination = usePagination<Karyawan>({
    data: filteredKaryawan,
    itemsPerPage: 10,
  });

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return {
    loading,
    searchQuery,
    handleSearchChange,
    handleClearSearch,
    isSearching: searchQuery.trim().length > 0,
    ...pagination,
  };
};
