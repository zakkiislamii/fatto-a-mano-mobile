import { UserRole } from "@/src/common/enums/user-role";
import { auth, db } from "@/src/configs/firebaseConfig";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { User } from "../models/user";

export class AuthRepository {
  public async register(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const userData: User = {
      uid: userCredential.user.uid,
      email: email,
      nama: "",
      role: UserRole.karyawan,
      divisi: "",
      nik: "",
      nomor_hp: "",
      jadwal: {
        jam_masuk: "",
        jam_keluar: "",
        hariKerja: "",
        isWfh: false,
      },
    };

    await setDoc(
      doc(db, "users", userCredential.user.uid),
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

  public async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { data } = await GoogleSignin.signIn();
      if (!data?.idToken)
        throw new Error("Terjadi masalah! silahkan coba lagi");
      const googleCredential = GoogleAuthProvider.credential(data.idToken);
      await signInWithCredential(auth, googleCredential);
    } catch (error: unknown) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await Promise.allSettled([signOut(auth), GoogleSignin.signOut()]);
    } catch (error: unknown) {
      console.error("Logout Error:", error);
      throw error;
    }
  }
}
