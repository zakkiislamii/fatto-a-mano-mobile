import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PresensiKeluarRepository } from "@/src/domain/repositories/presensi/presensi-keluar-repository";
import useLiveLocation from "@/src/presentation/features/maps/hooks/use-live-location";
import useWifi from "@/src/presentation/features/wifi/hooks/use-wifi";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import useAddPresensiKeluarLebihAwal from "./use-add-presensi-keluar-lebih-awal";
import useAddPresensiKeluarLembur from "./use-add-presensi-keluar-lembur";
import useGetStatusPresensiKeluarToday from "./use-get-status-presensi-keluar-today";

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const { presensiKeluarStatus, loading: presensiKeluarStatusLoading } =
    useGetStatusPresensiKeluarToday(uid);
  const { jadwalKaryawan } = useGetJadwal(uid);
  const jadwalReady = !!jadwalKaryawan;
  const isWfh = !!jadwalKaryawan?.isWfh;

  const keluarAwal = useAddPresensiKeluarLebihAwal({
    uid,
    onSubmitSuccess: async (alasan, buktiUrl) => {
      await prosesPresensiKeluar(true, alasan, buktiUrl);
    },
  });

  const lembur = useAddPresensiKeluarLembur({
    uid,
    jadwalKaryawan,
  });

  const checkPresensiConditions = (): boolean => {
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
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

    return true;
  };

  const handlePresensiKeluar = async (): Promise<boolean> => {
    if (!checkPresensiConditions()) return false;

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(
      jadwalKaryawan!.jam_keluar,
      today
    );

    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }

    const keluarLebihAwal = new Date(jamKeluarDate.getTime());
    const keluarLembur = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    // Keluar lebih awal
    if (now < keluarLebihAwal) {
      keluarAwal.openBottomSheet();
      return false;
    }

    // Keluar lembur
    if (now > keluarLembur) {
      setShowModal(true);
      return false;
    }

    // Keluar normal
    return await prosesPresensiKeluar(false);
  };

  const prosesPresensiKeluar = async (
    isKeluarAwal: boolean,
    alasan?: string,
    buktiUrl?: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toISOString();

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: false,
        keluar_awal: isKeluarAwal,
      };

      // Tambahkan data keluar awal jika ada
      if (isKeluarAwal && alasan && buktiUrl) {
        presensiKeluarData.alasan_keluar_awal = alasan;
        presensiKeluarData.bukti_keluar_awal = buktiUrl;
      }

      const tanggal = Today();

      const repo = new PresensiKeluarRepository(uid, tanggal);
      repo.setPresensiKeluar(presensiKeluarData);
      await repo.add();

      Toast.show({
        type: "success",
        text1: "Presensi keluar berhasil",
      });

      return true;
    } catch (error) {
      console.error("Presensi keluar error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi keluar",
        text2: "Silahkan coba lagi!",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleKeluarBiasa = async () => {
    setShowModal(false);
    await prosesPresensiKeluar(false);
  };

  const handleAjukanLembur = () => {
    setShowModal(false);
    lembur.openLemburSheet();
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const isButtonDisabled: boolean = Boolean(
    loading ||
      keluarAwal.loading ||
      lembur.loading ||
      !jadwalReady ||
      presensiKeluarStatusLoading ||
      presensiKeluarStatus.sudah_keluar ||
      (isWfh
        ? networkLoading || !isOnline
        : wifiLoading || !isWifiConnected || !isBssid || !canCheck)
  );

  return {
    handlePresensiKeluar,
    loading: loading || keluarAwal.loading || lembur.loading,
    isButtonDisabled,
    presensiKeluarStatus,
    presensiKeluarStatusLoading,
    showModal,
    closeModal,
    handleKeluarBiasa,
    handleAjukanLembur,
    keluarLebihAwal: {
      showBottomSheet: keluarAwal.showBottomSheet,
      closeBottomSheet: keluarAwal.closeBottomSheet,
      control: keluarAwal.control,
      errors: keluarAwal.errors,
      canSubmit: keluarAwal.canSubmit,
      handlePickEvidence: keluarAwal.handlePickEvidence,
      handleSubmit: keluarAwal.handleSubmitKeluarAwal,
      buktiKeluarAwal: keluarAwal.buktiKeluarAwal,
      loading: keluarAwal.loading,
    },
    lembur: {
      showLemburSheet: lembur.showLemburSheet,
      closeLemburSheet: lembur.closeLemburSheet,
      lemburDurasiMenit: lembur.lemburDurasiMenit,
      prosesPresensiKeluarLembur: lembur.prosesPresensiKeluarLembur,
      loading: lembur.loading,
      handlePickEvidence: lembur.handlePickEvidence,
      control: lembur.control,
      canSubmit: lembur.canSubmit,
      errors: lembur.errors,
      buktiPendukung: lembur.buktiPendukung,
    },
  };
};

export default useAddPresensiKeluar;
