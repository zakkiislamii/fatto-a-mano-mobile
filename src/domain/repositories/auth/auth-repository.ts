import { UserRole } from "@/src/common/enums/user-role";
import { auth, db } from "@/src/configs/firebase-config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export class AuthRepository {
  private email: string;
  private password: string;
  private readonly firebaseAuth: typeof auth;

  public constructor() {
    this.email = "";
    this.password = "";
    this.firebaseAuth = auth;
  }

  public setEmail(email: string) {
    this.email = (email ?? "").trim();
  }

  public setPassword(password: string) {
    this.password = (password ?? "").toString();
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public async register(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        throw new Error("Email dan password wajib diisi.");
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        this.email,
        this.password
      );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          email: this.email,
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
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        },
        {
          merge: true,
        }
      );
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  public async login(): Promise<void> {
    try {
      await signInWithEmailAndPassword(
        this.firebaseAuth,
        this.email,
        this.password
      );
    } catch (error: unknown) {
      console.error(error);
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
      await signInWithCredential(this.firebaseAuth, googleCredential);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await Promise.allSettled([
        signOut(this.firebaseAuth),
        GoogleSignin.signOut(),
      ]);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  }
}
