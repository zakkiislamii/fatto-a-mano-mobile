import Button from "@/src/components/ui/button";
import { useLoginTheme } from "@/src/hooks/use-login-theme";
import useRegister from "@/src/presentation/hooks/auth/use-register";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterView() {
  const { isDark, styles } = useLoginTheme();
  const {
    control,
    errors,
    onSubmit,
    canSubmit,
    loading,
    submitError,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useRegister();

  return (
    <SafeAreaView className={`flex-1 ${styles.screenBg}`}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
        enableOnAndroid
        extraScrollHeight={60}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center p-6">
            {/* Header Icon */}
            <View className="items-center mb-8">
              <View
                className={`p-4 rounded-full ${
                  isDark ? "bg-primary-dark" : "bg-white"
                }`}
              >
                <Feather name="user-plus" size={40} color={styles.buttonBg} />
              </View>
            </View>

            {/* Title */}
            <Text className={`text-3xl font-bold mb-2 ${styles.textColor}`}>
              Buat Akun Baru
            </Text>
            <Text className={`text-base mb-8 ${styles.secondaryTextColor}`}>
              Daftar untuk dapat masuk ke aplikasi.
            </Text>

            {/* Email */}
            <View className="mb-4">
              <Text className={`mb-2 font-medium ${styles.secondaryTextColor}`}>
                Email
              </Text>
              <View
                className={`flex-row items-center border ${styles.inputBorder} ${styles.inputBg} rounded-lg`}
              >
                <Feather
                  name="mail"
                  size={20}
                  color={styles.placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`flex-1 ${styles.textColor} p-4 ml-2`}
                      placeholder="masukkan@email.com"
                      placeholderTextColor={styles.placeholderColor}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      textContentType="emailAddress"
                      autoComplete="email"
                      editable={!loading}
                    />
                  )}
                />
              </View>
              {errors.email?.message ? (
                <Text className="text-red-500 mt-1 text-sm">
                  ❌ {errors.email.message as string}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className={`mb-2 font-medium ${styles.secondaryTextColor}`}>
                Password
              </Text>
              <View
                className={`flex-row items-center border ${styles.inputBorder} ${styles.inputBg} rounded-lg`}
              >
                <Feather
                  name="key"
                  size={20}
                  color={styles.placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`flex-1 ${styles.textColor} p-4 ml-2`}
                      placeholder="********"
                      placeholderTextColor={styles.placeholderColor}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!isPasswordVisible}
                      textContentType="password"
                      autoComplete="password-new"
                      editable={!loading}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="p-4"
                >
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color={styles.placeholderColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.password?.message ? (
                <Text className="text-red-500 mt-1 text-sm">
                  ❌ {errors.password.message as string}
                </Text>
              ) : null}
            </View>

            {/* Konfirmasi Password */}
            <View className="mb-8">
              <Text className={`mb-2 font-medium ${styles.secondaryTextColor}`}>
                Konfirmasi Password
              </Text>
              <View
                className={`flex-row items-center border ${styles.inputBorder} ${styles.inputBg} rounded-lg`}
              >
                <Feather
                  name="key"
                  size={20}
                  color={styles.placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="confirm_password" // <- sesuai schema
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`flex-1 ${styles.textColor} p-4 ml-2`}
                      placeholder="********"
                      placeholderTextColor={styles.placeholderColor}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!isPasswordVisible} // pakai toggle yg sama
                      textContentType="password"
                      autoComplete="password-new"
                      editable={!loading}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="p-4"
                >
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color={styles.placeholderColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirm_password?.message ? (
                <Text className="text-red-500 mt-1 text-sm">
                  ❌ {errors.confirm_password.message as string}
                </Text>
              ) : null}
            </View>

            {/* Submit */}
            <Button
              title="Daftar"
              onPress={onSubmit}
              loading={loading}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-lg ${styles.buttonBg}`}
              textClassName="text-white font-bold text-base"
            />

            {/* Error global dari submit */}
            {submitError ? (
              <Text className="text-red-500 mt-3 text-center text-sm">
                {submitError}
              </Text>
            ) : null}

            {/* Link to Login */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className={`${styles.secondaryTextColor}`}>
                Sudah punya akun?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="font-bold" style={{ color: styles.buttonBg }}>
                  Masuk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
