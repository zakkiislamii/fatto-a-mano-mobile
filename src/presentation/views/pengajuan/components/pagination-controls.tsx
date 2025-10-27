import React from "react";
import { Pressable, Text, View } from "react-native";

interface PaginationControlsProps {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  isDark: boolean;
}

const PaginationControls = ({
  currentPage,
  handlePrevPage,
  handleNextPage,
  hasPrevPage,
  hasNextPage,
  startIndex,
  endIndex,
  totalItems,
  isDark,
}: PaginationControlsProps) => {
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  const buttonBg = isDark ? "bg-gray-700" : "bg-gray-200";
  const buttonIconColor = isDark
    ? "text-textPrimaryDark"
    : "text-textPrimaryLight";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";

  return (
    <View className="mb-4">
      <View
        className={`flex-row items-center justify-between px-5 py-3 ${borderColor}`}
      >
        <View className="w-10 h-10">
          {hasPrevPage && (
            <Pressable onPress={handlePrevPage}>
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${buttonBg}`}
              >
                <Text className={`text-xl font-bold ${buttonIconColor}`}>
                  {"<"}
                </Text>
              </View>
            </Pressable>
          )}
        </View>

        <View className="flex-1 items-center px-4">
          <Text className={`${textPrimary} font-semibold text-base`}>
            Halaman {currentPage}
          </Text>
        </View>

        <View className="w-10 h-10">
          {hasNextPage && (
            <Pressable onPress={handleNextPage}>
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${buttonBg}`}
              >
                <Text className={`text-xl font-bold ${buttonIconColor}`}>
                  {">"}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </View>
      <Text className={`text-center text-sm ${textSecondary}`}>
        Menampilkan {startIndex} - {endIndex} dari {totalItems} pengajuan
      </Text>
    </View>
  );
};

export default PaginationControls;
