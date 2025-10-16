import { auth, db } from "@/src/configs/firebaseConfig";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { UserRole } from "../common/enums/user-role";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!mounted) return;

        if (!firebaseUser) {
          setUser(null);
          setRole(null);
          setIsLoading(false);
          return;
        }
        let nextRole: UserRole | null = null;
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          const raw = snap.exists() ? (snap.data().role as unknown) : null;
          if (raw === UserRole.manajer) nextRole = UserRole.manajer;
          else if (raw === UserRole.karyawan) nextRole = UserRole.karyawan;
          else nextRole = null;
        } catch (e) {
          console.error("Gagal ambil user role:", e);
          nextRole = null;
        }

        setUser(firebaseUser);
        setRole(nextRole);
        setIsLoading(false);
      } catch {
        if (!mounted) return;
        setUser(null);
        setRole(null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return {
    user,
    uid: user?.uid,
    role,
    isLoading,
  };
}
