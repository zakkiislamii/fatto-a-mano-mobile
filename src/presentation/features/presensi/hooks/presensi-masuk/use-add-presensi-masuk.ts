import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiMasukRepository } from "@/src/domain/repositories/presensi/presensi-masuk-repository";
import useLiveLocation from "@/src/presentation/features/maps/hooks/use-live-location";
import useWifi from "@/src/presentation/features/wifi/hooks/use-wifi";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import useGetStatusIzinAktif from "@/src/presentation/hooks/pengajuan/status-aktif/use-get-status-izin-aktif";
import useGetStatusSakitAktif from "@/src/presentation/hooks/pengajuan/status-aktif/use-get-status-sakit-aktif";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import useGetStatusPresensiMasukToday from "./use-get-status-presensi-masuk-today";

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
  const isWfh = !!jadwalKaryawan?.is_wfh;
  const { presensiMasukStatus, loading: presensiMasukStatusLoading } =
    useGetStatusPresensiMasukToday(uid);

  const { isIzinAktif, loading: izinLoading } = useGetStatusIzinAktif(uid);
  const { isSakitAktif, loading: sakitLoading } = useGetStatusSakitAktif(uid);
  const hasShownAlpaToastRef = useRef<boolean>(false);
  const hasCreatedAlpaRecordRef = useRef<boolean>(false);
  const hasShownIzinToastRef = useRef<boolean>(false);
  const hasCreatedIzinRecordRef = useRef<boolean>(false);
  const hasShownSakitToastRef = useRef<boolean>(false);
  const hasCreatedSakitRecordRef = useRef<boolean>(false);

  // record ALPA otomatis
  const createAutoAlpa = async () => {
    if (hasCreatedAlpaRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: true,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiMasukRepository(uid, tanggal);
      presensiRepo.setStatus(StatusPresensi.alpa);
      presensiRepo.setPresensiMasuk(presensiMasuk);
      await presensiRepo.add();

      hasCreatedAlpaRecordRef.current = true;
    } catch (err) {
      console.error("createAutoAlpa error:", err);
    }
  };

  // record IZIN otomatis
  const createAutoIzin = async () => {
    if (hasCreatedIzinRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiMasukRepository(uid, tanggal);
      presensiRepo.setStatus(StatusPresensi.izin);
      presensiRepo.setPresensiMasuk(presensiMasuk);
      await presensiRepo.add();

      hasCreatedIzinRecordRef.current = true;
    } catch (err) {
      console.error("createAutoIzin error:", err);
    }
  };

  // record SAKIT otomatis
  const createAutoSakit = async () => {
    if (hasCreatedSakitRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiMasukRepository(uid, tanggal);
      presensiRepo.setStatus(StatusPresensi.sakit);
      presensiRepo.setPresensiMasuk(presensiMasuk);
      await presensiRepo.add();

      hasCreatedSakitRecordRef.current = true;
    } catch (err) {
      console.error("createAutoSakit error:", err);
    }
  };

  // handle IZIN otomatis
  useEffect(() => {
    if (izinLoading || presensiMasukStatusLoading) return;

    // Jika user sedang izin dan belum ada record presensi
    if (isIzinAktif && !presensiMasukStatus.sudah_masuk) {
      if (!hasShownIzinToastRef.current) {
        createAutoIzin();
        Toast.show({
          type: "info",
          text1: "Status: IZIN",
          text2: "Anda sedang dalam periode izin yang disetujui.",
        });
        hasShownIzinToastRef.current = true;
      }
      return;
    }

    // Reset flag jika tidak sedang izin
    if (!isIzinAktif) {
      hasShownIzinToastRef.current = false;
      hasCreatedIzinRecordRef.current = false;
    }
  }, [
    isIzinAktif,
    presensiMasukStatus.sudah_masuk,
    izinLoading,
    presensiMasukStatusLoading,
  ]);

  // handle SAKIT otomatis
  useEffect(() => {
    if (sakitLoading || presensiMasukStatusLoading) return;

    // Jika user sedang sakit dan belum ada record presensi
    if (isSakitAktif && !presensiMasukStatus.sudah_masuk) {
      if (!hasShownSakitToastRef.current) {
        createAutoSakit();
        Toast.show({
          type: "info",
          text1: "Status: SAKIT",
          text2: "Anda sedang dalam kondisi sakit yang disetujui.",
        });
        hasShownSakitToastRef.current = true;
      }
      return;
    }

    // Reset flag jika tidak sedang sakit
    if (!isSakitAktif) {
      hasShownSakitToastRef.current = false;
      hasCreatedSakitRecordRef.current = false;
    }
  }, [
    isSakitAktif,
    presensiMasukStatus.sudah_masuk,
    sakitLoading,
    presensiMasukStatusLoading,
  ]);

  // handle ALPA otomatis
  useEffect(() => {
    if (
      !jadwalKaryawan ||
      presensiMasukStatusLoading ||
      izinLoading ||
      sakitLoading
    ) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    // Jika sedang izin atau sakit, tidak perlu cek ALPA
    if (isIzinAktif || isSakitAktif) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const today = new Date();
    const workingDays = expandHariKerja(jadwalKaryawan.hari_kerja);
    const todayIdx = today.getDay();

    // jika hari ini bukan hari kerja -> bukan alpa
    if (!workingDays.includes(todayIdx)) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);

    if (!jamKeluarDate) {
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);
      return;
    }

    const now = new Date();

    // Jika sekarang > jam_keluar dan belum presensi -> ALPA
    if (now > jamKeluarDate && !presensiMasukStatus.sudah_masuk) {
      setIsAlpa(true);
      if (!hasShownAlpaToastRef.current) {
        createAutoAlpa();
        Toast.show({
          type: "error",
          text1: "Status: ALPA",
          text2:
            "Waktu presensi masuk telah terlewat. Hubungi HRD untuk pengurusan lebih lanjut.",
        });
        hasShownAlpaToastRef.current = true;
      }
      return;
    }
    hasShownAlpaToastRef.current = false;
    setIsAlpa(false);
  }, [
    jadwalKaryawan,
    presensiMasukStatus,
    presensiMasukStatusLoading,
    isIzinAktif,
    isSakitAktif,
    izinLoading,
    sakitLoading,
    uid,
  ]);

  const handlePresensiMasuk = async (): Promise<boolean> => {
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
      });
      return false;
    }

    // Cek apakah sedang izin
    if (isIzinAktif) {
      Toast.show({
        type: "info",
        text1: "Anda sedang dalam periode izin.",
        text2: "Tidak perlu melakukan presensi manual.",
      });
      return false;
    }

    // Cek apakah sedang sakit
    if (isSakitAktif) {
      Toast.show({
        type: "info",
        text1: "Anda sedang dalam kondisi sakit.",
        text2: "Tidak perlu melakukan presensi manual.",
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
    const workingDays = expandHariKerja(jadwalKaryawan.hari_kerja);
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

    // hitung batas waktu presensi
    const batasAwal = new Date(jamMasukDate.getTime() - 15 * 60 * 1000); // -15 menit
    const batasTerlambat = new Date(jamMasukDate.getTime() + 5 * 60 * 1000); // +5 menit
    const now = new Date();

    if (now < batasAwal) {
      Toast.show({
        type: "error",
        text1: "Presensi terlalu awal!",
        text2: "Coba lagi 15 menit sebelum jam masuk.",
      });
      return false;
    }

    // tentukan status & atribut presensi
    let status = StatusPresensi.hadir;
    let waktu = now.toTimeString().slice(0, 5);
    let terlambat = false;
    let durasi_terlambat: string | undefined = undefined;

    // cek alpa: jika sudah lewat jam keluar
    if (now > jamKeluarDate) {
      status = StatusPresensi.alpa;
      waktu = "";
      terlambat = true;
    } else if (now > batasTerlambat) {
      // terlambat: sekarang > jam_masuk + 5 menit
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

    setLoading(true);
    try {
      const presensiRepo = new PresensiMasukRepository(uid, tanggal);
      presensiRepo.setStatus(status);
      presensiRepo.setPresensiMasuk(presensiMasuk);
      await presensiRepo.add();

      Toast.show({
        type: "success",
        text1: "Berhasil presensi masuk.",
      });

      // Jika sukses, reset flag alpa
      hasShownAlpaToastRef.current = false;
      setIsAlpa(false);

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
      isIzinAktif || // Disable jika sedang izin
      isSakitAktif || // Disable jika sedang sakit
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
