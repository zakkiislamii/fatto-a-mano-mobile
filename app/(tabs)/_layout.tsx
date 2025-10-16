import { Colors } from "@/src/common/constants/theme";
import { HapticTab } from "@/src/components/haptic-tab";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { role } = useFirebaseAuth();
  const isManagement = role === "manajer";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jadwal"
        options={{
          title: "Jadwal",
          href: !isManagement ? undefined : null,
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pengajuan"
        options={{
          title: "Pengajuan",
          href: !isManagement ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "assignment-turned-in" : "assignment"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          href: !isManagement ? undefined : null,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="history" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={28}
              name={focused ? "person.fill" : "person"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
