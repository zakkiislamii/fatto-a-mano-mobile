import { pickImageFromLibrary } from "@/src/common/utils/image-picker";
import { PengajuanSakitFormSchema } from "@/src/presentation/validators/pengajuan/pengajuan-sakit-form-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const useTambahPengajuanIzin = () => {
  const [loading, setLoading] = useState<boolean>(false);
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

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    buktiPendukung,
    handlePickEvidence,
    canSubmit,
    control,
    handleSubmit,
    errors,
  };
};

export default useTambahPengajuanIzin;
