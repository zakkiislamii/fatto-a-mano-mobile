import { Karyawan } from "@/src/common/types/karyawan";
import { Unsubscribe } from "firebase/firestore";

export interface IKaryawanRepository {
  getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null;
}
