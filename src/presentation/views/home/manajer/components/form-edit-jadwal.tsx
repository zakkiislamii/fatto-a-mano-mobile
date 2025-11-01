import { HARI_OPTIONS } from "@/src/common/constants/constants";
import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import { parseTimeToDate } from "@/src/common/utils/parse-time-to-date";
import Button from "@/src/components/ui/button";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FormEditJadwalProps {
  control: Control<JadwalKaryawan>;
  errors: FieldErrors<JadwalKaryawan>;
  onSubmit: () => void;
  canSubmit: boolean;
  loading: boolean;
  isDark: boolean;
  watch: (name: keyof JadwalKaryawan) => any;
  showJamMasukPicker: boolean;
  showJamKeluarPicker: boolean;
  openJamMasukPicker: () => void;
  openJamKeluarPicker: () => void;
  selectedHari: number[];
  toggleHari: (day: number) => void;
  handleTimeChange: (
    selectedDate: Date | undefined,
    field: "jam_masuk" | "jam_keluar"
  ) => void;
}

const FormEditJadwal = ({
  control,
  errors,
  onSubmit,
  canSubmit,
  loading,
  isDark,
  watch,
  showJamMasukPicker,
  showJamKeluarPicker,
  openJamMasukPicker,
  openJamKeluarPicker,
  selectedHari,
  toggleHari,
  handleTimeChange,
}: FormEditJadwalProps) => {
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-slate-700" : "bg-gray-100";
  const inputBorder = isDark ? "border-slate-600" : "border-gray-300";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="gap-y-4">
        {/* Jam Masuk */}
        <View>
          <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
            Jam Masuk
          </Text>
          <Controller
            control={control}
            name="jam_masuk"
            render={({ field: { value } }) => (
              <TouchableOpacity
                className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
                onPress={openJamMasukPicker}
              >
                <Text className={value ? textPrimary : textSecondary}>
                  {value || "Pilih jam masuk"}
                </Text>
                <Feather
                  name="clock"
                  size={20}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            )}
          />
          {errors.jam_masuk && (
            <Text className="text-danger-light text-xs mt-1">
              {errors.jam_masuk.message}
            </Text>
          )}
        </View>

        {showJamMasukPicker && (
          <DateTimePicker
            value={parseTimeToDate(watch("jam_masuk") || "08:00")}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => handleTimeChange(date, "jam_masuk")}
          />
        )}

        {/* Jam Keluar */}
        <View>
          <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
            Jam Keluar
          </Text>
          <Controller
            control={control}
            name="jam_keluar"
            render={({ field: { value } }) => (
              <TouchableOpacity
                className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
                onPress={openJamKeluarPicker}
              >
                <Text className={value ? textPrimary : textSecondary}>
                  {value || "Pilih jam keluar"}
                </Text>
                <Feather
                  name="clock"
                  size={20}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>
            )}
          />
          {errors.jam_keluar && (
            <Text className="text-danger-light text-xs mt-1">
              {errors.jam_keluar.message}
            </Text>
          )}
        </View>

        {showJamKeluarPicker && (
          <DateTimePicker
            value={parseTimeToDate(watch("jam_keluar") || "17:00")}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => handleTimeChange(date, "jam_keluar")}
          />
        )}

        {/* Hari Kerja */}
        <View>
          <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
            Hari Kerja
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {HARI_OPTIONS.map((hari) => (
              <TouchableOpacity
                key={hari.value}
                className={`px-4 py-2 rounded-lg border ${
                  selectedHari.includes(hari.value)
                    ? `${buttonBg} border-transparent`
                    : `${inputBorder} border`
                }`}
                onPress={() => toggleHari(hari.value)}
              >
                <Text
                  className={
                    selectedHari.includes(hari.value)
                      ? "text-white font-semibold"
                      : textSecondary
                  }
                >
                  {hari.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.hari_kerja && (
            <Text className="text-danger-light text-xs mt-1">
              {errors.hari_kerja.message}
            </Text>
          )}
        </View>

        {/* WFA Toggle */}
        <View>
          <Controller
            control={control}
            name="is_wfa"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => onChange(!value)}
              >
                <View
                  className={`w-5 h-5 border-2 rounded ${
                    value
                      ? `${buttonBg} border-transparent`
                      : `${inputBorder} border`
                  } items-center justify-center mr-3`}
                >
                  {value && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className={`${textPrimary} font-medium`}>
                  Work From Anywhere (WFA)
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Submit Button */}
        <Button
          title="Simpan Perubahan"
          onPress={onSubmit}
          disabled={!canSubmit}
          loading={loading}
          className={`${buttonBg} py-3 rounded-lg mt-2`}
          textClassName="text-white font-bold text-base"
        />
      </View>
    </ScrollView>
  );
};

export default FormEditJadwal;
