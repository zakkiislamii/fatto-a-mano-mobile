import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import useLiveLocation from "@/src/presentation/features/maps/hooks/use-live-location";
import useWifi from "@/src/presentation/features/wifi/hooks/use-wifi";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import { useState } from "react";
import Toast from "react-native-toast-message";

const useAddPresensiKeluar = (uid: string) => {
  const { canCheck = false } = useLiveLocation();
  const {
    isWifiConnected = false,
    isBssid = false,
    isOnline = false,
    wifiLoading = true,
    networkLoading = true,
  } = useWifi();

  const [loading, setLoading] = useState<boolean>(false);
  const { jadwalKaryawan } = useGetJadwal(uid);
  const jadwalReady = !!jadwalKaryawan;
  const isWfh = !!jadwalKaryawan?.isWfh;

  const handlePresensiKeluar = async (): Promise<boolean> => {
    // jika jadwal belum siap, beri feedback
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
      });
      return false;
    }

    // Validasi konektivitas/ lokasi berdasarkan mode (WFH / WFO)
    if (isWfh) {
      // WFH: butuh koneksi internet (bisa wifi atau seluler)
      if (!isOnline) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi: tidak ada koneksi internet.",
        });
        return false;
      }
    } else {
      // WFO: butuh lokasi valid, Wi-Fi terhubung, dan BSSID valid
      if (!canCheck) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Lokasi tidak valid atau Anda berada di luar area kantor",
        });
        return false;
      }
      if (!isWifiConnected) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Tidak terhubung ke jaringan Wi-Fi",
        });
        return false;
      }
      if (!isBssid) {
        Toast.show({
          type: "error",
          text1: "Wi-Fi tidak terdaftar",
          text2: "Silakan sambungkan ke jaringan kantor",
        });
        return false;
      }
    }

    const today = new Date();
    const todayIdx = today.getDay();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }
    const keluarLebihAwal = new Date(jamKeluarDate.getTime());
    const now = new Date();
    if (now < keluarLebihAwal) {
    }
  };

  return {
    handlePresensiKeluar,
    loading,
  };
};
