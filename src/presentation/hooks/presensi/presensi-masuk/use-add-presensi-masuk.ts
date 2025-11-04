import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { PresensiMasuk } from "@/src/domain/models/presensi-masuk";
import { IPresensiRepository } from "@/src/domain/repositories/i-presensi-repository";
import useLocation from "@/src/presentation/hooks/location/use-location";
import useWifi from "@/src/presentation/hooks/wifi/use-wifi";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useAddPresensiMasuk = () => {
  const { isLocationValid } = useLocation();
  const { isWifiValid } = useWifi();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePresensiMasuk = async (
    uid: string,
    jadwalKaryawan: JadwalKaryawan | null
  ): Promise<boolean> => {
    const isWfa = !!jadwalKaryawan?.is_wfa;

    // Validasi jadwal
    if (!jadwalKaryawan) {
      Toast.show({ text1: "Jadwal tidak tersedia" });
      return false;
    }

    // Validasi WFO
    if (!isWfa) {
      if (!isLocationValid) {
        Toast.show({ text1: "Lokasi tidak valid" });
        return false;
      }
      if (!isWifiValid) {
        Toast.show({ text1: "WiFi tidak valid" });
        return false;
      }
    }

    // Validasi hari kerja
    const today = new Date();
    const todayIdx = today.getDay();
    const workingDays = expandHariKerja(jadwalKaryawan.hari_kerja);

    if (!workingDays.includes(todayIdx)) {
      Toast.show({ text1: "Bukan hari kerja" });
      return false;
    }

    //  Format jam masuk & keluar
    const jamMasukDate = parseJamToDateToday(jadwalKaryawan.jam_masuk, today);
    if (!jamMasukDate) {
      Toast.show({ type: "error", text1: "Format jam masuk tidak valid." });
      return false;
    }
    // Hitung batas waktu
    const batasAwal = new Date(jamMasukDate.getTime() - 15 * 60 * 1000);
    const batasTerlambat = new Date(jamMasukDate.getTime() + 5 * 60 * 1000);
    const now = new Date();

    // VALIDASI waktu presensi
    let status: StatusPresensi;
    let terlambat: boolean;
    let durasi_terlambat: string | undefined;

    if (now < batasAwal) {
      // Terlalu awal
      Toast.show({
        type: "error",
        text1: "Presensi terlalu awal!",
        text2: "Coba lagi 15 menit sebelum jam masuk.",
      });
      return false;
    } else if (now > batasTerlambat) {
      // Terlambat
      status = StatusPresensi.terlambat;
      terlambat = true;
      const diffMs = now.getTime() - jamMasukDate.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      durasi_terlambat = `${diffMin} menit`;
    } else {
      // Tepat waktu
      status = StatusPresensi.hadir;
      terlambat = false;
    }

    const waktu = now.toTimeString().slice(0, 5);
    const presensiMasuk: PresensiMasuk = {
      waktu,
      terlambat,
      ...(durasi_terlambat ? { durasi_terlambat } : {}),
    };

    const tanggal = Today();

    // Save
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
        text1: "Gagal presensi. Silakan coba lagi.",
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
