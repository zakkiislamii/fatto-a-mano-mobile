import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { VerifikasiRepositoryImpl } from "@/src/data/repositories/verifikasi-repository-impl";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";

const useVerifikasiPengajuan = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isKonfirmasiModalVisible, setKonfirmasiModalVisible] = useState(false);
  const [selectedVerifikasi, setSelectedVerifikasi] =
    useState<DaftarVerifikasi | null>(null);
  const [konfirmasiAksi, setKonfirmasiAksi] = useState<
    "setujui" | "tolak" | null
  >(null);

  const handleVerifikasi = useCallback(
    async (
      uid: string,
      pengajuanId: string,
      status: StatusPengajuan.DISETUJUI | StatusPengajuan.DITOLAK
    ) => {
      setLoading(true);
      try {
        if (!uid || !pengajuanId) {
          throw new Error("UID atau Pengajuan ID tidak valid");
        }

        const repo: IVerifikasiRepository = new VerifikasiRepositoryImpl();
        await repo.verifikasiPengajuan(uid, pengajuanId, status);

        const statusText =
          status === StatusPengajuan.DISETUJUI ? "disetujui" : "ditolak";

        Toast.show({
          type: "success",
          text1: "Verifikasi Berhasil",
          text2: `Pengajuan telah ${statusText}`,
        });
      } catch (error) {
        console.error("[useVerifikasiPengajuan] Error:", error);
        Toast.show({
          type: "error",
          text1: "Verifikasi Gagal",
          text2: "Terjadi kesalahan saat memverifikasi pengajuan",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setujuiPengajuan = useCallback(
    async (uid: string, pengajuanId: string) => {
      await handleVerifikasi(uid, pengajuanId, StatusPengajuan.DISETUJUI);
    },
    [handleVerifikasi]
  );

  const tolakPengajuan = useCallback(
    async (uid: string, pengajuanId: string) => {
      await handleVerifikasi(uid, pengajuanId, StatusPengajuan.DITOLAK);
    },
    [handleVerifikasi]
  );

  const handleTolakClick = useCallback((item: DaftarVerifikasi) => {
    setSelectedVerifikasi(item);
    setKonfirmasiAksi("tolak");
    setKonfirmasiModalVisible(true);
  }, []);

  const handleSetujuiClick = useCallback((item: DaftarVerifikasi) => {
    setSelectedVerifikasi(item);
    setKonfirmasiAksi("setujui");
    setKonfirmasiModalVisible(true);
  }, []);

  const handleCloseKonfirmasiModal = useCallback(() => {
    setKonfirmasiModalVisible(false);
  }, []);

  const handleKonfirmasiAksi = useCallback(async () => {
    if (!selectedVerifikasi || !konfirmasiAksi) return;

    const { uid, id } = selectedVerifikasi;

    try {
      if (konfirmasiAksi === "setujui") {
        await setujuiPengajuan(uid, id);
      } else if (konfirmasiAksi === "tolak") {
        await tolakPengajuan(uid, id);
      }
    } catch (error) {
      console.error("Gagal mengeksekusi aksi verifikasi:", error);
    } finally {
      setKonfirmasiModalVisible(false);
      setSelectedVerifikasi(null);
      setKonfirmasiAksi(null);
    }
  }, [selectedVerifikasi, konfirmasiAksi, setujuiPengajuan, tolakPengajuan]);

  return {
    loading,
    isKonfirmasiModalVisible,
    selectedVerifikasi,
    konfirmasiAksi,
    handleVerifikasi,
    setujuiPengajuan,
    tolakPengajuan,
    handleTolakClick,
    handleSetujuiClick,
    handleCloseKonfirmasiModal,
    handleKonfirmasiAksi,
  };
};

export default useVerifikasiPengajuan;
