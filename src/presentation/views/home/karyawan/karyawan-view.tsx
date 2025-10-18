import MapsView from "@/src/presentation/features/maps/maps-view";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface KaryawanViewProps {
  screenBg: string;
  isDark: boolean;
  uid: string | undefined;
}

const KaryawanView = ({ screenBg, isDark, uid }: KaryawanViewProps) => {
  const router = useRouter();
  return (
    <View className={`${screenBg}`}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="always">
        <View className="bg-primary px-6 pt-6 pb-5 gap-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-2xl text-slate-300">Selamat Datang,</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                className="p-2"
                onPress={() => router.push("/notifikasi")}
                accessibilityLabel="Lihat notifikasi"
              >
                <Feather name="bell" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <MapsView isDark={isDark} />
      </ScrollView>
    </View>
  );
};

export default KaryawanView;
