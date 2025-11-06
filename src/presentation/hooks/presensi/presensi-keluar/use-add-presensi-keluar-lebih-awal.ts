import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PresensiKeluarFormSchema } from "@/src/common/validators/presensi/presensi-keluar-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

interface UseAddPresensiKeluarLebihAwalProps {
  onSubmitSuccess: (
    uid: string,
    alasan: string,
    buktiUrl: string
  ) => Promise<boolean>;
}

const useAddPresensiKeluarLebihAwal = (
  props: UseAddPresensiKeluarLebihAwalProps
) => {
  const { onSubmitSuccess } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [currentUid, setCurrentUid] = useState<string>("");

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
    const imageUri = await pickImageFromLibrary({ maxSizeMB: 3 });

    if (imageUri) {
      setValue("bukti_keluar_awal", imageUri, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [setValue]);

  const handleSubmitKeluarAwal = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const uploadResult = await uploadToSupabase(
        currentUid,
        data.bukti_keluar_awal,
        KeteranganFile.bukti_keluar_awal
      );

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      const success = await onSubmitSuccess(
        currentUid,
        data.alasan_keluar_awal,
        uploadResult.url
      );

      if (success) {
        reset();
        setShowBottomSheet(false);
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

  const openBottomSheet = (uid: string) => {
    setCurrentUid(uid);
    setShowBottomSheet(true);
  };

  const closeBottomSheet = useCallback(() => {
    setShowBottomSheet(false);
    reset();
    setCurrentUid("");
  }, [reset]);

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    control,
    errors,
    loading,
    canSubmit,
    buktiKeluarAwal,
    showBottomSheet,
    handlePickEvidence,
    handleSubmitKeluarAwal,
    openBottomSheet,
    closeBottomSheet,
  };
};

export default useAddPresensiKeluarLebihAwal;
