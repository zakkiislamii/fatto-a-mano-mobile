import { Karyawan } from "@/src/domain/models/karyawan";
import { Unsubscribe } from "firebase/firestore";

export interface IKaryawanRepository {
  getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null;
}
