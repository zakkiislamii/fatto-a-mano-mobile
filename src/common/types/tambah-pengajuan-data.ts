export interface TambahPengajuanIzinData {
  tanggal_pengajuan: string;
  keterangan: string;
  bukti_pendukung: string;
  tanggal_mulai: string;
  tanggal_berakhir: string;
}

export interface TambahPengajuanLemburData {
  tanggal_pengajuan: string;
  keterangan: string;
  bukti_pendukung: string;
  durasi_lembur: string;
}

export interface TambahPengajuanSakitData {
  tanggal_pengajuan: string;
  keterangan: string;
  bukti_pendukung: string;
}
