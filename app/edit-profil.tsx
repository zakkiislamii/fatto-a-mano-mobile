import Button from "@/src/components/ui/button";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { useGetProfile } from "@/src/presentation/hooks/profile/use-get-profil";
import useUpdateProfil from "@/src/presentation/hooks/profile/use-update-profil";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfilSkeleton = () => (
  <View className="flex-1 p-6 gap-y-6">
    {/* Skeleton Header */}
    <View className="gap-y-2">
      <View className="h-8 w-1/2 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <View className="h-5 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
    </View>
    {/* Skeleton Form */}
    <View className="gap-y-5 mt-4">
      {[...Array(3)].map((_, index) => (
        <View key={index} className="gap-y-2">
          <View className="h-5 w-1/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <View className="h-14 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
        </View>
      ))}
    </View>
    {/* Skeleton Button */}
    <View className="h-14 w-full mt-4 rounded-lg bg-gray-200 dark:bg-gray-700" />
  </View>
);

export default function EditProfilView() {
  const { uid } = useFirebaseAuth();
  const { profilKaryawan, loading: loadingProfil } = useGetProfile(uid ?? null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const placeholderColor = isDark ? "#9ca3af" : "#64748b";
  const {
    control,
    errors,
    canSubmit,
    handleUpdateProfil,
    loading,
    error: submitError,
    showModal,
    closeModal,
    onPress,
  } = useUpdateProfil(uid ?? null, profilKaryawan);

  if (loadingProfil) {
    return (
      <SafeAreaView className="flex-1 bg-screenLight dark:bg-screenDark">
        <EditProfilSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-screenLight dark:bg-screenDark">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 p-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-textPrimaryLight dark:text-textPrimaryDark">
              Perbarui informasi akun Anda di sini.
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-y-5">
            {/* Global Error */}
            {submitError ? (
              <Text className="text-danger-light dark:text-danger-dark mb-2 text-center">
                {submitError}
              </Text>
            ) : null}

            {/* Nama */}
            <View>
              <Text className="mb-2 font-medium text-textSecondaryLight dark:text-textSecondaryDark">
                Nama Lengkap
              </Text>
              <View className="flex-row items-center rounded-lg border bg-cardLight dark:bg-cardDark border-gray-300 dark:border-gray-600">
                <Feather
                  name="user"
                  size={20}
                  color={placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="nama"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className="flex-1 p-4 ml-2 text-base text-textPrimaryLight dark:text-textPrimaryDark"
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor={placeholderColor}
                      value={value ?? ""}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
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
            <View>
              <Text className="mb-2 font-medium text-textSecondaryLight dark:text-textSecondaryDark">
                NIK
              </Text>
              <View className="flex-row items-center rounded-lg border bg-cardLight dark:bg-cardDark border-gray-300 dark:border-gray-600">
                <Feather
                  name="hash"
                  size={20}
                  color={placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="nik"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className="flex-1 p-4 ml-2 text-base text-textPrimaryLight dark:text-textPrimaryDark"
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
            <View>
              <Text className="mb-2 font-medium text-textSecondaryLight dark:text-textSecondaryDark">
                Nomor HP
              </Text>
              <View className="flex-row items-center rounded-lg border bg-cardLight dark:bg-cardDark border-gray-300 dark:border-gray-600">
                <Feather
                  name="phone"
                  size={20}
                  color={placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="nomor_hp"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className="flex-1 p-4 ml-2 text-base text-textPrimaryLight dark:text-textPrimaryDark"
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
            {/* Button Simpan */}
            <Button
              title="Simpan Perubahan"
              onPress={onPress}
              loading={loading}
              disabled={!canSubmit || loading}
              className="w-full py-4 rounded-xl bg-button-light dark:bg-button-dark disabled:opacity-50"
              textClassName="text-white font-bold text-base"
            />
          </View>

          {/* Modal Konfirmasi */}
          <DynamicModal
            isVisible={showModal}
            title="Konfirmasi Perubahan"
            message="Apakah Anda yakin ingin menyimpan perubahan profil ini?"
            onClose={closeModal}
            primaryButtonText="Simpan"
            onPrimaryButtonPress={() => {
              handleUpdateProfil();
            }}
            secondaryButtonText="Batal"
            onSecondaryButtonPress={closeModal}
            isDark={isDark}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
