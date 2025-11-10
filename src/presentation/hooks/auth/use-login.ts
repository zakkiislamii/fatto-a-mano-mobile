import { mapFirebaseAuthError } from "@/src/common/utils/auth-error-mapper";
import { LoginFormSchema } from "@/src/common/validators/auth/login-form-schema";
import { AuthRepositoryImpl } from "@/src/data/repositories/auth-repository-impl";
import { IAuthRepository } from "@/src/domain/repositories/i-auth-repository";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const useLogin = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const togglePasswordVisibility = () =>
    setIsPasswordVisible((p: boolean) => !p);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    setError,
    reset,
  } = useForm<{ email: string; password: string }>({
    resolver: yupResolver(LoginFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleLogin = handleSubmit(async ({ email, password }) => {
    setLoading(true);
    setSubmitError(null);
    try {
      const authRepo: IAuthRepository = new AuthRepositoryImpl();
      await authRepo.login(email, password);
      reset();
      Toast.show({ type: "success", text1: "Login Berhasil!" });
      router.replace("/login");
      return true;
    } catch (e: any) {
      const friendly = mapFirebaseAuthError(e);
      const code = e?.code as string | undefined;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("email", {
          type: "manual",
          message: "Email atau password salah.",
        });
        setError("password", {
          type: "manual",
          message: "Email atau password salah.",
        });
        setSubmitError(null);
      } else if (code === "auth/invalid-email") {
        setError("email", { type: "manual", message: friendly });
        setSubmitError(null);
      } else {
        setSubmitError(friendly);
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
    canSubmit,
    handleLogin,
    loading,
    submitError,
    isPasswordVisible,
    togglePasswordVisibility,
  };
};

export default useLogin;
