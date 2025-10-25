import Button from "@/src/components/ui/button";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormEditSakitProps {
  control: Control<{ keterangan: string; bukti_pendukung: string }>;
  errors: FieldErrors<{ keterangan: string; bukti_pendukung: string }>;
  handlePickEvidence: () => Promise<void>;
  buktiPendukung: string | null;
  isDark: boolean;
  onSubmit: () => void;
  canSubmit: boolean;
  loading: boolean;
}

const FormEditSakit = ({
  control,
  errors,
  handlePickEvidence,
  buktiPendukung,
  isDark,
  onSubmit,
  canSubmit,
  loading,
}: FormEditSakitProps) => {
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const inputBg = isDark ? "bg-gray-900" : "bg-gray-50";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const iconColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    // [UBAH] space-y-5
    <View className="space-y-5">
      {/* Keterangan */}
      <View className={`rounded-lg mb-4 p-4 ${cardBg} border ${borderColor}`}>
        <Text className={`text-sm font-medium mb-2 ${textSecondary}`}>
          Keterangan Sakit
        </Text>
        <Controller
          control={control}
          name="keterangan"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`min-h-[50px] rounded-lg p-3 ${inputText} `}
              placeholder="Masukkan keterangan sakit..."
              placeholderTextColor={placeholderColor}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.keterangan && (
          <Text className="text-red-500 text-xs mt-2">
            {errors.keterangan.message as string}
          </Text>
        )}
      </View>

      {/* Bukti Pendukung */}
      {/* [UBAH] Dibungkus card */}
      <View className={`rounded-lg p-4 ${cardBg} border ${borderColor}`}>
        <Text className={`text-sm font-medium mb-2 ${textSecondary}`}>
          Bukti Pendukung (Opsional)
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
            className={`rounded-lg p-6 items-center justify-center min-h-[120px] ${inputBg} border ${borderColor}`}
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
            {errors.bukti_pendukung.message as string}
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
        textClassName="font-bold text-lg text-white"
      />
    </View>
  );
};

export default FormEditSakit;
