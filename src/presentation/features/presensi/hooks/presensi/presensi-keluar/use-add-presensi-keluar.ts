import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PresensiKeluarRepository } from "@/src/domain/repositories/presensi-keluar-repository";
import useLiveLocation from "@/src/presentation/features/maps/hooks/use-live-location";
import useWifi from "@/src/presentation/features/wifi/hooks/use-wifi";
import { useGetJadwal } from "@/src/presentation/hooks/jadwal/use-get-jadwal";
import { PresensiKeluarFormSchema } from "@/src/presentation/validators/presensi-keluar/presensi-keluar-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [showLemburSheet, setShowLemburSheet] = useState<boolean>(false);

  const [lemburDurasiMenit, setLemburDurasiMenit] = useState<number | null>(
    null
  );
  const { jadwalKaryawan } = useGetJadwal(uid);
  const jadwalReady = !!jadwalKaryawan;
  const isWfh = !!jadwalKaryawan?.isWfh;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<{ alasan_keluar_awal: string; bukti_keluar_awal: string }>({
    resolver: yupResolver(PresensiKeluarFormSchema),
    defaultValues: { alasan_keluar_awal: "", bukti_keluar_awal: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const buktiKeluarAwal = watch("bukti_keluar_awal");

  const handlePickEvidence = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);

        if (fileInfo.exists && fileInfo.size) {
          const sizeInMB = fileInfo.size / (1024 * 1024);
          if (sizeInMB > 3) {
            Toast.show({
              type: "error",
              text1: "Ukuran file terlalu besar",
              text2: "Maksimal ukuran file adalah 3 MB",
            });
            return;
          }
          setValue("bukti_keluar_awal", asset.uri, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Gagal memilih gambar",
      });
    }
  }, [setValue]);

  const handlePresensiKeluar = async (): Promise<boolean> => {
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

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) {
      Toast.show({ type: "error", text1: "Format jam keluar tidak valid." });
      return false;
    }

    const keluarLebihAwal = new Date(jamKeluarDate.getTime());
    const keluarLembur = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    if (now < keluarLebihAwal) {
      setShowBottomSheet(true);
      return false;
    }

    if (now > keluarLembur) {
      setShowModal(true);
      return false;
    }

    return await prosesPresensiKeluar(false, null, null);
  };

  const prosesPresensiKeluar = async (
    keluarAwal: boolean,
    alasan?: string | null,
    buktiUri?: string | null
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toISOString();

      let alasanKeluarAwal: string | undefined;
      let buktiKeluarAwal: string | undefined;

      if (keluarAwal && alasan && buktiUri) {
        alasanKeluarAwal = alasan;
        const uploadResult = await uploadToSupabase(
          uid,
          buktiUri,
          "bukti_keluar_awal"
        );
        buktiKeluarAwal = uploadResult.url || undefined;
      }

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: false,
        keluarAwal,
        alasan_keluar_awal: alasanKeluarAwal,
        bukti_keluar_awal: buktiKeluarAwal,
      };

      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const tanggal = `${yyyy}-${mm}-${dd}`;

      const repo = new PresensiKeluarRepository(uid, tanggal);
      repo.setPresensiKeluar(presensiKeluarData);
      await repo.add();

      Toast.show({
        type: "success",
        text1: "Presensi keluar berhasil",
      });

      reset();
      setShowBottomSheet(false);
      return true;
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi keluar",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const prosesPresensiKeluarLembur = async (
    durasiLemburMenit: number
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const now = new Date();
      const waktu = now.toISOString();

      // Simpan durasi lembur sebagai string "<n> menit"
      const durasiLemburStr = `${durasiLemburMenit} menit`;

      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: true,
        durasi_lembur: durasiLemburStr,
        keluarAwal: false,
      };

      const today = new Date();
      const tanggal = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const repo = new PresensiKeluarRepository(uid, tanggal);
      repo.setPresensiKeluar(presensiKeluarData);
      await repo.add();

      Toast.show({
        type: "success",
        text1: "Presensi keluar lembur berhasil",
      });

      setShowModal(false);
      return true;
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Gagal melakukan presensi keluar lembur",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKeluarAwal = handleSubmit(async (data) => {
    await prosesPresensiKeluar(
      true,
      data.alasan_keluar_awal,
      data.bukti_keluar_awal
    );
  });

  const handleKeluarBiasa = async () => {
    setShowModal(false);
    await prosesPresensiKeluar(false, null, null);
  };

  const handleAjukanLembur = () => {
    setShowModal(false);

    if (!jadwalKaryawan) return;

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) return;

    const keluarLembur = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    const diffMs = now.getTime() - keluarLembur.getTime();
    const diffMenit = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    // aturan: jika diffMenit >= 30 -> set 60 menit; else ambil selisih menit
    const durasiLemburMenit = diffMenit >= 30 ? 60 : diffMenit;

    setLemburDurasiMenit(durasiLemburMenit);

    // buka bottom sheet lembur (hanya membuka, isi belum diimplementasikan)
    setShowLemburSheet(true);
  };

  const closeEvidenceModal = useCallback(() => {
    setShowBottomSheet(false);
    reset();
  }, [reset]);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeLemburSheet = useCallback(() => {
    setShowLemburSheet(false);
  }, []);

  const isButtonDisabled: boolean = Boolean(
    loading ||
      !jadwalReady ||
      (isWfh
        ? networkLoading || !isOnline
        : wifiLoading || !isWifiConnected || !isBssid || !canCheck)
  );

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    handlePresensiKeluar,
    loading,
    isButtonDisabled,
    showBottomSheet,
    showModal,
    showLemburSheet,
    closeEvidenceModal,
    closeModal,
    closeLemburSheet,
    control,
    errors,
    canSubmit,
    handlePickEvidence,
    handleSubmitKeluarAwal,
    buktiKeluarAwal,
    handleKeluarBiasa,
    handleAjukanLembur,
    prosesPresensiKeluarLembur,
    lemburDurasiMenit,
  };
};

export default useAddPresensiKeluar;
