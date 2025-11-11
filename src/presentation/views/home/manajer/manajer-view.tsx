import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import PaginationControls from "@/src/components/ui/pagination-controls";
import { Karyawan } from "@/src/domain/models/karyawan";
import { useKaryawanRealTime } from "@/src/presentation/hooks/karyawan/use-karyawan-realtime";
import useRekap from "@/src/presentation/hooks/rekap/use-rekap";
import useSinkronJadwalKerja from "@/src/presentation/hooks/jadwal/use-sinkron-jadwal-kerja";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FormRekapPresensi from "./components/form-rekap-presensi";
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

  const { handleSinkronJadwal, loading: sinkronLoading } =
    useSinkronJadwalKerja();

  const {
    loading: rekapLoading,
    showBottomSheet,
    openBottomSheet,
    closeBottomSheet,
    tanggalMulai,
    tanggalAkhir,
    setTanggalMulai,
    setTanggalAkhir,
    exportFormat,
    setExportFormat,
    handleFetchAndExport,
  } = useRekap();

  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const inputText = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "border-gray-700" : "border-gray-300";
  const exportButtonBg = isDark ? "bg-success-dark-bg" : "bg-success-light";
  const syncButtonBg = isDark ? "bg-info-dark-bg" : "bg-info-light";

  const handleExportRecap = () => {
    openBottomSheet();
  };

  const handleSyncSchedule = async () => {
    await handleSinkronJadwal();
  };

  const handleConfirmFetch = async () => {
    await handleFetchAndExport();
    closeBottomSheet();
  };

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
            placeholder="Cari nama atau email karyawan"
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

      {/* Action Buttons */}
      {!loading && totalItems > 0 && (
        <View className="px-3 pt-2 pb-1 flex-row gap-x-2">
          <TouchableOpacity
            onPress={handleExportRecap}
            disabled={rekapLoading}
            className={`${exportButtonBg} rounded-lg py-3 flex-1 flex-row justify-center items-center ${
              rekapLoading ? "opacity-75" : ""
            }`}
          >
            {rekapLoading ? (
              <>
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                  className="mr-3"
                />
                <Text className="text-white font-bold text-sm">
                  Memproses...
                </Text>
              </>
            ) : (
              <Text className="text-white font-bold text-sm">
                Ekspor Rekap Presensi
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSyncSchedule}
            disabled={sinkronLoading}
            className={`${syncButtonBg} rounded-lg py-3 flex-1 flex-row justify-center items-center ${
              sinkronLoading ? "opacity-75" : ""
            }`}
          >
            {sinkronLoading ? (
              <>
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                  className="mr-3"
                />
                <Text className="text-white font-bold text-sm">
                  Menyinkronkan...
                </Text>
              </>
            ) : (
              <Text className="text-white font-bold text-sm">
                Sinkron Jadwal Kerja
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Pagination Controls */}
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

      {/* Bottom Sheet Rekap */}
      <DynamicBottomSheet
        isVisible={showBottomSheet}
        onClose={closeBottomSheet}
        title="Ekspor Rekap Presensi"
        isDark={isDark}
        customContent={
          <FormRekapPresensi
            tanggalMulai={tanggalMulai}
            tanggalAkhir={tanggalAkhir}
            onTanggalMulaiChange={setTanggalMulai}
            onTanggalAkhirChange={setTanggalAkhir}
            exportFormat={exportFormat}
            onExportFormatChange={setExportFormat}
            isDark={isDark}
          />
        }
        primaryButtonText={rekapLoading ? "Memproses..." : "Ekspor"}
        onPrimaryButtonPress={handleConfirmFetch}
        primaryButtonDisabled={rekapLoading}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={closeBottomSheet}
        secondaryButtonDisabled={rekapLoading}
      />
    </View>
  );
};

export default ManajerView;
