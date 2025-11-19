import formatDateToString from "@/src/common/utils/format-date-to-string";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePresensiByDate } from "../../hooks/riwayat/use-presensi-by-date";
import { useRiwayatByMonth } from "../../hooks/riwayat/use-riwayat-by-month";
import { AttendanceDetail } from "./components/attendance-detail";
import CalendarView from "./components/calender-view";

const RiwayatView = ({ uid }: { uid?: string }) => {
  const { uid: currentUserUid } = useFirebaseAuth();
  const targetUid = uid || currentUserUid;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const selectedDateString = formatDateToString(selectedDate);
  const { riwayat, loading, error } = useRiwayatByMonth(
    uid || "",
    selectedDate
  );
  const { presensi: selectedPresensi } = usePresensiByDate(
    uid || "",
    selectedDateString
  );

  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const barStyleColor = isDark ? "light-content" : "dark-content";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  if (!targetUid) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${screenBg}`}>
        <StatusBar barStyle={barStyleColor} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDark ? "#3f3f9a" : "#2C2C54"}
          />
          <Text className={`mt-3 ${textSecondary}`}>Memuat riwayat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 ${screenBg}`}>
        <StatusBar barStyle={barStyleColor} />
        <View className="flex-1 justify-center items-center p-5">
          <Text className={`text-center text-lg ${textSecondary}`}>
            {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <StatusBar barStyle={barStyleColor} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <CalendarView
          riwayat={riwayat}
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          onDateSelect={setSelectedDate}
          onMonthChange={setCurrentMonth}
          isDark={isDark}
        />
        <AttendanceDetail
          selectedDate={selectedDate}
          selectedPresensi={selectedPresensi}
          isDark={isDark}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RiwayatView;
