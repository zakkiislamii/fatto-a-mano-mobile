import toastConfig from "@/src/configs/toastConfig";
import NavigationContext from "@/src/context/navigation-context";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import useGoogleSignin from "@/src/hooks/use-google-signin";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";

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
        <NavigationContext>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="register" options={{ title: "Register" }} />
            <Stack.Screen
              name="edit-profil"
              options={{ title: "Edit Profil", headerShown: true }}
            />
          </Stack>
          <Toast config={toastConfig} />
          <StatusBar style="auto" />
        </NavigationContext>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
