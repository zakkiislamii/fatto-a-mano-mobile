import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PresensiKeluarFormSchema } from "@/src/presentation/validators/presensi-keluar/presensi-keluar-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

interface UseAddPresensiKeluarLebihAwalProps {
  uid: string;
  onSubmitSuccess: (alasan: string, buktiUrl: string) => Promise<void>;
}

const useAddPresensiKeluarLebihAwal = ({
  uid,
  onSubmitSuccess,
}: UseAddPresensiKeluarLebihAwalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);

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
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Gagal memilih gambar",
      });
    }
  }, [setValue]);

  const handleSubmitKeluarAwal = handleSubmit(async (data) => {
    setLoading(true);
    try {
      console.log("Uploading bukti keluar awal...");

      const uploadResult = await uploadToSupabase(
        uid,
        data.bukti_keluar_awal,
        KeteranganFile.bukti_keluar_awal
      );

      console.log("Upload result:", uploadResult);

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      await onSubmitSuccess(data.alasan_keluar_awal, uploadResult.url);

      reset();
      setShowBottomSheet(false);
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

  const openBottomSheet = () => setShowBottomSheet(true);

  const closeBottomSheet = useCallback(() => {
    setShowBottomSheet(false);
    reset();
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
