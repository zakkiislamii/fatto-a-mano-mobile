import { useRouter, useSegments } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import { useFirebaseAuth } from "../hooks/use-auth";

const PUBLIC_ROUTES = ["login", "register"];

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
    const root = segments[0];
    if (root === undefined) return;
    const isAuthRoute = PUBLIC_ROUTES.includes(root);
    const isAppRoute = !isAuthRoute;

    if (!user && isAppRoute) {
      router.replace("/login");
      return;
    }

    if (user && isAuthRoute) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, isLoading, segments, router]);

  return <>{children}</>;
}
