import Button from "@/src/components/ui/button";
import { Image } from "expo-image";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormLemburProps {
  control: any;
  errors: any;
  handlePickEvidence: () => Promise<void> | void;
  buktiPendukung: string | null;
  isDark: boolean;
  onSubmit: () => Promise<void> | void;
  canSubmit: boolean;
  loading: boolean;
  buttonBg: string;
  primaryText: string;
  lemburDurasiMenit: number | null;
}

const FormLembur = ({
  control,
  errors,
  handlePickEvidence,
  buktiPendukung,
  isDark,
  onSubmit,
  canSubmit,
  loading,
  buttonBg,
  primaryText,
  lemburDurasiMenit,
}: FormLemburProps) => {
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const borderColorKeterangan = errors.keterangan
    ? "border-red-500"
    : isDark
    ? "border-gray-700"
    : "border-gray-300";

  return (
    <View className="gap-4">
      {/* Durasi Lembur Display */}
      <View className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <Text className={`text-sm mb-1 ${textSecondary}`}>Durasi Lembur</Text>
        <Text className={`text-3xl font-bold ${primaryText}`}>
          {lemburDurasiMenit ?? 0} menit
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
        enableOnAndroid
      >
        {/* Keterangan */}
        <View>
          <Text className={`mb-2 font-medium ${textSecondary}`}>
            Keterangan Lembur
          </Text>
          <Controller
            control={control}
            name="keterangan"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-24 p-3 border rounded-lg ${inputBg} ${borderColorKeterangan} ${primaryText}`}
                placeholder="Tuliskan keterangan lembur Anda..."
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
          className={`border-2 border-dashed rounded-lg p-4 items-center justify-center ${
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
        title="Konfirmasi & Ajukan Lembur"
        onPress={onSubmit}
        loading={loading}
        disabled={!canSubmit || loading}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-4`}
        textClassName={`font-bold text-lg ${primaryText}`}
      />
    </View>
  );
};

export default FormLembur;
