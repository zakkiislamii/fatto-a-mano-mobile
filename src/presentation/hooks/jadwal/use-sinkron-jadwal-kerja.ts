import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { useSendToAll } from "@/src/hooks/use-notifikasi";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useSinkronJadwalKerja = () => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: sendNotifToAll } = useSendToAll();

  const handleSinkronJadwal = async () => {
    setLoading(true);
    try {
      const jadwalRepo: IJadwalRepository = new JadwalRepositoryImpl();
      const jumlahDataDisinkron = await jadwalRepo.sinkronJadwalFromSheets();

      // Validasi jika tidak ada data
      if (jumlahDataDisinkron === 0) {
        Toast.show({
          type: "info",
          text1: "Tidak Ada Data",
          text2: "Tidak ada data jadwal untuk disinkronkan",
        });
        return;
      }

      // Kirim notifikasi ke semua karyawan
      let notifStatus = "";
      try {
        await sendNotifToAll();
        notifStatus = " & notifikasi terkirim";
      } catch (notifError) {
        console.error(
          "[useSinkronJadwalKerja] Gagal kirim notifikasi:",
          notifError
        );
        notifStatus = " (notifikasi gagal)";
      }

      Toast.show({
        type: "success",
        text1: "Sinkronisasi Berhasil",
        text2: `${jumlahDataDisinkron} jadwal telah disinkronkan${notifStatus}`,
      });
    } catch (error) {
      console.error("[useSinkronJadwalKerja] Sinkronisasi gagal:", error);
      Toast.show({
        type: "error",
        text1: "Sinkronisasi Gagal",
        text2: "Terjadi kesalahan saat sinkronisasi jadwal",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSinkronJadwal,
    loading,
  };
};

export default useSinkronJadwalKerja;
