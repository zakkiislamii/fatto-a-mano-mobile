import * as yup from "yup";

export const PengajuanSakitFormSchema = yup.object({
  keterangan: yup.string().required("keterangan wajib diisi"),
  bukti_pendukung: yup.string().required("bukti pendukung wajib diisi"),
});
