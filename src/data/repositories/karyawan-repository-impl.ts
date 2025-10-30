import { UserRole } from "@/src/common/enums/user-role";
import { Karyawan } from "@/src/common/types/karyawan";
import { db } from "@/src/configs/firebase-config";
import { IKaryawanRepository } from "@/src/domain/repositories/i-karyawan-repository";
import {
  Unsubscribe,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export class KaryawanRepositoryImpl implements IKaryawanRepository {
  public getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", UserRole.karyawan)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const karyawanList: Karyawan[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as Karyawan),
            uid: doc.id,
          }));
          cb(karyawanList);
        },
        (error) => {
          console.error("[KaryawanRepository] Error fetching karyawan:", error);
          cb(null);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("[KaryawanRepository] getAllKaryawanRealTime error:", err);
      return null;
    }
  }
}
