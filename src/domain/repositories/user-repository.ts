import { db } from "@/src/configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export class UserRepository {
  private readonly uid: string;

  public constructor(uid: string) {
    this.uid = uid;
  }

  public getProfilRealTime(
    cb: (data: Record<string, any> | null) => void
  ): Unsubscribe | null {
    if (!this.uid) return null;

    return onSnapshot(
      doc(db, "users", this.uid),
      (snap) => {
        if (!snap.exists()) {
          cb(null);
          return;
        }
        cb(snap.data() as Record<string, any>);
      },
      (_err) => cb(null)
    );
  }
}
