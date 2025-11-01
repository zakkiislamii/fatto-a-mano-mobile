export interface SheetyResponse {
  sheet1: {
    uid: string;
    email: string;
    nama: string;
    nomorHp: string;
    divisi: string;
    hariKerja: string;
    jamMasuk: string;
    jamKeluar: string;
    isWfa: boolean;
    id: number;
  };
}

export interface SheetyPartialResponse {
  sheet1: Partial<{
    uid: string;
    email: string;
    nama: string;
    nomorHp: string;
    divisi: string;
    hariKerja: string;
    jamMasuk: string;
    jamKeluar: string;
    isWfa: boolean;
    id: number;
  }>;
}
