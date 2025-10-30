import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { EditPengajuanIzinData } from "@/src/common/types/edit-pengajuan-data";
import formatDateToString from "@/src/common/utils/format-date-to-string";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import {
  updateFileInSupabase,
  uploadToSupabase,
} from "@/src/common/utils/upload-to-supabase";
import { PengajuanIzinFormSchema } from "@/src/common/validators/pengajuan/pengajuan-izin-form-schema";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useEditPengajuanIzin = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditSheet, setShowEditSheet] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [buktiPendukung, setBuktiPendukung] = useState<string | null>(null);
  const [oldBuktiUrl, setOldBuktiUrl] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerFor, setPickerFor] = useState<"start" | "end" | null>(null);
  const [leaveStartDate, setLeaveStartDate] = useState<Date | null>(null);
  const [leaveEndDate, setLeaveEndDate] = useState<Date | null>(null);
  const closeModal = () => setShowModal(false);

  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
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
  });

  const canSubmit = isDirty && !loading && !isSubmitting;

  const showPickerFor = (field: "start" | "end") => {
    setPickerFor(field);
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event?.type === "set" && selectedDate) {
      if (pickerFor === "start") {
        setLeaveStartDate(selectedDate);
        setValue("tanggal_mulai", formatDateToString(selectedDate), {
          shouldValidate: true,
          shouldDirty: true,
        });
        // jika end belum ada atau start > end -> samakan end
        if (!leaveEndDate || selectedDate > leaveEndDate) {
          setLeaveEndDate(selectedDate);
          setValue("tanggal_berakhir", formatDateToString(selectedDate), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
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

  const openEditSheet = (item: DaftarPengajuan) => {
    setSelectedId(item.id);

    if (!uid) {
      setShowEditSheet(true);
      return;
    }

    const repository: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsubscribe = repository.getDetail(uid, item.id, (data) => {
      if (data && data.tipe === TipePengajuan.izin) {
        const detail = data.detail || {};
        setValue("keterangan", detail.keterangan || "");
        setValue("bukti_pendukung", detail.bukti_pendukung || "");
        setValue("tanggal_mulai", detail.tanggal_mulai || "");
        setValue("tanggal_berakhir", detail.tanggal_berakhir || "");
        setOldBuktiUrl(detail.bukti_pendukung || "");
        setBuktiPendukung(detail.bukti_pendukung || null);
        const parseToDate = (maybeDateStr?: string | null) => {
          if (!maybeDateStr) return null;
          const d = new Date(maybeDateStr);
          return isNaN(d.getTime()) ? null : d;
        };
        const parsedStart = parseToDate(detail.tanggal_mulai);
        const parsedEnd = parseToDate(detail.tanggal_berakhir);
        setLeaveStartDate(parsedStart);
        setLeaveEndDate(parsedEnd ?? parsedStart ?? null);
        if (parsedStart) {
          setValue("tanggal_mulai", formatDateToString(parsedStart), {
            shouldDirty: false,
            shouldValidate: false,
          });
        }
        if (parsedEnd) {
          setValue("tanggal_berakhir", formatDateToString(parsedEnd), {
            shouldDirty: false,
            shouldValidate: false,
          });
        }
      } else {
        setValue("keterangan", "");
        setValue("tanggal_mulai", "");
        setValue("tanggal_berakhir", "");
        setValue("bukti_pendukung", "");
        setOldBuktiUrl("");
        setBuktiPendukung(null);
        setLeaveStartDate(null);
        setLeaveEndDate(null);
      }

      setShowEditSheet(true);

      try {
        if (unsubscribe) {
          unsubscribe();
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  const closeEditSheet = () => {
    setShowEditSheet(false);
    setBuktiPendukung(null);
    setSelectedId("");
    setLeaveStartDate(null);
    setLeaveEndDate(null);
    reset();
  };

  const handlePickEvidence = useCallback(async () => {
    const imageUri = await pickImageFromLibrary({ maxSizeMB: 3 });

    if (imageUri) {
      setBuktiPendukung(imageUri);
      setValue("bukti_pendukung", imageUri, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [setValue]);

  const handleEditPengajuanIzin = async () => {
    if (!uid || !selectedId) {
      Toast.show({ type: "error", text1: "Data tidak lengkap" });
      return;
    }

    setLoading(true);

    try {
      const repository: IPengajuanRepository = new PengajuanRepositoryImpl();
      const dataToUpdate: EditPengajuanIzinData = {};
      const keterangan = watch("keterangan");
      if (keterangan !== undefined) {
        dataToUpdate.keterangan = (keterangan || "").trim();
      }

      if (buktiPendukung && buktiPendukung !== oldBuktiUrl) {
        let uploadedUrl = "";

        if (oldBuktiUrl) {
          const result = await updateFileInSupabase(
            uid,
            buktiPendukung,
            oldBuktiUrl,
            KeteranganFile.bukti_izin
          );
          uploadedUrl = result.url || "";
        } else {
          const result = await uploadToSupabase(
            uid,
            buktiPendukung,
            KeteranganFile.bukti_izin
          );
          uploadedUrl = result.url || "";
        }

        dataToUpdate.bukti_pendukung = uploadedUrl;
      }

      const tanggalMulai = watch("tanggal_mulai");
      const tanggalBerakhir = watch("tanggal_berakhir");
      if (tanggalMulai) dataToUpdate.tanggal_mulai = tanggalMulai;
      if (tanggalBerakhir) dataToUpdate.tanggal_berakhir = tanggalBerakhir;
      await repository.editIzin(uid, selectedId, dataToUpdate);

      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Pengajuan izin berhasil diperbarui",
      });

      closeEditSheet();
      closeModal();
    } catch (error) {
      console.error("Error editing pengajuan izin:", error);
      Toast.show({
        type: "error",
        text1: "Gagal memperbarui pengajuan",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPress = async () => {
    if (!isDirty) {
      Toast.show({ type: "info", text1: "Belum ada perubahan" });
      return;
    }

    const isValid = await trigger();

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Periksa kembali data yang Anda input",
      });
      return;
    }

    setShowModal(true);
  };

  return {
    loadingEditIzin: loading,
    showModalEditIzin: showModal,
    showEditIzinSheet: showEditSheet,
    openEditIzinSheet: openEditSheet,
    closeEditIzinSheet: closeEditSheet,
    closeModalEditIzin: closeModal,
    canSubmitEditIzin: canSubmit,
    handlePickEvidenceEditIzin: handlePickEvidence,
    buktiPendukungEditIzin: buktiPendukung || watch("bukti_pendukung"),
    controlEditIzin: control,
    errorsEditIzin: errors,
    handleEditPengajuanIzin,
    onPressEditIzin: onPress,
    showDatePickerEditIzin: showDatePicker,
    showPickerForEditIzin: showPickerFor,
    onDateChangeEditIzin: onDateChange,
    pickerForEditIzin: pickerFor,
    leaveStartDateEditIzin: leaveStartDate,
    leaveEndDateEditIzin: leaveEndDate,
  };
};

export default useEditPengajuanIzin;
