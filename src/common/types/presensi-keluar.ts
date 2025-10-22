export interface PresensiKeluar {
  waktu: string;
  lembur: boolean;
  durasi_lembur?: string;
  keluar_awal: boolean;
  alasan_keluar_awal?: string;
  bukti_keluar_awal?: string;
}
