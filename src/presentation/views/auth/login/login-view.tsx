import Button from "@/src/components/ui/button";
import useLogin from "@/src/presentation/hooks/auth/use-login";
import { useLoginWithGoogle } from "@/src/presentation/hooks/auth/use-login-with-google";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginView = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const secondaryTextColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const inputBorder = isDark ? "border-slate-600" : "border-slate-300";
  const placeholderColor = isDark ? "#9ca3af" : "#64748b";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const {
    control,
    errors,
    canSubmit,
    handleLogin,
    loading,
    submitError,
    isPasswordVisible,
    togglePasswordVisibility,
  } = useLogin();
  const {
    handleLoginWithGoogle,
    loading: googleLoading,
    submitError: googleError,
  } = useLoginWithGoogle();

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          justifyContent: "center",
        }}
        enableOnAndroid
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center p-6">
            {/* App Icon */}
            <View className="items-center mb-8">
              <View
                className={`p-4 rounded-full ${
                  isDark ? "bg-primary-dark" : "bg-white"
                }`}
              >
                <Feather name="lock" size={40} color={buttonBg} />
              </View>
            </View>

            <Text className={`text-3xl font-bold mb-2 ${textColor}`}>
              Selamat Datang Kembali
            </Text>
            <Text className={`text-base mb-4 ${secondaryTextColor}`}>
              Masuk untuk melanjutkan ke akun Anda.
            </Text>

            {/* Error global */}
            {submitError ? (
              <Text className="text-red-500 mb-3">{submitError}</Text>
            ) : null}
            {googleError ? (
              <Text className="text-red-500 mb-3">{googleError}</Text>
            ) : null}

            {/* Email */}
            <View className="mb-4">
              <Text className={`mb-2 font-medium ${secondaryTextColor}`}>
                Email
              </Text>
              <View
                className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-lg`}
              >
                <Feather
                  name="mail"
                  size={20}
                  color={placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`flex-1 ${textColor} p-4 ml-2`}
                      placeholder="masukkan@email.com"
                      placeholderTextColor={placeholderColor}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading && !googleLoading}
                    />
                  )}
                />
              </View>
              {errors.email?.message ? (
                <Text className="text-red-500 mt-1">
                  ❌ {String(errors.email.message)}
                </Text>
              ) : null}
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className={`mb-2 font-medium ${secondaryTextColor}`}>
                Password
              </Text>
              <View
                className={`flex-row items-center border ${inputBorder} ${inputBg} rounded-lg`}
              >
                <Feather
                  name="key"
                  size={20}
                  color={placeholderColor}
                  style={{ marginLeft: 16 }}
                />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      className={`flex-1 ${textColor} p-4 ml-2`}
                      placeholder="********"
                      placeholderTextColor={placeholderColor}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!isPasswordVisible}
                      editable={!loading && !googleLoading}
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
                    color={placeholderColor}
                  />
                </TouchableOpacity>
              </View>
              {errors.password?.message ? (
                <Text className="text-red-500 mt-1">
                  ❌ {String(errors.password.message)}
                </Text>
              ) : null}
            </View>

            {/* Button Login */}
            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-lg ${buttonBg}`}
              textClassName="text-white font-bold text-base"
            />

            {/* Divider */}
            <View className="my-4 flex-row items-center">
              <View
                className={`flex-1 h-[1px] ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
              <Text className={`mx-3 ${secondaryTextColor}`}>atau</Text>
              <View
                className={`flex-1 h-[1px] ${
                  isDark ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            </View>

            {/* Google Button */}
            <TouchableOpacity
              onPress={handleLoginWithGoogle}
              disabled={loading || googleLoading}
              className={`w-full py-4 rounded-lg flex-row items-center justify-center ${
                isDark
                  ? "bg-[#1f2937] border border-gray-700"
                  : "bg-white border border-gray-300"
              } ${(loading || googleLoading) && "opacity-60"}`}
            >
              {googleLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isDark ? "#FFF" : "#2C2C54"}
                />
              ) : (
                <>
                  <AntDesign
                    name="google"
                    size={20}
                    color={isDark ? "#e5e7eb" : "#2C2C54"}
                  />
                  <Text
                    className={`ml-3 font-semibold text-base ${
                      isDark ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    Login dengan Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className={`${textColor}`}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className={`${secondaryTextColor} font-bold underline`}>
                  Daftar sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginView;
