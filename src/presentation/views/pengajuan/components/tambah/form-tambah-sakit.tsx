import Button from "@/src/components/ui/button";
import { Image } from "expo-image";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormSakitProps {
  control: Control<{ keterangan: string; bukti_pendukung: string }>;
  errors: FieldErrors<{ keterangan: string; bukti_pendukung: string }>;
  handlePickEvidence: () => Promise<void> | void;
  buktiPendukung: string | null;
  isDark: boolean;
  onSubmit: () => Promise<void> | void;
  canSubmit: boolean;
  loading: boolean;
}

const FormTambahSakit = ({
  control,
  errors,
  handlePickEvidence,
  buktiPendukung,
  isDark,
  onSubmit,
  canSubmit,
  loading,
}: FormSakitProps) => {
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const buttonBg = isDark ? "bg-blue-600" : "bg-blue-500";
  const buttonText = "text-white";
  const placeholderColor = isDark ? "#9CA3AF" : "#6B7280";

  const borderColorKeterangan = errors.keterangan
    ? "border-red-500"
    : isDark
    ? "border-gray-700"
    : "border-gray-300";

  return (
    <View className="gap-4">
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
        enableOnAndroid
      >
        {/* Keterangan */}
        <View>
          <Text className={`mb-2 font-medium ${textSecondary}`}>
            Keterangan Sakit
          </Text>
          <Controller
            control={control}
            name="keterangan"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-24 p-3 border rounded-lg ${inputBg} mb-4 ${borderColorKeterangan} ${primaryText}`}
                placeholder="Tuliskan keterangan sakit Anda..."
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
            <Text className="text-red-500 text-xs mt-1">
              {errors.keterangan.message}
            </Text>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Bukti Pendukung */}
      <View>
        <Text className={`mb-2 font-medium ${textSecondary}`}>
          Bukti Pendukung
        </Text>
        <TouchableOpacity
          onPress={handlePickEvidence}
          className={`border-2 mb-1 border-dashed rounded-lg p-4 items-center justify-center ${
            isDark ? "border-gray-600" : "border-gray-300"
          }`}
        >
          {buktiPendukung ? (
            <Image
              source={{ uri: buktiPendukung }}
              style={{
                width: "100%",
                height: 220,
                borderRadius: 8,
              }}
              transition={300}
            />
          ) : (
            <Text className={textSecondary}>Tekan untuk memilih gambar...</Text>
          )}
        </TouchableOpacity>
        {errors.bukti_pendukung && (
          <Text className="text-red-500 text-xs mt-1">
            {errors.bukti_pendukung.message}
          </Text>
        )}
      </View>

      {/* Submit Button */}
      <Button
        title="Konfirmasi & Ajukan Sakit"
        onPress={onSubmit}
        loading={loading}
        disabled={!canSubmit || loading}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-4`}
        textClassName={`font-bold text-lg ${buttonText}`}
      />
    </View>
  );
};

export default FormTambahSakit;
