import { UserRole } from "@/src/common/enums/user-role";
import { Karyawan } from "@/src/common/types/karyawan";
import {
  Unsubscribe,
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export class KaryawanRepository {
  public getAllKaryawanRealTime(
    cb: (data: Karyawan[] | null) => void
  ): Unsubscribe | null {
    try {
      const db = getFirestore();
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
          console.error("Error fetching karyawan:", error);
          cb(null);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error("getAllKaryawanRealTime error:", err);
      return null;
    }
  }
}
