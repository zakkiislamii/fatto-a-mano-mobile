import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { PresensiKeluar } from "@/src/common/types/presensi-keluar";
import Today from "@/src/common/utils/get-today";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PengajuanLemburRepository } from "@/src/domain/repositories/pengajuan/pengajuan-lembur-repository";
import { PresensiKeluarRepository } from "@/src/domain/repositories/presensi/presensi-keluar-repository";
import { PengajuanLemburFormSchema } from "@/src/presentation/validators/pengajuan/pengajuan-lembur-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

interface UseAddPresensiKeluarLemburProps {
  uid: string;
  jadwalKaryawan: JadwalKaryawan | null;
}

const useAddPresensiKeluarLembur = ({
  uid,
  jadwalKaryawan,
}: UseAddPresensiKeluarLemburProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showLemburSheet, setShowLemburSheet] = useState<boolean>(false);
  const [lemburDurasiMenit, setLemburDurasiMenit] = useState<number | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<{ keterangan: string; bukti_pendukung: string }>({
    resolver: yupResolver(PengajuanLemburFormSchema),
    defaultValues: { keterangan: "", bukti_pendukung: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const buktiPendukung = watch("bukti_pendukung");

  const handlePickEvidence = useCallback(async () => {
    const imageUri = await pickImageFromLibrary({ maxSizeMB: 3 });

    if (imageUri) {
      setValue("bukti_pendukung", imageUri, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [setValue]);

  const calculateLemburDuration = useCallback((): number => {
    if (!jadwalKaryawan) return 0;

    const today = new Date();
    const jamKeluarDate = parseJamToDateToday(jadwalKaryawan.jam_keluar, today);
    if (!jamKeluarDate) return 0;

    const keluarLembur = new Date(jamKeluarDate.getTime() + 30 * 60 * 1000);
    const now = new Date();

    const diffMs = now.getTime() - keluarLembur.getTime();
    const diffMenit = Math.max(0, Math.floor(diffMs / (1000 * 60)));

    return diffMenit >= 30 ? 60 : diffMenit;
  }, [jadwalKaryawan]);

  const openLemburSheet = useCallback(() => {
    const durasi = calculateLemburDuration();
    setLemburDurasiMenit(durasi);
    setShowLemburSheet(true);
  }, [calculateLemburDuration]);

  const closeLemburSheet = useCallback(() => {
    setShowLemburSheet(false);
    setLemburDurasiMenit(null);
    reset();
  }, [reset]);

  const prosesPresensiKeluarLembur = handleSubmit(async (data) => {
    if (!lemburDurasiMenit) {
      Toast.show({
        type: "error",
        text1: "Durasi lembur tidak valid",
      });
      return false;
    }

    setLoading(true);
    try {
      console.log("Uploading bukti pendukung lembur...");

      const uploadResult = await uploadToSupabase(
        uid,
        data.bukti_pendukung,
        KeteranganFile.bukti_lembur
      );

      console.log("Upload result:", uploadResult);

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      const now = new Date();
      const waktu = now.toISOString();
      const durasiLemburStr = `${lemburDurasiMenit} menit`;
      const tanggal = Today();

      // Simpan presensi keluar
      const presensiKeluarData: PresensiKeluar = {
        waktu,
        lembur: true,
        durasi_lembur: durasiLemburStr,
        keluar_awal: false,
      };

      const presensiKeluarRepo = new PresensiKeluarRepository(uid, tanggal);
      presensiKeluarRepo.setPresensiKeluar(presensiKeluarData);
      await presensiKeluarRepo.add();

      // Simpan pengajuan lembur
      const pengajuanLemburRepo = new PengajuanLemburRepository(uid, tanggal);
      pengajuanLemburRepo.setKeterangan(data.keterangan);
      pengajuanLemburRepo.setBuktiPendukung(uploadResult.url);
      pengajuanLemburRepo.setDurasiLembur(durasiLemburStr);
      await pengajuanLemburRepo.tambah();

      Toast.show({
        type: "success",
        text1: "Presensi keluar lembur berhasil",
        text2: "Pengajuan lembur telah diajukan",
      });

      reset();
      setShowLemburSheet(false);
      setLemburDurasiMenit(null);

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
  });

  const canSubmit =
    isValid &&
    !loading &&
    !isSubmitting &&
    isDirty &&
    lemburDurasiMenit !== null;

  return {
    control,
    errors,
    loading,
    canSubmit,
    showLemburSheet,
    lemburDurasiMenit,
    buktiPendukung,
    openLemburSheet,
    closeLemburSheet,
    handlePickEvidence,
    prosesPresensiKeluarLembur,
  };
};

export default useAddPresensiKeluarLembur;
