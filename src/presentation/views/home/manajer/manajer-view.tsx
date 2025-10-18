import React from "react";
import { Text, View } from "react-native";

interface ManajerViewProps {
  screenBg: string;
  isDark: boolean;
}

const ManajerView = ({ screenBg, isDark }: ManajerViewProps) => {
  return (
    <View className={`flex-1 ${screenBg} justify-center items-center`}>
      <Text className={isDark ? "text-white" : "text-black"}>
        Halaman Manajer
      </Text>
    </View>
  );
};
export default ManajerView;
