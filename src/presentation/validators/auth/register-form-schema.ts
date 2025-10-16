import * as yup from "yup";

export const RegisterFormSchema = yup.object({
  email: yup.string().email("Email tidak valid").required("Email wajib diisi"),

  password: yup
    .string()
    .min(6, "Password minimal 6 karakter")
    .required("Password wajib diisi"),

  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Konfirmasi password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});
