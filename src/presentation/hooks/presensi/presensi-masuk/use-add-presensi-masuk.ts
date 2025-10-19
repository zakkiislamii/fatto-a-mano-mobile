import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiRepository } from "@/src/domain/repositories/presensi-repository";
import useLiveLocation from "@/src/presentation/features/maps/hooks/use-live-location";
import useWifi from "@/src/presentation/features/wifi/hooks/use-wifi";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import { useGetJadwal } from "../../jadwal/use-get-jadwal";

const useAddPresensiMasuk = (uid: string) => {
  const { canCheck = false } = useLiveLocation();
  const {
    isWifiConnected = false,
    isBssid = false,
    isOnline = false,
    wifiLoading = true,
    networkLoading = true,
  } = useWifi();

  const [loading, setLoading] = useState<boolean>(false);
  const [isAlpa, setIsAlpa] = useState<boolean>(false);
  const { jadwalKaryawan } = useGetJadwal(uid);
  const jadwalReady = !!jadwalKaryawan;
  const isWfh = !!jadwalKaryawan?.isWfh;

  // cek status alpa secara real-time
  useEffect(() => {
    if (!jadwalKaryawan) {
      setIsAlpa(false);
      return;
    }

    const today = new Date();
    const workingDays = expandHariKerja(jadwalKaryawan.hariKerja);
    const todayIdx = today.getDay();

    // Jika hari ini bukan hari kerja, tidak alpa
    if (!workingDays.includes(todayIdx)) {
      setIsAlpa(false);
      return;
    }

    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) {
      setIsAlpa(false);
      return;
    }

    const now = new Date();

    // Jika sekarang > jam_keluar, maka ALPA
    if (now > jamKeluarDate) {
      setIsAlpa(true);
      Toast.show({
        type: "error",
        text1: "Status: ALPA",
        text2:
          "Waktu presensi masuk telah terlewat. Hubungi HRD untuk pengurusan lebih lanjut.",
      });
      return;
    }

    setIsAlpa(false);
  }, [jadwalKaryawan]);

  const handlePresensiMasuk = async (): Promise<boolean> => {
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

    // cek hari kerja
    const today = new Date();
    const todayIdx = today.getDay();
    const workingDays = expandHariKerja(jadwalKaryawan.hariKerja);
    if (!workingDays.includes(todayIdx)) {
      Toast.show({
        type: "error",
        text1: "Hari ini bukan hari kerja.",
      });
      return false;
    }

    // parse jam_masuk
    const jamMasukDate = parseJamToDateToday(jadwalKaryawan.jam_masuk, today);
    if (!jamMasukDate) {
      Toast.show({ type: "error", text1: "Format jam masuk tidak valid." });
      return false;
    }

    // parse jam_keluar
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }

    // hitung batas waktu
    const batasAwal = new Date(jamMasukDate.getTime() - 15 * 60 * 1000); // jam_masuk - 15 menit
    const batasTerlambat = new Date(jamMasukDate.getTime() + 5 * 60 * 1000); // jam_masuk + 5 menit

    const now = new Date();

    if (now < batasAwal) {
      Toast.show({
        type: "error",
        text1: "Terlalu awal untuk melakukan presensi masuk.",
        text2: "Coba lagi ketika 15 menit sebelum jam masuk!",
      });
      return false;
    }

    // tentukan status dan waktu
    let status = StatusPresensi.hadir;
    let waktu = now.toTimeString().slice(0, 5); // "HH:MM"
    let terlambat = false;
    let durasi_terlambat: string | undefined = undefined;

    // cek alpa: now > jam_keluar
    if (now > jamKeluarDate) {
      status = StatusPresensi.alpa;
      waktu = "";
      terlambat = true;
    } else if (now > batasTerlambat) {
      // cek terlambat: now > jam_masuk + 5 menit
      status = StatusPresensi.terlambat;
      terlambat = true;
      const diffMs = now.getTime() - jamMasukDate.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      durasi_terlambat = `${diffMin} menit`;
    }

    // presensi_masuk payload
    const presensiMasuk: PresensiMasuk = {
      waktu,
      terlambat,
      ...(durasi_terlambat ? { durasi_terlambat } : {}),
    };

    // tanggal untuk id: gunakan YYYY-MM-DD
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const tanggal = `${yyyy}-${mm}-${dd}`;

    setLoading(true);
    try {
      const presensiRepo = new PresensiRepository(uid, tanggal, status);
      presensiRepo.setPresensiMasuk(presensiMasuk);
      await presensiRepo.addPresensiMasuk();
      Toast.show({
        type: "success",
        text1: "Berhasil presensi masuk.",
      });
      return true;
    } catch (err) {
      console.error("addPresensiMasuk error:", err);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi. Silakan coba lagi.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled: boolean = Boolean(
    loading ||
      !jadwalReady ||
      isAlpa ||
      (isWfh
        ? networkLoading || !isOnline
        : wifiLoading || !isWifiConnected || !isBssid || !canCheck)
  );

  return {
    handlePresensiMasuk,
    loading,
    isButtonDisabled,
  };
};

export default useAddPresensiMasuk;
