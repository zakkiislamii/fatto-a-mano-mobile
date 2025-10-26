import type { ProfilKaryawan } from "@/src/common/types/profil-karyawan";
import { UserRepository } from "@/src/domain/repositories/user/user-repository";
import type { Unsubscribe } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export function useProfilLengkap(uid?: string | null) {
  const [profile, setProfile] = useState<ProfilKaryawan | null>(null);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(!!uid);
  const [error, setError] = useState<Error | null>(null);
  const unsubProfileRef = useRef<Unsubscribe | null>(null);
  const unsubCompleteRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    setProfile(null);
    setIsComplete(null);
    setError(null);
    setLoading(!!uid);

    if (unsubProfileRef.current) {
      try {
        unsubProfileRef.current();
      } catch {}
      unsubProfileRef.current = null;
    }
    if (unsubCompleteRef.current) {
      try {
        unsubCompleteRef.current();
      } catch {}
      unsubCompleteRef.current = null;
    }

    if (!uid) {
      setLoading(false);
      return;
    }

    const repo = new UserRepository(uid);

    try {
      unsubProfileRef.current = repo.getProfilRealTime((data) => {
        setProfile(data);
        setLoading(false);
      });

      unsubCompleteRef.current = repo.getLengkapiProfilRealTime((complete) => {
        setIsComplete(complete);
      });
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }

    return () => {
      if (unsubProfileRef.current) {
        try {
          unsubProfileRef.current();
        } catch {}
        unsubProfileRef.current = null;
      }
      if (unsubCompleteRef.current) {
        try {
          unsubCompleteRef.current();
        } catch {}
        unsubCompleteRef.current = null;
      }
    };
  }, [uid]);

  return { profile, isComplete, loading, error };
}

export default useProfilLengkap;
