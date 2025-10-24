import Button from "@/src/components/ui/button";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormEditProfilProps {
  control: any;
  errors: any;
  onSubmit: () => Promise<void> | void;
  canSubmit: boolean;
  loading: boolean;
  isDark?: boolean;
}

const FormEditProfil = ({
  control,
  errors,
  onSubmit,
  canSubmit,
  loading,
  isDark = false,
}: FormEditProfilProps) => {
  const placeholderColor = isDark ? "#9ca3af" : "#64748b";
  const inputBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const primaryText = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";

  return (
    <View className="gap-4">
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Nama */}
        <View className="mb-2">
          <Text
            className={`mb-2 font-medium ${
              isDark ? "text-textSecondaryDark" : "text-textSecondaryLight"
            }`}
          >
            Nama Lengkap
          </Text>
          <View
            className={`flex-row items-center rounded-lg border ${inputBg} ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <Feather
              name="user"
              size={20}
              color={placeholderColor}
              style={{ marginLeft: 12 }}
            />
            <Controller
              control={control}
              name="nama"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  className={`flex-1 p-4 ml-2 text-base ${primaryText}`}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={placeholderColor}
                  value={value ?? ""}
                  onChangeText={(text) => onChange(text)}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  editable={!loading}
                />
              )}
            />
          </View>
          {errors?.nama?.message && (
            <Text className="mt-1 text-danger-light dark:text-danger-dark">
              {String(errors.nama.message)}
            </Text>
          )}
        </View>

        {/* NIK */}
        <View className="mb-2">
          <Text
            className={`mb-2 font-medium ${
              isDark ? "text-textSecondaryDark" : "text-textSecondaryLight"
            }`}
          >
            NIK
          </Text>
          <View
            className={`flex-row items-center rounded-lg border ${inputBg} ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <Feather
              name="hash"
              size={20}
              color={placeholderColor}
              style={{ marginLeft: 12 }}
            />
            <Controller
              control={control}
              name="nik"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  className={`flex-1 p-4 ml-2 text-base ${primaryText}`}
                  placeholder="Masukkan 16 digit NIK"
                  placeholderTextColor={placeholderColor}
                  keyboardType="number-pad"
                  value={value ?? ""}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D+/g, "");
                    onChange(cleaned);
                  }}
                  onBlur={onBlur}
                  editable={!loading}
                  maxLength={16}
                />
              )}
            />
          </View>
          {errors?.nik?.message && (
            <Text className="mt-1 text-danger-light dark:text-danger-dark">
              ❌ {String(errors.nik.message)}
            </Text>
          )}
        </View>

        {/* Nomor HP */}
        <View className="mb-2">
          <Text
            className={`mb-2 font-medium ${
              isDark ? "text-textSecondaryDark" : "text-textSecondaryLight"
            }`}
          >
            Nomor HP
          </Text>
          <View
            className={`flex-row items-center rounded-lg border ${inputBg} ${
              isDark ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <Feather
              name="phone"
              size={20}
              color={placeholderColor}
              style={{ marginLeft: 12 }}
            />
            <Controller
              control={control}
              name="nomor_hp"
              render={({ field: { value, onChange, onBlur } }) => (
                <TextInput
                  className={`flex-1 p-4 ml-2 text-base ${primaryText}`}
                  placeholder="Contoh: 08123456789"
                  placeholderTextColor={placeholderColor}
                  keyboardType="phone-pad"
                  value={value ?? ""}
                  onChangeText={(text) => {
                    const cleaned = text.replace(/\D+/g, "");
                    onChange(cleaned);
                  }}
                  onBlur={onBlur}
                  editable={!loading}
                />
              )}
            />
          </View>
          {errors?.nomor_hp?.message && (
            <Text className="mt-1 text-danger-light dark:text-danger-dark">
              ❌ {String(errors.nomor_hp.message)}
            </Text>
          )}
        </View>

        {/* Submit */}
        <View className="mt-4">
          <Button
            title="Simpan Perubahan"
            onPress={onSubmit}
            loading={loading}
            disabled={!canSubmit || loading}
            className="w-full py-4 rounded-xl bg-button-light dark:bg-button-dark disabled:opacity-50"
            textClassName="text-white font-bold text-base"
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default FormEditProfil;
