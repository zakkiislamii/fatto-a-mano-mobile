export interface PresensiKeluar {
  waktu: string;
  lembur: boolean;
  durasi_lembur?: string;
  keluarAwal: boolean;
  alasan_keluar_awal?: string;
  bukti_keluar_awal?: string;
}
