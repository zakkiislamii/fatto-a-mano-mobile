import { UserRole } from "@/src/common/enums/user-role";
import { auth, db } from "@/src/configs/firebase-config";
import { IAuthRepository } from "@/src/domain/repositories/auth/i-auth-repository";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

export class AuthRepositoryImpl implements IAuthRepository {
  public async register(email: string, password: string): Promise<void> {
    try {
      if (!email || !password) {
        throw new Error("Email dan password wajib diisi.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          email: email.trim(),
          role: UserRole.karyawan,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        },
        { merge: true }
      );
    } catch (error: unknown) {
      console.error("[AuthRepository] Register error:", error);
      throw error;
    }
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: unknown) {
      console.error("[AuthRepository] Login error:", error);
      throw error;
    }
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const { data } = await GoogleSignin.signIn();

      if (!data?.idToken) {
        throw new Error("Terjadi masalah! Silahkan coba lagi");
      }

      const googleCredential = GoogleAuthProvider.credential(data.idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const userData = {
        email: userCredential.user.email || data.user.email,
        nama: userCredential.user.displayName || data.user.name || "",
        updated_at: Timestamp.now(),
      };

      if (!userDocSnap.exists()) {
        await setDoc(
          userDocRef,
          {
            uid: userCredential.user.uid,
            ...userData,
            role: UserRole.karyawan,
            created_at: Timestamp.now(),
          },
          { merge: true }
        );
      } else {
        await setDoc(userDocRef, userData, { merge: true });
      }
    } catch (error: unknown) {
      console.error("[AuthRepository] Google login error:", error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await Promise.allSettled([signOut(auth), GoogleSignin.signOut()]);
    } catch (error: unknown) {
      console.error("[AuthRepository] Logout error:", error);
      throw error;
    }
  }
}
