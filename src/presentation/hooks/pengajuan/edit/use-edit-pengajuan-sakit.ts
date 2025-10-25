import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import {
  updateFileInSupabase,
  uploadToSupabase,
} from "@/src/common/utils/upload-to-supabase";
import { PengajuanLemburRepository } from "@/src/domain/repositories/pengajuan/pengajuan-lembur-repository";
import { PengajuanSakitRepository } from "@/src/domain/repositories/pengajuan/pengajuan-sakit-repository";
import { PengajuanSakitFormSchema } from "@/src/presentation/validators/pengajuan/pengajuan-sakit-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useEditPengajuanSakit = (uid: string | undefined) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditSheet, setShowEditSheet] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [buktiPendukung, setBuktiPendukung] = useState<string | null>(null);
  const [oldBuktiUrl, setOldBuktiUrl] = useState<string>("");
  const closeModal = () => setShowModal(false);

  const {
    control,
    formState: { errors, isDirty, isSubmitting },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<{ keterangan: string; bukti_pendukung: string }>({
    resolver: yupResolver(PengajuanSakitFormSchema),
    defaultValues: { keterangan: "", bukti_pendukung: "" },
    mode: "onChange",
  });

  const canSubmit = isDirty && !loading && !isSubmitting;

  const openEditSheet = (item: DaftarPengajuan) => {
    setSelectedId(item.id);

    if (!uid) {
      setShowEditSheet(true);
      return;
    }

    const repository = new PengajuanSakitRepository(uid);
    repository.setId(item.id);

    const unsubscribe = repository.getDetail((data) => {
      if (data && data.tipe === TipePengajuan.sakit) {
        setValue("keterangan", data.detail.keterangan || "");
        setValue("bukti_pendukung", data.detail.bukti_pendukung || "");
        setOldBuktiUrl(data.detail.bukti_pendukung || "");
        setBuktiPendukung(data.detail.bukti_pendukung || null);
      } else {
        setValue("keterangan", "");
        setValue("bukti_pendukung", "");
        setOldBuktiUrl("");
        setBuktiPendukung(null);
      }

      setShowEditSheet(true);

      try {
        unsubscribe();
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  };

  const closeEditSheet = () => {
    setShowEditSheet(false);
    setBuktiPendukung(null);
    setSelectedId("");
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

  const handleEditPengajuanSakit = async () => {
    if (!uid || !selectedId) {
      Toast.show({ type: "error", text1: "Data tidak lengkap" });
      return;
    }

    setLoading(true);

    try {
      const repository = new PengajuanLemburRepository(uid);
      repository.setId(selectedId);

      const keterangan = watch("keterangan");

      if (keterangan !== undefined) {
        repository.setKeterangan((keterangan || "").trim());
      }

      if (buktiPendukung && buktiPendukung !== oldBuktiUrl) {
        let uploadedUrl = "";

        if (oldBuktiUrl) {
          const result = await updateFileInSupabase(
            uid,
            buktiPendukung,
            oldBuktiUrl,
            KeteranganFile.bukti_lembur
          );
          uploadedUrl = result.url || "";
        } else {
          const result = await uploadToSupabase(
            uid,
            buktiPendukung,
            KeteranganFile.bukti_lembur
          );
          uploadedUrl = result.url || "";
        }

        repository.setBuktiPendukung(uploadedUrl);
      }

      await repository.edit();

      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Pengajuan sakit berhasil diperbarui",
      });

      closeEditSheet();
      closeModal();
    } catch (error) {
      console.error("Error editing pengajuan sakit:", error);
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
    loadingEditSakit: loading,
    showModalEditSakit: showModal,
    showEditSakitSheet: showEditSheet,
    openEditSakitSheet: openEditSheet,
    closeEditSakitSheet: closeEditSheet,
    closeModalEditSakit: closeModal,
    canSubmitEditSakit: canSubmit,
    handlePickEvidenceEditSakit: handlePickEvidence,
    buktiPendukungEditSakit: buktiPendukung || watch("bukti_pendukung"),
    controlEditSakit: control,
    errorsEditSakit: errors,
    handleEditPengajuanSakit,
    onPressEditSakit: onPress,
  };
};

export default useEditPengajuanSakit;
