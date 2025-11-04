import Button from "@/src/components/ui/button";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

interface FormEditProfilProps {
  control: any;
  errors: any;
  onSubmit: () => void;
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
