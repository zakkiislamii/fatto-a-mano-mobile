import { EditProfilData } from "@/src/common/types/user-data";
import { UpdateProfilFormSchema } from "@/src/common/validators/profil/update-profil-form-schema";
import { UserRepositoryImpl } from "@/src/data/repositories/user-repository-impl";
import { IUserRepository } from "@/src/domain/repositories/i-user-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

interface ProfilKaryawan {
  nama?: string;
}

const useEditProfil = (
  uid: string | null,
  profilKaryawan?: ProfilKaryawan | null
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const repo: IUserRepository = useMemo(() => new UserRepositoryImpl(), []);
  const router = useRouter();
  const [showEditSheet, setShowEditSheet] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    setError: setFormError,
    reset,
    trigger,
  } = useForm({
    resolver: yupResolver(UpdateProfilFormSchema),
    defaultValues: {
      nama: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (profilKaryawan) {
      reset({
        nama: profilKaryawan.nama ?? "",
      });
    }
  }, [profilKaryawan, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!uid) {
      Toast.show({
        type: "error",
        text1: "Terjadi kesalahan, silahkan coba lagi!",
      });
      setShowModal(false);
      return;
    }

    const payload: EditProfilData = {};

    if (values?.nama && values.nama !== profilKaryawan?.nama) {
      payload.nama = String(values.nama).trim();
    }

    if (Object.keys(payload).length === 0) {
      Toast.show({ type: "info", text1: "Tidak ada perubahan" });
      setShowModal(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await repo.editProfil(uid, payload);
      setShowModal(false);
      setShowEditSheet(false);
      Toast.show({ type: "success", text1: "Profil diperbarui" });
      reset({ nama: values.nama ?? "" });
      router.replace("/(tabs)/profil");
    } catch (err: any) {
      const errorMessage = err?.message ?? "Gagal memperbarui profil.";
      setErrorMsg(errorMessage);
      setFormError("root", {
        type: "server",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  });

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

  const closeModal = () => setShowModal(false);
  const canSubmit = isDirty && !loading && !isSubmitting;

  const openEditSheet = () => setShowEditSheet(true);
  const closeEditSheet = () => setShowEditSheet(false);
  const toggleEditSheet = () => setShowEditSheet((s) => !s);

  return {
    loading,
    showModal,
    error: errorMsg,
    canSubmit,
    control,
    errors,
    isSubmitting,
    onPress,
    closeModal,
    handleUpdateProfil: onSubmit,
    showEditSheet,
    openEditSheet,
    closeEditSheet,
    toggleEditSheet,
  };
};

export default useEditProfil;
