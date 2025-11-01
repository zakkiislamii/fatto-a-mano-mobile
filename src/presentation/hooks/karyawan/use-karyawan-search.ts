import { Karyawan } from "@/src/common/types/karyawan";
import { useMemo, useState } from "react";

export const useKaryawanSearch = (karyawanList: Karyawan[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredKaryawan = useMemo(() => {
    if (!searchQuery.trim()) {
      return karyawanList;
    }

    const query = searchQuery.toLowerCase().trim();

    const filtered = karyawanList.filter((karyawan) => {
      const nama = karyawan.nama?.toLowerCase() || "";
      const email = karyawan.email?.toLowerCase() || "";

      return nama.includes(query) || email.includes(query);
    });

    return filtered;
  }, [karyawanList, searchQuery]);

  const clearSearch = () => setSearchQuery("");

  return {
    searchQuery,
    setSearchQuery,
    filteredKaryawan,
    clearSearch,
    isSearching: searchQuery.trim().length > 0,
  };
};
