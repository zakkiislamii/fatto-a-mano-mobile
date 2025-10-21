import * as yup from "yup";

export const PresensiKeluarFormSchema = yup.object({
  alasan_keluar_awal: yup.string().required("alasan keluar wajib diisi"),
  bukti_keluar_awal: yup.string().required("bukti keluar wajib diisi"),
});
