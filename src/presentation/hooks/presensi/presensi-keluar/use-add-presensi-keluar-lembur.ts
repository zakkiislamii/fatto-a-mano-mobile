import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { parseJamToDateToday } from "@/src/common/utils/parse-jam-to-date-today";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PengajuanLemburFormSchema } from "@/src/common/validators/pengajuan/pengajuan-lembur-form-schema";
import { JadwalKaryawan } from "@/src/domain/models/jadwal-karyawan";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

interface UseAddPresensiKeluarLemburProps {
  onSubmitSuccess: (
    uid: string,
    keterangan: string,
    buktiUrl: string,
    lemburDurasiMenit: number
  ) => Promise<boolean>;
}

const useAddPresensiKeluarLembur = (props: UseAddPresensiKeluarLemburProps) => {
  const { onSubmitSuccess } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [showLemburSheet, setShowLemburSheet] = useState<boolean>(false);
  const [lemburDurasiMenit, setLemburDurasiMenit] = useState<number | null>(
    null
  );
  const [currentUid, setCurrentUid] = useState<string>("");

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

  const calculateLemburDuration = useCallback(
    (jadwalKaryawan: JadwalKaryawan | null): number => {
      if (!jadwalKaryawan) return 0;

      const today = new Date();
      const jamKeluarDate = parseJamToDateToday(
        jadwalKaryawan.jam_keluar,
        today
      );
      if (!jamKeluarDate) return 0;

      const keluarLembur = new Date(jamKeluarDate.getTime());
      const diffMs = today.getTime() - keluarLembur.getTime();
      const diffMenit = Math.max(0, Math.floor(diffMs / (1000 * 60)));

      if (diffMenit < 30) return diffMenit;
      if (diffMenit <= 60) return 60;
      return diffMenit;
    },
    []
  );

  const handleSubmitLembur = handleSubmit(async (data) => {
    if (!lemburDurasiMenit) {
      Toast.show({
        type: "error",
        text1: "Durasi lembur tidak valid",
      });
      return;
    }

    setLoading(true);
    try {
      const uploadResult = await uploadToSupabase(
        currentUid,
        data.bukti_pendukung,
        KeteranganFile.bukti_lembur
      );

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      const success = await onSubmitSuccess(
        currentUid,
        data.keterangan,
        uploadResult.url,
        lemburDurasiMenit
      );

      if (success) {
        reset();
        setShowLemburSheet(false);
        setLemburDurasiMenit(null);
        setCurrentUid("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal upload bukti",
        text2: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  });

  const openLemburSheet = useCallback(
    (uid: string, jadwalKaryawan: JadwalKaryawan | null) => {
      setCurrentUid(uid);
      const durasi = calculateLemburDuration(jadwalKaryawan);
      setLemburDurasiMenit(durasi);
      setShowLemburSheet(true);
    },
    [calculateLemburDuration]
  );

  const closeLemburSheet = useCallback(() => {
    setShowLemburSheet(false);
    setLemburDurasiMenit(null);
    setCurrentUid("");
    reset();
  }, [reset]);

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
    handleSubmitLembur,
  };
};

export default useAddPresensiKeluarLembur;
