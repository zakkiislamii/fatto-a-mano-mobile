import { Colors } from "@/src/common/constants/theme";
import { UserRole } from "@/src/common/enums/user-role";
import { HapticTab } from "@/src/components/haptic-tab";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { role } = useFirebaseAuth();
  const isManagement = role === UserRole.MANAJER;
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
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="jadwal"
        options={{
          title: "Jadwal",
          href: !isManagement ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "calendar-alt" : "calendar"}
              size={28}
              color={color}
            />
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
              name={focused ? "assignment-add" : "assignment"}
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
        name="verifikasi"
        options={{
          title: "Verifikasi",
          href: isManagement ? undefined : null,
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "verified" : "verified-user"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
