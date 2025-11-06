import Today from "@/src/common/utils/get-today";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { PresensiRepositoryImpl } from "@/src/data/repositories/presensi-repository-impl";
import { DetailPengajuanLembur } from "@/src/domain/models/detail-pengajuan-lembur";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { PresensiKeluar } from "@/src/domain/models/presensi-keluar";
import { IPresensiRepository } from "@/src/domain/repositories/i-presensi-repository";
import useLocation from "@/src/presentation/hooks/location/use-location";
import useWifi from "@/src/presentation/hooks/wifi/use-wifi";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import useAddPresensiKeluarLebihAwal from "./use-add-presensi-keluar-lebih-awal";
import useAddPresensiKeluarLembur from "./use-add-presensi-keluar-lembur";

const useAddPresensiKeluar = () => {
  const { isLocationValid } = useLocation();
  const { isWifiValid } = useWifi();
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handlePresensiKeluarAwal = async (
    uid: string,
    alasan: string,
    buktiUrl: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toTimeString().slice(0, 5);

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: false,
        keluar_awal: true,
        alasan_keluar_awal: alasan,
        bukti_keluar_awal: buktiUrl,
      };

      const tanggal = Today();

      const repo: IPresensiRepository = new PresensiRepositoryImpl();
      await repo.addPresensiKeluar(uid, tanggal, presensiKeluarData);

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

  const handlePresensiKeluarLembur = async (
    uid: string,
    keterangan: string,
    buktiUrl: string,
    lemburDurasiMenit: number
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toTimeString().slice(0, 5);
      const durasiLemburStr = `${lemburDurasiMenit} menit`;
      const tanggal = Today();

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: true,
        durasi_lembur: durasiLemburStr,
        keluar_awal: false,
      };

      const presensiRepo: IPresensiRepository = new PresensiRepositoryImpl();
      await presensiRepo.addPresensiKeluar(uid, tanggal, presensiKeluarData);

      const pengajuanLemburData: DetailPengajuanLembur = {
        keterangan: keterangan,
        bukti_pendukung: buktiUrl,
        durasi_lembur: durasiLemburStr,
      };

      const pengajuanRepo = new PengajuanRepositoryImpl();
      await pengajuanRepo.tambahLembur(uid, pengajuanLemburData);

      Toast.show({
        type: "success",
        text1: "Presensi keluar lembur berhasil",
        text2: "Pengajuan lembur telah diajukan",
      });

      return true;
    } catch (error) {
      console.error("Presensi lembur error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi keluar lembur",
        text2: error instanceof Error ? error.message : "Silahkan coba lagi!",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const keluarAwal = useAddPresensiKeluarLebihAwal({
    onSubmitSuccess: handlePresensiKeluarAwal,
  });

  const lembur = useAddPresensiKeluarLembur({
    onSubmitSuccess: handlePresensiKeluarLembur,
  });

  const handlePresensiKeluar = async (
    uid: string,
    jadwalKaryawan: JadwalKaryawan | null
  ): Promise<boolean> => {
    if (!jadwalKaryawan) {
      Toast.show({
        type: "error",
        text1: "Jadwal karyawan belum tersedia. Mohon tunggu.",
      });
      return false;
    }

    const isWfa = !!jadwalKaryawan.is_wfa;

    if (!isWfa) {
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

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);

    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }

    const keluarLebihAwal = new Date(jamKeluarDate.getTime());
    const keluarLemburTime = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    if (now < keluarLebihAwal) {
      keluarAwal.openBottomSheet(uid);
      return false;
    }

    if (now > keluarLemburTime) {
      setShowModal(true);
      return false;
    }

    return await handlePresensiKeluarBiasa(uid);
  };

  const handlePresensiKeluarBiasa = async (uid: string): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toTimeString().slice(0, 5);

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: false,
        keluar_awal: false,
      };

      const tanggal = Today();

      const repo: IPresensiRepository = new PresensiRepositoryImpl();
      await repo.addPresensiKeluar(uid, tanggal, presensiKeluarData);

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

  const handleKeluarBiasa = async (uid: string) => {
    setShowModal(false);
    await handlePresensiKeluarBiasa(uid);
  };

  const handleAjukanLembur = (
    uid: string,
    jadwalKaryawan: JadwalKaryawan | null
  ) => {
    setShowModal(false);
    lembur.openLemburSheet(uid, jadwalKaryawan);
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    handlePresensiKeluar,
    handlePresensiKeluarAwal,
    handlePresensiKeluarLembur,
    loading: loading || keluarAwal.loading || lembur.loading,
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
      handleSubmit: lembur.handleSubmitLembur,
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
