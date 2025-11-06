import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import formatDateToString from "@/src/common/utils/format-date-to-string";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { uploadToSupabase } from "@/src/common/utils/upload-to-supabase";
import { PengajuanIzinFormSchema } from "@/src/common/validators/pengajuan/pengajuan-izin-form-schema";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { DetailPengajuanIzin } from "@/src/domain/models/detail-pengajuan-izin";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useTambahPengajuanIzin = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showIzinSheet, setShowIzinSheet] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [pickerFor, setPickerFor] = useState<"start" | "end" | null>(null);
  const [leaveStartDate, setLeaveStartDate] = useState<Date | null>(null);
  const [leaveEndDate, setLeaveEndDate] = useState<Date | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<{
    keterangan: string;
    bukti_pendukung: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
  }>({
    resolver: yupResolver(PengajuanIzinFormSchema),
    defaultValues: {
      keterangan: "",
      bukti_pendukung: "",
      tanggal_mulai: "",
      tanggal_berakhir: "",
    },
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

  const showPickerFor = (field: "start" | "end") => {
    setPickerFor(field);
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event?.type === "set" && selectedDate) {
      if (pickerFor === "start") {
        setLeaveStartDate(selectedDate);
        if (!leaveEndDate || selectedDate > leaveEndDate) {
          setLeaveEndDate(selectedDate);
          setValue("tanggal_berakhir", formatDateToString(selectedDate), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
        setValue("tanggal_mulai", formatDateToString(selectedDate), {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else if (pickerFor === "end") {
        setLeaveEndDate(selectedDate);
        setValue("tanggal_berakhir", formatDateToString(selectedDate), {
          shouldValidate: true,
          shouldDirty: true,
        });
        if (leaveStartDate && selectedDate < leaveStartDate) {
          setLeaveStartDate(selectedDate);
          setValue("tanggal_mulai", formatDateToString(selectedDate), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }
  };

  const handleTambahPengajuanIzin = handleSubmit(async (data) => {
    try {
      setLoading(true);
      if (!uid) {
        throw "Tidak ada uid";
      }

      const uploadResult = await uploadToSupabase(
        uid,
        data.bukti_pendukung,
        KeteranganFile.bukti_izin
      );

      if (!uploadResult.url) {
        throw new Error("URL bukti tidak tersedia setelah upload");
      }

      const repository: IPengajuanRepository = new PengajuanRepositoryImpl();

      const dataPengajuan: DetailPengajuanIzin = {
        keterangan: data.keterangan.trim(),
        bukti_pendukung: uploadResult.url,
        tanggal_mulai: data.tanggal_mulai,
        tanggal_berakhir: data.tanggal_berakhir,
      };
      await repository.tambahIzin(uid, dataPengajuan);

      Toast.show({
        type: "success",
        text1: "Pengajuan izin berhasil ditambahkan",
      });

      reset();
      setShowIzinSheet(false);
      return true;
    } catch (error) {
      console.error("Pengajuan izin error:", error);
      Toast.show({
        type: "error",
        text1: "Gagal menambahkan pengajuan izin",
        text2: "Silahkan coba lagi!",
      });
      return false;
    } finally {
      setLoading(false);
    }
  });

  const openIzinSheet = useCallback(() => {
    setShowIzinSheet(true);
  }, []);

  const closeIzinSheet = useCallback(() => {
    setShowIzinSheet(false);
    reset();
    setLeaveStartDate(null);
    setLeaveEndDate(null);
    setPickerFor(null);
  }, [reset]);

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    buktiPendukung,
    handlePickEvidence,
    canSubmit,
    control,
    errors,
    openIzinSheet,
    closeIzinSheet,
    showIzinSheet,
    handleTambahPengajuanIzin,
    loading,
    showDatePicker,
    showPickerFor,
    onDateChange,
    pickerFor,
    leaveStartDate,
    leaveEndDate,
  };
};

export default useTambahPengajuanIzin;
