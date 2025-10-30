import * as yup from "yup";

export const PengajuanIzinFormSchema = yup.object({
  keterangan: yup.string().required("keterangan wajib diisi"),
  bukti_pendukung: yup.string().required("bukti pendukung wajib diisi"),
  tanggal_mulai: yup.string().required("tanggal mulai wajib diisi"),
  tanggal_berakhir: yup.string().required("tanggal berakhir wajib diisi"),
});
