import MapsView from "@/src/presentation/features/maps/maps-view";
import React from "react";
import { ScrollView, View } from "react-native";

interface KaryawanViewProps {
  screenBg: string;
  isDark: boolean;
  uid: string | undefined;
}

const KaryawanView = ({ screenBg, isDark, uid }: KaryawanViewProps) => {
  return (
    <View className={`${screenBg} justify-center items-center`}>
      <ScrollView
        // contentContainerStyle={{
        //   paddingHorizontal: 24,
        //   paddingTop: 3,
        //   paddingBottom: 180,
        // }}
        showsVerticalScrollIndicator={false}
        overScrollMode="always"
      >
        <MapsView isDark={isDark} />
      </ScrollView>
    </View>
  );
};

export default KaryawanView;
