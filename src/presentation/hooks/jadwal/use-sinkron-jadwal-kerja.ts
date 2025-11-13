import { NotifikasiServiceImpl } from "@/src/data/data-sources/notifikasi-service-impl";
import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { INotifikasiService } from "@/src/domain/services/i-notifikasi-service";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useSinkronJadwalKerja = () => {
  const [loading, setLoading] = useState(false);

  const handleSinkronJadwal = async () => {
    setLoading(true);
    try {
      const sheetyService: ISheetyService = new SheetyServiceImpl();
      const jadwalRepo: IJadwalRepository = new JadwalRepositoryImpl();
      const notifikasiService: INotifikasiService = new NotifikasiServiceImpl();
      const freshData = await sheetyService.getRows();

      if (!freshData || freshData.length === 0) {
        Toast.show({
          type: "info",
          text1: "Tidak Ada Data",
          text2: "Tidak ada data jadwal untuk disinkronkan",
        });
        return;
      }

      // 2. Transform data
      const sinkronData = freshData
        .filter((row) => row.id !== undefined && row.uid)
        .map((row) => ({
          uid: row.uid,
          jadwal: {
            jam_masuk: row.jamMasuk || "",
            jam_keluar: row.jamKeluar || "",
            hari_kerja: row.hariKerja || "",
            is_wfa: row.isWfa || false,
          },
          sheetyId: row.id as number,
          nama: row.nama,
          divisi: row.divisi,
          email: row.email,
        }));

      if (sinkronData.length === 0) {
        Toast.show({
          type: "info",
          text1: "Tidak Ada Data",
          text2: "Tidak ada data jadwal untuk disinkronkan",
        });
        return;
      }

      await jadwalRepo.sinkronJadwal(sinkronData);
      let notifStatus = "";
      try {
        await notifikasiService.SendToAll();
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
        text2: `${sinkronData.length} jadwal telah disinkronkan${notifStatus}`,
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
