import Button from "@/src/components/ui/button";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormEditIzinProps {
  control: any;
  errors: any;
  handlePickEvidence: () => Promise<void> | void;
  buktiPendukung: string | null;
  isDark: boolean;
  onSubmit: () => Promise<void> | void;
  canSubmit: boolean;
  loading: boolean;
  showPickerFor: (field: "start" | "end") => void;
  leaveStartDate: Date | null;
  leaveEndDate: Date | null;
}

const FormEditIzin = ({
  control,
  errors,
  handlePickEvidence,
  buktiPendukung,
  isDark,
  onSubmit,
  canSubmit,
  loading,
  showPickerFor,
  leaveStartDate,
  leaveEndDate,
}: FormEditIzinProps) => {
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const inputBg = isDark ? "bg-gray-900" : "bg-gray-50";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const iconColor = isDark ? "#9CA3AF" : "#6B7280";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const buttonText = "text-white";
  const placeholderColor = isDark ? "#9CA3AF" : "#6B7280";

  const formatDate = (d: Date | null) => {
    if (!d) return "-";
    try {
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d.toISOString().slice(0, 10);
    }
  };

  return (
    <View className="space-y-5">
      {/* Keterangan */}
      <View className={`rounded-lg p-4 mb-3 ${cardBg} border ${borderColor}`}>
        <Text className={`mb-2 font-medium ${textSecondary}`}>
          Keterangan Izin
        </Text>
        <Controller
          control={control}
          name="keterangan"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`min-h-[50px] rounded-lg p-3 ${primaryText} ${
                errors.keterangan ? "border-red-500" : borderColor
              }`}
              placeholder="Tuliskan alasan izin Anda..."
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              textAlignVertical="top"
            />
          )}
        />
        {errors.keterangan && (
          <Text className="text-red-500 text-xs mt-2">
            {errors.keterangan.message}
          </Text>
        )}
      </View>

      {/* Tanggal Mulai / Berakhir */}
      <View className={`rounded-lg p-4 ${cardBg} mb-3 border ${borderColor}`}>
        <View className="flex-row justify-between gap-3">
          <View className="flex-1">
            <Text className={`mb-2 font-medium ${textSecondary}`}>
              Tanggal Mulai
            </Text>
            <TouchableOpacity
              onPress={() => showPickerFor("start")}
              className={`p-3 border rounded-lg flex-row items-center justify-between ${
                errors.tanggal_mulai ? "border-red-500" : borderColor
              }`}
            >
              <Text className={primaryText}>{formatDate(leaveStartDate)}</Text>
              <Feather name="calendar" size={16} color={iconColor} />
            </TouchableOpacity>
            {errors.tanggal_mulai && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.tanggal_mulai.message}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text className={`mb-2 font-medium ${textSecondary}`}>
              Tanggal Berakhir
            </Text>
            <TouchableOpacity
              onPress={() => showPickerFor("end")}
              className={`p-3 border rounded-lg  flex-row items-center justify-between ${
                errors.tanggal_berakhir ? "border-red-500" : borderColor
              }`}
            >
              <Text className={primaryText}>{formatDate(leaveEndDate)}</Text>
              <Feather name="calendar" size={16} color={iconColor} />
            </TouchableOpacity>
            {errors.tanggal_berakhir && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.tanggal_berakhir.message}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Bukti Pendukung */}
      <View className={`rounded-lg p-4 ${cardBg} border ${borderColor}`}>
        <Text className={`mb-2 font-medium ${textSecondary}`}>
          Bukti Pendukung
        </Text>

        {buktiPendukung ? (
          <TouchableOpacity onPress={handlePickEvidence}>
            <View className="relative">
              <Image
                source={{ uri: buktiPendukung }}
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 8,
                }}
                transition={300}
              />
              <View className="items-center">
                <Text className={`text-sm mt-2 ${textSecondary}`}>
                  Ketuk untuk mengubah gambar
                </Text>
                <Text className={`text-xs mt-1 ${textSecondary} opacity-70`}>
                  Maks. 3MB
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handlePickEvidence}
            className={`rounded-lg p-6 items-center justify-center min-h-[120px] ${inputBg} border ${
              errors.bukti_pendukung ? "border-red-500" : borderColor
            }`}
          >
            <View className="items-center">
              <AntDesign name="upload" size={32} color={iconColor} />
              <Text className={`text-sm mt-2 ${textSecondary}`}>
                Ketuk untuk memilih gambar
              </Text>
              <Text className={`text-xs mt-1 ${textSecondary} opacity-70`}>
                Maks. 3MB
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {errors.bukti_pendukung && (
          // [UBAH] mt-2
          <Text className="text-red-500 text-xs mt-2">
            {errors.bukti_pendukung.message}
          </Text>
        )}
      </View>

      <Button
        title="Simpan Perubahan"
        onPress={onSubmit}
        loading={loading}
        disabled={!canSubmit || loading}
        className={`${buttonBg} py-4 rounded-lg items-center justify-center mt-4 ${
          !canSubmit || loading ? "opacity-50" : ""
        }`}
        textClassName={`font-bold text-lg ${buttonText}`}
      />
    </View>
  );
};

export default FormEditIzin;
