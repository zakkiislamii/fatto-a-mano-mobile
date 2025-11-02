import { formatDate } from "@/src/common/utils/format-date";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface RekapDatePickerProps {
  tanggalMulai: Date;
  tanggalAkhir: Date;
  onTanggalMulaiChange: (date: Date) => void;
  onTanggalAkhirChange: (date: Date) => void;
  isDark: boolean;
}

const RekapDatePicker = ({
  tanggalMulai,
  tanggalAkhir,
  onTanggalMulaiChange,
  onTanggalAkhirChange,
  isDark,
}: RekapDatePickerProps) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const inputBg = isDark ? "bg-slate-700" : "bg-gray-100";
  const inputBorder = isDark ? "border-slate-600" : "border-gray-300";

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      onTanggalMulaiChange(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      onTanggalAkhirChange(selectedDate);
    }
  };

  return (
    <View className="gap-y-4">
      {/* Tanggal Mulai */}
      <View>
        <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
          Tanggal Mulai
        </Text>
        <TouchableOpacity
          className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
          onPress={() => setShowStartPicker(true)}
        >
          <Text className={textPrimary}>{formatDate(tanggalMulai)}</Text>
          <Feather
            name="calendar"
            size={20}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={tanggalMulai}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
        />
      )}

      {/* Tanggal Akhir */}
      <View>
        <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
          Tanggal Akhir
        </Text>
        <TouchableOpacity
          className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
          onPress={() => setShowEndPicker(true)}
        >
          <Text className={textPrimary}>{formatDate(tanggalAkhir)}</Text>
          <Feather
            name="calendar"
            size={20}
            color={isDark ? "#9ca3af" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>

      {showEndPicker && (
        <DateTimePicker
          value={tanggalAkhir}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
          minimumDate={tanggalMulai}
        />
      )}
    </View>
  );
};

export default RekapDatePicker;
