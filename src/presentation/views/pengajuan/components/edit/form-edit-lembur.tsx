import Button from "@/src/components/ui/button";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface FormEditLemburProps {
  control: Control<{ keterangan: string; bukti_pendukung: string }>;
  errors: FieldErrors<{ keterangan: string; bukti_pendukung: string }>;
  handlePickEvidence: () => Promise<void>;
  buktiPendukung: string | null;
  isDark: boolean;
  onSubmit: () => void;
  canSubmit: boolean;
  loading: boolean;
}

const FormEditLembur = ({
  control,
  errors,
  handlePickEvidence,
  buktiPendukung,
  isDark,
  onSubmit,
  canSubmit,
  loading,
}: FormEditLemburProps) => {
  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  return (
    <View className="space-y-4">
      {/* Keterangan */}
      <View>
        <Text className={`text-sm font-medium mb-2 ${inputText}`}>
          Keterangan Lembur
        </Text>
        <Controller
          control={control}
          name="keterangan"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`${inputBg} ${inputText} border mb-4 ${borderColor} rounded-lg px-4 py-3`}
              placeholder="Masukkan keterangan lembur..."
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
          <Text className="text-red-500 text-xs mt-1">
            {errors.keterangan.message as string}
          </Text>
        )}
      </View>

      {/* Bukti Pendukung */}
      <View>
        <Text className={`text-sm font-medium mb-2 ${inputText}`}>
          Bukti Pendukung (Opsional)
        </Text>
        <TouchableOpacity
          onPress={handlePickEvidence}
          className={`border-2 border-dashed ${borderColor} rounded-lg p-4 items-center justify-center min-h-[120px]`}
        >
          {buktiPendukung ? (
            <View className="items-center">
              <Image
                source={{ uri: buktiPendukung }}
                style={{
                  width: 300,
                  height: 200,
                }}
                contentFit="cover"
              />
              <Text className={`text-sm mt-2 ${textSecondary}`}>
                Ketuk untuk mengganti
              </Text>
            </View>
          ) : (
            <View className="items-center">
              <AntDesign
                name="upload"
                size={32}
                color={isDark ? "#9CA3AF" : "#6B7280"}
              />
              <Text className={`text-sm mt-2 ${textSecondary}`}>
                Ketuk untuk memilih gambar
              </Text>
              <Text className={`text-xs mt-1 ${textSecondary} opacity-70`}>
                Maks. 3MB
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.bukti_pendukung && (
          <Text className="text-red-500 text-xs mt-1">
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

export default FormEditLembur;
