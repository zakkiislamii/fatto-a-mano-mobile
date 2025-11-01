import * as yup from "yup";

export const EditJadwalKaryawanFormSchema = yup.object({
  jam_masuk: yup
    .string()
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Format jam masuk tidak valid (HH:MM)"
    )
    .required("Jam masuk wajib diisi"),
  jam_keluar: yup
    .string()
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Format jam keluar tidak valid (HH:MM)"
    )
    .required("Jam keluar wajib diisi"),
  hari_kerja: yup
    .string()
    .max(100, "Maksimal 100 karakter")
    .required("Hari kerja wajib diisi"),
  is_wfa: yup.boolean().required("Status WFA wajib diisi"),
});
