import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BaseModalProps = {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  primaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  isDark: boolean;
};

type WithMessage = { message: string; customContent?: never };
type WithCustomContent = { message?: never; customContent: React.ReactNode };

export type DynamicModalProps = BaseModalProps &
  (WithMessage | WithCustomContent);

export function DynamicModal({
  isVisible,
  title,
  message,
  onClose,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  isDark,
  customContent,
}: DynamicModalProps) {
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const titleColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const bodyColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const secondaryBtnBg = isDark ? "bg-slate-700" : "bg-gray-200";
  const secondaryBtnText = isDark ? "text-slate-200" : "text-gray-700";

  const showCloseX =
    !!primaryButtonText &&
    !!onPrimaryButtonPress &&
    !!secondaryButtonText &&
    !!onSecondaryButtonPress;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Backdrop dengan BlurView */}
        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1 justify-center items-center px-5"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          accessibilityRole="button"
          accessibilityLabel="Tutup modal"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className={`w-full max-w-sm ${cardBg} rounded-2xl p-6 shadow-lg relative`}
          >
            {showCloseX && (
              <TouchableOpacity
                onPress={onClose}
                className="absolute right-3 top-3 p-2 rounded-full z-10"
                accessibilityRole="button"
                accessibilityLabel="Batal"
                style={{ zIndex: 10 }}
              >
                <Feather
                  name="x"
                  size={20}
                  color={isDark ? "#e5e7eb" : "#374151"}
                />
              </TouchableOpacity>
            )}

            <Text
              className={`text-xl font-bold mb-2 ${titleColor} ${
                showCloseX ? "pr-8" : ""
              }`}
            >
              {title}
            </Text>

            {typeof message === "string" ? (
              <Text className={`text-base mb-6 ${bodyColor}`}>{message}</Text>
            ) : (
              <View className="mb-4">{customContent}</View>
            )}

            <View className="flex-row justify-end gap-3 mt-2">
              {secondaryButtonText && onSecondaryButtonPress && (
                <TouchableOpacity
                  className={`px-4 py-2 rounded-md items-center justify-center ${secondaryBtnBg}`}
                  onPress={onSecondaryButtonPress}
                >
                  <Text className={`font-semibold ${secondaryBtnText}`}>
                    {secondaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}

              {primaryButtonText && onPrimaryButtonPress && (
                <TouchableOpacity
                  className={`px-4 py-3 rounded-md items-center justify-center ${buttonBg}`}
                  onPress={onPrimaryButtonPress}
                >
                  <Text className="font-semibold text-white">
                    {primaryButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
