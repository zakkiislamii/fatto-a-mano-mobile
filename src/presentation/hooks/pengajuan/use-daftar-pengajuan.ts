import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { Unsubscribe } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

const useDaftarPengajuan = () => {
  const { uid } = useFirebaseAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [pengajuanList, setPengajuanList] = useState<DaftarPengajuan[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const repo: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsubscribe: Unsubscribe | null = repo.getDaftar(uid, (list) => {
      const sortedList = list.sort(
        (a, b) => b.updated_at.toMillis() - a.updated_at.toMillis()
      );
      setPengajuanList(sortedList);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
      if (!id) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "ID pengajuan tidak valid.",
        });
        return;
      }

      try {
        setDeleting(true);
        const repo: IPengajuanRepository = new PengajuanRepositoryImpl();
        await repo.hapus(uid, id);
        Toast.show({ type: "success", text1: "Pengajuan Berhasil Dihapus" });
        if (selectedToDelete === id) {
          setSelectedToDelete(null);
          setConfirmVisible(false);
        }
      } catch (error) {
        console.error("Error deleting pengajuan:", error);
        Toast.show({
          type: "error",
          text1: "Gagal Menghapus",
          text2: "Silakan coba lagi.",
        });
      } finally {
        setDeleting(false);
      }
    },
    [uid, selectedToDelete]
  );

  const requestDelete = useCallback((id: string) => {
    setSelectedToDelete(id);
    setConfirmVisible(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedToDelete) {
      setConfirmVisible(false);
      return;
    }
    await handleDelete(selectedToDelete);
    setConfirmVisible(false);
    setSelectedToDelete(null);
  }, [selectedToDelete, handleDelete]);

  const cancelDelete = useCallback(() => {
    setConfirmVisible(false);
    setSelectedToDelete(null);
  }, []);

  return {
    loading,
    pengajuanList,
    confirmVisible,
    requestDelete,
    confirmDelete,
    cancelDelete,
    deleting,
  };
};

export default useDaftarPengajuan;
