import {
  configureNotifications,
  ensureAndroidChannel,
  requestNotificationPermissions,
  setupNotificationListeners,
} from "@/src/configs/notification";
import toastConfig from "@/src/configs/toast-config";
import LengkapiProfilContext from "@/src/context/lengkapi-profil-context";
import NavigationContext from "@/src/context/navigation-context";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import useGoogleSignin from "@/src/hooks/use-google-signin";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";
import RegisterTokenGate from "./gates/register-token-gate";

export default function RootLayout() {
  useGoogleSignin();
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const [loaded] = useFonts({
    "Poppins-Regular": require("../src/assets/fonts/Poppins-Regular.ttf"),
  });

  useEffect(() => {
    configureNotifications();
    ensureAndroidChannel();
    requestNotificationPermissions();
    const unsub = setupNotificationListeners();
    return () => unsub?.();
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RegisterTokenGate />
          <SafeAreaProvider>
            <NavigationContext>
              <LengkapiProfilContext>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="login" options={{ title: "Login" }} />
                  <Stack.Screen
                    name="register"
                    options={{ title: "Register" }}
                  />
                  <Stack.Screen
                    name="notifikasi"
                    options={{ title: "Notifikasi", headerShown: true }}
                  />
                  <Stack.Screen
                    name="lengkapi-profil"
                    options={{
                      headerShown: false,
                      title: "Lengkapi Profil",
                    }}
                  />
                </Stack>
                <Toast config={toastConfig} />
                <StatusBar style="auto" />
              </LengkapiProfilContext>
            </NavigationContext>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
