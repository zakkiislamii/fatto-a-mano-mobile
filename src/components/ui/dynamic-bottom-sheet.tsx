import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

type BaseBottomSheetProps = {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  primaryButtonText?: string;
  onPrimaryButtonPress?: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
  isDark: boolean;
  message?: string;
  customContent?: React.ReactNode;
};

export type DynamicBottomSheetProps = BaseBottomSheetProps;

export function DynamicBottomSheet({
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
}: DynamicBottomSheetProps) {
  const bgColor = isDark ? "bg-cardDark" : "bg-cardLight";
  const titleColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const bodyColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const secondaryBtnBg = isDark ? "bg-slate-700" : "bg-gray-200";
  const secondaryBtnText = isDark ? "text-slate-200" : "text-gray-700";
  const handleColor = isDark ? "bg-gray-600" : "bg-gray-300";

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={styles.modal}
      backdropOpacity={0.4}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View
        className={`rounded-t-2xl p-5 ${bgColor}`}
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <View
          className={`w-12 h-1.5 rounded-full self-center mb-4 ${handleColor}`}
        />

        <TouchableOpacity
          className="absolute top-3 right-8 z-10 p-1"
          onPress={onClose}
        >
          <Text className={`text-4xl ${bodyColor}`}>×</Text>
        </TouchableOpacity>

        <Text className={`text-xl font-bold text-center mb-4 ${titleColor}`}>
          {title}
        </Text>

        {message ? (
          <Text className={`text-base mb-6 text-center ${bodyColor}`}>
            {message}
          </Text>
        ) : customContent ? (
          <View className="mb-4">{customContent}</View>
        ) : null}

        <View className="flex-col gap-3 mt-2">
          {primaryButtonText && onPrimaryButtonPress && (
            <TouchableOpacity
              className={`w-full py-3 rounded-lg items-center justify-center ${buttonBg}`}
              onPress={onPrimaryButtonPress}
            >
              <Text className="font-semibold text-white">
                {primaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
          {secondaryButtonText && onSecondaryButtonPress && (
            <TouchableOpacity
              className={`w-full py-3 rounded-lg items-center justify-center ${secondaryBtnBg}`}
              onPress={onSecondaryButtonPress}
            >
              <Text className={`font-semibold ${secondaryBtnText}`}>
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
