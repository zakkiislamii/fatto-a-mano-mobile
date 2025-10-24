import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { PengajuanSakitRepository } from "@/src/domain/repositories/pengajuan/pengajuan-sakit-repository";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { Unsubscribe } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const useDaftarPengajuan = () => {
  const { uid } = useFirebaseAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [pengajuanList, setPengajuanList] = useState<DaftarPengajuan[]>([]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo = new PengajuanSakitRepository(uid, "");

    const unsubscribe: Unsubscribe = repo.getDaftar((list) => {
      const sortedList = list.sort(
        (a, b) => b.updated_at.toMillis() - a.updated_at.toMillis()
      );
      setPengajuanList(sortedList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [uid]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!uid) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "User tidak ditemukan.",
        });
        return;
      }
      try {
        const repo = new PengajuanSakitRepository(uid, "");
        repo.setId(id);
        await repo.hapus();
        Toast.show({ type: "success", text1: "Pengajuan Berhasil Dihapus" });
      } catch (error) {
        console.error("Error deleting pengajuan:", error);
        Toast.show({
          type: "error",
          text1: "Gagal Menghapus",
          text2: "Silakan coba lagi.",
        });
      }
    },
    [uid]
  );

  const handleEdit = useCallback((item: DaftarPengajuan) => {
    console.log("Edit item:", item.id);
    Toast.show({ type: "info", text1: "Fitur Edit Belum Tersedia" });
  }, []);

  return { loading, pengajuanList, handleDelete, handleEdit };
};

export default useDaftarPengajuan;
