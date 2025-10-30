import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { TambahPengajuanSakitData } from "@/src/common/types/tambah-pengajuan-data";
import Today from "@/src/common/utils/get-today";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PengajuanSakitFormSchema } from "@/src/common/validators/pengajuan/pengajuan-sakit-form-schema";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useTambahPengajuanSakit = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showSakitSheet, setShowSakitSheet] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<{ keterangan: string; bukti_pendukung: string }>({
    resolver: yupResolver(PengajuanSakitFormSchema),
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

  const handleTambahPengajuanSakit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (!uid) {
        throw "Tidak ada uid";
      }
      const uploadResult = await uploadToSupabase(
        uid,
        data.bukti_pendukung,
        KeteranganFile.bukti_sakit
      );

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      const tanggal = Today();

      const repository: IPengajuanRepository = new PengajuanRepositoryImpl();

      const dataPengajuan: TambahPengajuanSakitData = {
        tanggal_pengajuan: tanggal,
        keterangan: data.keterangan.trim(),
        bukti_pendukung: uploadResult.url,
      };

      await repository.tambahSakit(uid, dataPengajuan);

      Toast.show({
        type: "success",
        text1: "Pengajuan sakit berhasil ditambahkan",
      });

      reset();
      setShowSakitSheet(false);
      return true;
    } catch (error) {
      console.error("Pengajuan sakit error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal menambahkan pengajuan sakit",
        text2: "Silahkan coba lagi!",
      });
      return false;
    } finally {
      setLoading(false);
    }
  });

  const openSakitSheet = useCallback(() => {
    setShowSakitSheet(true);
  }, []);

  const closeSakitSheet = useCallback(() => {
    setShowSakitSheet(false);
    reset();
  }, [reset]);

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    buktiPendukung,
    handlePickEvidence,
    canSubmit,
    control,
    handleSubmit,
    errors,
    showSakitSheet,
    openSakitSheet,
    closeSakitSheet,
    handleTambahPengajuanSakit,
    loading,
  };
};

export default useTambahPengajuanSakit;
