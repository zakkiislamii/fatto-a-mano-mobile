import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useRouter, useSegments } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import useProfilLengkap from "../hooks/use-lengkapi-profil";

const IGNORED_ROUTES = ["login", "register", "lengkapi-profil"];

interface ProfilCompletionContextProps {
  children: ReactNode;
}

const LengkapiProfilContext = ({ children }: ProfilCompletionContextProps) => {
  const { user, uid, isLoading: authLoading } = useFirebaseAuth();
  const { isComplete, loading: profileLoading } = useProfilLengkap(uid);
  const segments = useSegments();
  const router = useRouter();
  console.log("is complete: ", isComplete);

  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) return;

    const current = segments[segments.length - 1];
    if (!current) return;

    const isIgnored = IGNORED_ROUTES.includes(current);
    console.log("isIgnored", isIgnored);
    if (isComplete === false && !isIgnored) {
      router.replace("/lengkapi-profil");
      return;
    }

    if (isComplete === true && current === "lengkapi-profil") {
      router.replace("/(tabs)");
      return;
    }
  }, [user, isComplete, authLoading, profileLoading, segments, router, uid]);

  return <>{children}</>;
};

export default LengkapiProfilContext;
