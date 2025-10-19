import { mapFirebaseAuthError } from "@/src/common/utils/auth-error-mapper";
import { AuthRepository } from "@/src/domain/repositories/auth-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { RegisterFormSchema } from "../../validators/auth/register-form-schema";

const useRegister = () => {
  const vmRef = useRef(new AuthRepository());

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const togglePasswordVisibility = useCallback(
    () => setIsPasswordVisible((p) => !p),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
    setError,
    reset,
  } = useForm<{
    email: string;
    password: string;
    confirm_password: string;
  }>({
    resolver: yupResolver(RegisterFormSchema),
    defaultValues: { email: "", password: "", confirm_password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setSubmitError(null);
    try {
      await vmRef.current.register(email, password);
      reset();
      Toast.show({ type: "success", text1: "Registrasi berhasil!" });
      return true;
    } catch (e: any) {
      const code = e?.code as string | undefined;
      const friendly = mapFirebaseAuthError(e);
      if (code === "auth/email-already-in-use") {
        setError("email", {
          type: "manual",
          message: "Email sudah terdaftar.",
        });
        setSubmitError(null);
      } else if (code === "auth/invalid-email") {
        setError("email", {
          type: "manual",
          message: "Format email tidak valid.",
        });
        setSubmitError(null);
      } else if (code === "auth/weak-password") {
        setError("password", {
          type: "manual",
          message: "Password terlalu lemah.",
        });
        setSubmitError(null);
      } else {
        setSubmitError(friendly ?? "Terjadi kesalahan saat registrasi.");
        Toast.show({ type: "error", text1: "Registrasi gagal" });
      }
      return false;
    } finally {
      setLoading(false);
    }
  });

  const canSubmit = isValid && !loading && !isSubmitting && isDirty;

  return {
    control,
    errors,
    onSubmit,
    canSubmit,
    loading,
    submitError,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

export default useRegister;
