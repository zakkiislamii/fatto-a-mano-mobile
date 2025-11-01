import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { IPresensiRepository } from "@/src/domain/repositories/i-presensi-repository";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import useLocation from "@/src/presentation/hooks/location/use-location";
import useWifi from "@/src/presentation/hooks/wifi/use-wifi";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useAddPresensiMasuk = (uid: string) => {
  const { isLocationValid } = useLocation();
  const { isWifiValid } = useWifi();
  const [loading, setLoading] = useState<boolean>(false);
  const { jadwalKaryawan } = useGetJadwal(uid);
  const isWfh = !!jadwalKaryawan?.is_wfh;

  const handlePresensiMasuk = async (): Promise<boolean> => {
    // VALIDASI 1: Jadwal harus tersedia
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
      });
      return false;
    }

    // VALIDASI 2: Koneksi (WFH vs Office)
    if (!isWfh) {
      // Office: butuh lokasi + WiFi
      if (!isLocationValid) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Lokasi tidak valid atau Anda berada di luar area kantor",
        });
        return false;
      }
      if (!isWifiValid) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Silakan sambungkan ke jaringan Wi-Fi kantor",
        });
        return false;
      }
    }

    // VALIDASI 3: Hari kerja
    const today = new Date();
    const todayIdx = today.getDay();
    const workingDays = expandHariKerja(jadwalKaryawan.hari_kerja);

    if (!workingDays.includes(todayIdx)) {
      Toast.show({
        type: "error",
        text1: "Hari ini bukan hari kerja.",
      });
      return false;
    }

    // VALIDASI 4: Format jam masuk & keluar
    const jamMasukDate = parseJamToDateToday(jadwalKaryawan.jam_masuk, today);
    if (!jamMasukDate) {
      Toast.show({ type: "error", text1: "Format jam masuk tidak valid." });
      return false;
    }

    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }

    // VALIDASI 5: Waktu presensi (tidak terlalu awal)
    const batasAwal = new Date(jamMasukDate.getTime() - 15 * 60 * 1000);
    const batasTerlambat = new Date(jamMasukDate.getTime() + 5 * 60 * 1000);
    const now = new Date();

    if (now < batasAwal) {
      Toast.show({
        type: "error",
        text1: "Presensi terlalu awal!",
        text2: "Coba lagi 15 menit sebelum jam masuk.",
      });
      return false;
    }

    // DETERMINE STATUS & WAKTU
    let status = StatusPresensi.hadir;
    let waktu = now.toTimeString().slice(0, 5);
    let terlambat = false;
    let durasi_terlambat: string | undefined = undefined;

    if (now > batasTerlambat) {
      // Lewat batas toleransi = TERLAMBAT
      status = StatusPresensi.terlambat;
      terlambat = true;
      const diffMs = now.getTime() - jamMasukDate.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      durasi_terlambat = `${diffMin} menit`;
    }

    const presensiMasuk: PresensiMasuk = {
      waktu,
      terlambat,
      ...(durasi_terlambat ? { durasi_terlambat } : {}),
    };

    const tanggal = Today();

    // SAVE TO FIRESTORE
    setLoading(true);
    try {
      const presensiRepo: IPresensiRepository = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(uid, tanggal, status, presensiMasuk);

      Toast.show({
        type: "success",
        text1: "Presensi masuk berhasil",
      });

      return true;
    } catch (err) {
      console.error("[useAddPresensiMasuk] error:", err);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi. Silakan coba lagi.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handlePresensiMasuk,
    loading,
  };
};

export default useAddPresensiMasuk;
