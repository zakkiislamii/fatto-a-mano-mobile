import { Karyawan } from "@/src/common/types/karyawan";
import PaginationControls from "@/src/components/ui/pagination-controls";
import { useKaryawanRealTime } from "@/src/presentation/hooks/karyawan/use-karyawan-realtime";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import KaryawanCard from "./components/karyawan-card";

interface ManajerViewProps {
  screenBg: string;
  isDark: boolean;
}

const ManajerView = ({ screenBg, isDark }: ManajerViewProps) => {
  const {
    loading,
    paginatedData,
    currentPage,
    handleNextPage,
    handlePrevPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    totalItems,
    searchQuery,
    isSearching,
    handleSearchChange,
    handleClearSearch,
  } = useKaryawanRealTime();

  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";

  return (
    <View className={`${screenBg} flex-1`}>
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View
          className={`flex-row items-center ${inputBg} rounded-lg border ${borderColor} px-3`}
        >
          <Text
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            🔍
          </Text>
          <TextInput
            className={`flex-1 py-3 px-3 ${inputText}`}
            placeholder="Cari nama, email, atau NIK..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {isSearching && (
            <TouchableOpacity onPress={handleClearSearch} className="p-1">
              <Text
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {isSearching && (
          <Text
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Ditemukan {totalItems} hasil
          </Text>
        )}
      </View>

      <ScrollView className="px-4 flex-1">
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#888" />
            <Text
              className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Memuat data karyawan...
            </Text>
          </View>
        ) : totalItems === 0 ? (
          <View>
            <Text
              className={`text-center mt-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Karyawan tidak ditemukan
            </Text>
          </View>
        ) : (
          <>
            {paginatedData.map((karyawan: Karyawan, index: number) => {
              const key = karyawan.uid || `karyawan-${index}`;
              return (
                <KaryawanCard key={key} karyawan={karyawan} isDark={isDark} />
              );
            })}
          </>
        )}
      </ScrollView>

      {!loading && totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          isDark={isDark}
        />
      )}
    </View>
  );
};

export default ManajerView;
