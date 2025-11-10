import { KeteranganFile } from "@/src/common/enums/keterangan-file";
import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import {
  updateFileInSupabase,
  uploadToSupabase,
} from "@/src/common/utils/upload-to-supabase";
import { PengajuanLemburFormSchema } from "@/src/common/validators/pengajuan/pengajuan-lembur-form-schema";
import { PengajuanRepositoryImpl } from "@/src/data/repositories/pengajuan-repository-impl";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { DetailPengajuanLembur } from "@/src/domain/models/detail-pengajuan-lembur";
import { PengajuanLembur } from "@/src/domain/models/pengajuan-lembur";
import { IPengajuanRepository } from "@/src/domain/repositories/i-pengajuan-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useEditPengajuanLembur = (uid: string | undefined) => {
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
    resolver: yupResolver(PengajuanLemburFormSchema),
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

    const repository: IPengajuanRepository = new PengajuanRepositoryImpl();

    const unsubscribe = repository.getDetail(uid, item.id, (data) => {
      if (data && data.tipe === TipePengajuan.LEMBUR) {
        const dDetail = data as PengajuanLembur;
        setValue("keterangan", dDetail.detail.keterangan || "");
        setValue("bukti_pendukung", dDetail.detail.bukti_pendukung || "");
        setOldBuktiUrl(dDetail.detail.bukti_pendukung || "");
        setBuktiPendukung(dDetail.detail.bukti_pendukung || null);
      } else {
        setValue("keterangan", "");
        setValue("bukti_pendukung", "");
        setOldBuktiUrl("");
        setBuktiPendukung(null);
      }

      setShowEditSheet(true);

      if (unsubscribe) {
        unsubscribe();
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

  const handleEditPengajuanLembur = async () => {
    if (!uid || !selectedId) {
      Toast.show({ type: "error", text1: "Data tidak lengkap" });
      return;
    }

    setLoading(true);

    try {
      const repository: IPengajuanRepository = new PengajuanRepositoryImpl();
      const dataToUpdate: Partial<DetailPengajuanLembur> = {};

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
            KeteranganFile.BUKTI_LEMBUR
          );
          uploadedUrl = result.url || "";
        } else {
          const result = await uploadToSupabase(
            uid,
            buktiPendukung,
            KeteranganFile.BUKTI_LEMBUR
          );
          uploadedUrl = result.url || "";
        }

        dataToUpdate.bukti_pendukung = uploadedUrl;
      }

      await repository.editPengajuanLembur(uid, selectedId, dataToUpdate);

      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Pengajuan lembur berhasil diperbarui",
      });

      closeEditSheet();
      closeModal();
    } catch (error) {
      console.error("Error editing pengajuan lembur:", error);
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
    loadingEditLembur: loading,
    showModalEditLembur: showModal,
    showEditLemburSheet: showEditSheet,
    openEditLemburSheet: openEditSheet,
    closeEditLemburSheet: closeEditSheet,
    closeModalEditLembur: closeModal,
    canSubmitEditLembur: canSubmit,
    handlePickEvidenceEditLembur: handlePickEvidence,
    buktiPendukungEditLembur: buktiPendukung || watch("bukti_pendukung"),
    controlEditLembur: control,
    errorsEditLembur: errors,
    handleEditPengajuanLembur,
    onPressEditLembur: onPress,
  };
};

export default useEditPengajuanLembur;
