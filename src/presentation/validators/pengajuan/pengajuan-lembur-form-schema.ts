import * as yup from "yup";

export const PengajuanLemburFormSchema = yup.object({
  keterangan: yup.string().required("alasan keluar wajib diisi"),
  bukti_pendukung: yup.string().required("bukti keluar wajib diisi"),
});
