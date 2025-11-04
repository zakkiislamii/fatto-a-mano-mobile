import * as yup from "yup";

export const UpdateProfilFormSchema = yup.object({
  nama: yup
    .string()
    .transform((v) => {
      if (v === null || v === undefined) return undefined;
      return typeof v === "string" ? v.trim() : String(v).trim();
    })
    .max(100, "Maksimal 100 karakter")
    .notRequired(),
});
