import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { SheetyServiceImpl } from "@/src/data/data-sources/sheety-service-impl";
import { JadwalRepositoryImpl } from "@/src/data/repositories/jadwal-repository-impl";
import { IJadwalRepository } from "@/src/domain/repositories/i-jadwal-repository";
import { ISheetyService } from "@/src/domain/services/i-sheety-service";
import { useSendToAll } from "@/src/hooks/use-notifikasi";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useSinkronJadwalKerja = () => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: sendNotifToAll } = useSendToAll();

  const handleSinkronJadwal = async () => {
    setLoading(true);
    try {
      const sheetyService: ISheetyService = new SheetyServiceImpl();
      const freshData = await sheetyService.getRows();

      if (!freshData || freshData.length === 0) {
        Toast.show({
          type: "info",
          text1: "Tidak Ada Data",
          text2: "Tidak ada data jadwal untuk disinkronkan",
        });
        return;
      }

      console.log(
        `[useSinkronJadwalKerja] Memulai sinkronisasi ${freshData.length} jadwal...`
      );

      const sinkronRepo: IJadwalRepository = new JadwalRepositoryImpl();

      const sinkronData = freshData
        .filter((row) => row.id !== undefined)
        .map((row) => ({
          uid: row.uid,
          jadwal: {
            jam_masuk: row.jamMasuk,
            jam_keluar: row.jamKeluar,
            hari_kerja: row.hariKerja,
            is_wfa: row.isWfa,
          } as JadwalKaryawan,
          excelId: row.id as number,
        }));

      // Sinkron ke Firestore
      await sinkronRepo.sinkronJadwal(sinkronData);

      // Kirim notifikasi ke semua karyawan
      let notifStatus = "";
      try {
        await sendNotifToAll();
        notifStatus = " & notifikasi terkirim";
        console.log("[useSinkronJadwalKerja] Notifikasi berhasil dikirim");
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

      console.log("[useSinkronJadwalKerja] Sinkronisasi selesai");
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
