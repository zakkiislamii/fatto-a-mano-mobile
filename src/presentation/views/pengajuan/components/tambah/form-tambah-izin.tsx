import Button from "@/src/components/ui/button";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormIzinProps {
  control: Control<{
    keterangan: string;
    bukti_pendukung: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
  }>;
  errors: FieldErrors<{
    keterangan: string;
    bukti_pendukung: string;
    tanggal_mulai: string;
    tanggal_berakhir: string;
  }>;
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

const FormTambahIzin = ({
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
}: FormIzinProps) => {
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

  const formatDate = (d: Date | null) => {
    if (!d) return "-";
    try {
      return d.toLocaleDateString("id-ID");
    } catch {
      return d.toISOString().slice(0, 10);
    }
  };

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
            Keterangan Izin
          </Text>
          <Controller
            control={control}
            name="keterangan"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`h-24 p-3 mb-5 border rounded-lg ${inputBg} ${borderColorKeterangan} ${primaryText}`}
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
            <Text className="text-red-500 text-xs mt-1">
              {errors.keterangan.message}
            </Text>
          )}
        </View>

        {/* Tanggal Mulai / Berakhir */}
        <View className="flex-row justify-between gap-3 mb-5">
          <View className="flex-1">
            <Text className={`mb-2 font-medium ${textSecondary}`}>
              Tanggal Mulai
            </Text>
            <TouchableOpacity
              onPress={() => showPickerFor("start")}
              className={`p-3 border rounded-lg ${
                isDark ? "border-gray-700" : "border-gray-300"
              } ${inputBg}`}
            >
              <Text className={primaryText}>{formatDate(leaveStartDate)}</Text>
            </TouchableOpacity>
            {errors.tanggal_mulai && (
              <Text className="text-red-500 text-xs mt-1">
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
              className={`p-3 border rounded-lg ${
                isDark ? "border-gray-700" : "border-gray-300"
              } ${inputBg}`}
            >
              <Text className={primaryText}>{formatDate(leaveEndDate)}</Text>
            </TouchableOpacity>
            {errors.tanggal_berakhir && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.tanggal_berakhir.message}
              </Text>
            )}
          </View>
        </View>

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
                className="w-full h-32 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <Text className={textSecondary}>
                Tekan untuk memilih gambar...
              </Text>
            )}
          </TouchableOpacity>
          {errors.bukti_pendukung && (
            <Text className="text-red-500 text-xs mt-1">
              {errors.bukti_pendukung.message}
            </Text>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Submit Button */}
      <Button
        title="Konfirmasi & Ajukan Izin"
        onPress={onSubmit}
        loading={loading}
        disabled={!canSubmit || loading}
        className={`py-4 w-full rounded-xl ${buttonBg} mt-4`}
        textClassName={`font-bold text-lg ${buttonText}`}
      />
    </View>
  );
};

export default FormTambahIzin;
