import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { VerifikasiRepositoryImpl } from "@/src/data/repositories/verifikasi-repository-impl";
import { IVerifikasiRepository } from "@/src/domain/repositories/i-verifikasi-repository";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useVerifikasiPengajuan = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifikasi = async (
    uid: string,
    pengajuanId: string,
    status: StatusPengajuan.disetujui | StatusPengajuan.ditolak
  ) => {
    setLoading(true);
    try {
      if (!uid || !pengajuanId) {
        throw new Error("UID atau Pengajuan ID tidak valid");
      }

      const repo: IVerifikasiRepository = new VerifikasiRepositoryImpl();
      await repo.verifikasiPengajuan(uid, pengajuanId, status);

      const statusText =
        status === StatusPengajuan.disetujui ? "disetujui" : "ditolak";

      Toast.show({
        type: "success",
        text1: "Verifikasi Berhasil",
        text2: `Pengajuan telah ${statusText}`,
      });

      console.log(`[useVerifikasiPengajuan] Pengajuan berhasil ${statusText}`);
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
  };

  const setujuiPengajuan = async (uid: string, pengajuanId: string) => {
    await handleVerifikasi(uid, pengajuanId, StatusPengajuan.disetujui);
  };

  const tolakPengajuan = async (uid: string, pengajuanId: string) => {
    await handleVerifikasi(uid, pengajuanId, StatusPengajuan.ditolak);
  };

  return {
    handleVerifikasi,
    setujuiPengajuan,
    tolakPengajuan,
    loading,
  };
};

export default useVerifikasiPengajuan;
