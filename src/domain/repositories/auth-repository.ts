import { db } from "@/src/configs/firebaseConfig";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { User } from "../models/user";

export class AuthRepository {
  public async register(uid: string, userData: User): Promise<void> {
    await setDoc(
      doc(db, "users", uid),
      {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );
  }
}
