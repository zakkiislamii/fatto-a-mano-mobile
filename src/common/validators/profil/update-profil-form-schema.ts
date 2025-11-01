import * as yup from "yup";

const phoneTransform = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  const s = String(value).trim();
  return s === "" ? undefined : s;
};

export const UpdateProfilFormSchema = yup.object({
  nama: yup
    .string()
    .transform((v) => {
      if (v === null || v === undefined) return undefined;
      return typeof v === "string" ? v.trim() : String(v).trim();
    })
    .max(100, "Maksimal 100 karakter")
    .notRequired(),

  nomor_hp: yup
    .string()
    .transform(phoneTransform)
    .matches(
      /^(\+?62\d{7,15}|0\d{7,15})$/,
      "Format nomor HP tidak valid (gunakan +62… atau 08…)"
    )
    .notRequired(),
});
