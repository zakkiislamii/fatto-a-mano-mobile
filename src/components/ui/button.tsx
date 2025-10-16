import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  className,
  textClassName,
}: ButtonProps & { textClassName?: string }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center ${className} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" className="mr-2" />
      ) : disabled ? (
        <AntDesign name="close" size={24} color="white" />
      ) : (
        <Text className={textClassName}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
