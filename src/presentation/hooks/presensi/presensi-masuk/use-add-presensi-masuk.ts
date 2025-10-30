import { StatusPresensi } from "@/src/common/enums/status-presensi";
import { PresensiMasuk } from "@/src/common/types/presensi-masuk";
import { expandHariKerja } from "@/src/common/utils/expand-hari-kerja";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import useLiveLocation from "@/src/presentation/hooks/maps/use-live-location";
import useGetStatusIzinAktif from "@/src/presentation/hooks/pengajuan/status-aktif/use-get-status-izin-aktif";
import useGetStatusSakitAktif from "@/src/presentation/hooks/pengajuan/status-aktif/use-get-status-sakit-aktif";
import useWifi from "@/src/presentation/hooks/wifi/use-wifi";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const createAutoAlpa = useCallback(async () => {
    if (hasCreatedAlpaRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: true,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.alpa,
        presensiMasuk
      );

      hasCreatedAlpaRecordRef.current = true;
    } catch (err) {
      console.error("createAutoAlpa error:", err);
    }
  }, [uid]);

  // record IZIN otomatis
  const createAutoIzin = useCallback(async () => {
    if (hasCreatedIzinRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.izin,
        presensiMasuk
      );

      hasCreatedIzinRecordRef.current = true;
    } catch (err) {
      console.error("createAutoIzin error:", err);
    }
  }, [uid]);

  // record SAKIT otomatis
  const createAutoSakit = useCallback(async () => {
    if (hasCreatedSakitRecordRef.current) return;

    try {
      const presensiMasuk: PresensiMasuk = {
        waktu: "",
        terlambat: false,
      };

      const tanggal = Today();
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(
        uid,
        tanggal,
        StatusPresensi.sakit,
        presensiMasuk
      );

      hasCreatedSakitRecordRef.current = true;
    } catch (err) {
      console.error("createAutoSakit error:", err);
    }
  }, [uid]);

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
    createAutoIzin,
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
    createAutoSakit,
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
    createAutoAlpa,
  ]);

  const handlePresensiMasuk = async (): Promise<boolean> => {
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
      });
      return false;
    }

    if (isIzinAktif) {
      Toast.show({
        type: "info",
        text1: "Anda sedang dalam periode izin.",
        text2: "Tidak perlu melakukan presensi manual.",
      });
      return false;
    }

    if (isSakitAktif) {
      Toast.show({
        type: "info",
        text1: "Anda sedang dalam kondisi sakit.",
        text2: "Tidak perlu melakukan presensi manual.",
      });
      return false;
    }

    if (isWfh) {
      if (!isOnline) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi: tidak ada koneksi internet.",
        });
        return false;
      }
    } else {
      if (!canCheck) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Lokasi tidak valid atau Anda berada di luar area kantor",
        });
        return false;
      }
      if (!isWifiConnected && !isBssid) {
        Toast.show({
          type: "error",
          text1: "Tidak dapat presensi",
          text2: "Silakan sambungkan ke jaringan Wi-Fi kantor",
        });
        return false;
      }
    }

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

    let status = StatusPresensi.hadir;
    let waktu = now.toTimeString().slice(0, 5);
    let terlambat = false;
    let durasi_terlambat: string | undefined = undefined;

    if (now > jamKeluarDate) {
      status = StatusPresensi.alpa;
      waktu = "";
      terlambat = true;
    } else if (now > batasTerlambat) {
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
      const presensiRepo = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiMasuk(uid, tanggal, status, presensiMasuk);

      Toast.show({
        type: "success",
        text1: "Presensi masuk berhasil",
      });

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
      isIzinAktif ||
      isSakitAktif ||
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
