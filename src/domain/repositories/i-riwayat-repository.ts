import { Unsubscribe } from "firebase/firestore";
import { Presensi } from "../models/presensi";

export interface IRiwayatRepository {
  getAllPresensiByMonth(
    uid: string,
    year: number,
    month: number,
    cb: (presensiList: Presensi[]) => void
  ): Unsubscribe | null;

  getPresensiByDate(
    uid: string,
    tanggal: string,
    cb: (presensi: Presensi | null) => void
  ): Unsubscribe | null;
}
