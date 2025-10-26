import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useRouter, useSegments } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import useProfilLengkap from "../hooks/use-lengkapi-profil";

const IGNORED_ROUTES = ["login", "register", "lengkapi-profil"];

interface ProfilCompletionContextProps {
  children: ReactNode;
}

function LengkapiProfilContext({ children }: ProfilCompletionContextProps) {
  const { user, uid, isLoading: authLoading } = useFirebaseAuth();
  const { isComplete, loading: profileLoading } = useProfilLengkap(uid);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) return;

    const root = segments[0];
    if (!root) return;

    const isIgnored = IGNORED_ROUTES.includes(root);

    if (isComplete === false && !isIgnored) {
      router.replace("/lengkapi-profil");
      return;
    }

    if (isComplete === true && root === "lengkapi-profil") {
      router.replace("/(tabs)");
      return;
    }
  }, [user, isComplete, authLoading, profileLoading, segments, router, uid]);

  return <>{children}</>;
}

export default LengkapiProfilContext;
