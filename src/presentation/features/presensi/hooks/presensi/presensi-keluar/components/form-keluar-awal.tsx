import Button from "@/src/components/ui/button";
import React from "react";
import { Controller } from "react-hook-form";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormKeluarAwalProps {
  control: any;
  errors: any;
  handlePickEvidence: () => Promise<void> | void;
  buktiKeluarAwal: string | null;
  isDark: boolean;
  onSubmit: () => Promise<void> | void;
  canSubmit: boolean;
  loading: boolean;
  buttonBg: string;
  primaryText: string;
}

const FormKeluarAwal = ({
  control,
  errors,
  handlePickEvidence,
  buktiKeluarAwal,
  isDark,
  onSubmit,
  canSubmit,
  loading,
  buttonBg,
  primaryText,
}: FormKeluarAwalProps) => {
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const borderColor = errors.alasan_keluar_awal
    ? "border-red-500"
    : isDark
    ? "border-gray-700"
    : "border-gray-300";

  return (
    <View className="gap-4">
      <View>
        <Text className={`mb-2 font-medium ${textSecondary}`}>
          Alasan Keluar Awal
        </Text>
        <Controller
          control={control}
          name="alasan_keluar_awal"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`h-24 p-3 border rounded-lg ${inputBg} ${borderColor} ${primaryText}`}
              placeholder="Tuliskan alasan Anda..."
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              multiline
              numberOfLines={4}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              textAlignVertical="top"
            />
          )}
        />
        {errors.alasan_keluar_awal && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.alasan_keluar_awal.message}
          </Text>
        )}
      </View>
      <View>
        <Text className={`mb-2 font-medium ${textSecondary}`}>Bukti</Text>
        <TouchableOpacity
          onPress={handlePickEvidence}
          className={`border-2 border-dashed rounded-lg p-4 items-center justify-center ${
            isDark ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {buktiKeluarAwal ? (
            <Image
              source={{ uri: buktiKeluarAwal }}
              className="w-full h-32 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <Text className={textSecondary}>Tekan untuk memilih gambar...</Text>
          )}
        </TouchableOpacity>
        {errors.bukti_keluar_awal && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.bukti_keluar_awal.message}
          </Text>
        )}
      </View>
      <Button
        title="Kirim Alasan & Keluar"
        onPress={onSubmit}
        loading={loading}
        disabled={!canSubmit || loading}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-4`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />
    </View>
  );
};

export default FormKeluarAwal;
