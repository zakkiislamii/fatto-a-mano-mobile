import { UserRole } from "@/src/common/enums/user-role";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useRouter, useSegments } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import useProfilLengkap from "../hooks/use-lengkapi-profil";

const IGNORED_ROUTES = ["login", "register", "lengkapi-profil"];

interface ProfilCompletionContextProps {
  children: ReactNode;
}

const LengkapiProfilContext = ({ children }: ProfilCompletionContextProps) => {
  const { user, uid, isLoading: authLoading, role } = useFirebaseAuth();
  const { isComplete, loading: profileLoading } = useProfilLengkap(uid);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) return;

    const current = segments[segments.length - 1];
    if (!current) return;

    const isIgnored = IGNORED_ROUTES.includes(current);

    if (role === UserRole.MANAJER) {
      if (current === "lengkapi-profil") {
        router.replace("/(tabs)");
      }
      return;
    }

    if (isComplete === false && !isIgnored) {
      router.replace("/lengkapi-profil");
      return;
    }

    if (isComplete === true && current === "lengkapi-profil") {
      router.replace("/(tabs)");
      return;
    }
  }, [
    user,
    isComplete,
    authLoading,
    profileLoading,
    segments,
    router,
    uid,
    role,
  ]);

  return <>{children}</>;
};

export default LengkapiProfilContext;
