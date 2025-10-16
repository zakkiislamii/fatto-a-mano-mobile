import { toastConfig } from "@/src/configs/toastConfig";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useGoogleSignin } from "@/src/hooks/use-google-signin";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { ReactNode, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

function NavigationGuard({ children }: { children: ReactNode }) {
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
  }, [user, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  useGoogleSignin();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "Poppins-Regular": require("../src/assets/fonts/Poppins-Regular.ttf"),
  });
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <NavigationGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="register" options={{ title: "Register" }} />
          </Stack>
          <Toast config={toastConfig} />
          <StatusBar style="auto" />
        </NavigationGuard>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
