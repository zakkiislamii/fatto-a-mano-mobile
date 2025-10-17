import { useRouter, useSegments } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import { useFirebaseAuth } from "../hooks/use-auth";

export default function NavigationContext({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useFirebaseAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(tabs)";
    if (!user && inAuthGroup) {
      router.replace("/login");
    } else if (user && !inAuthGroup && segments[0] !== undefined) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  return <>{children}</>;
}
