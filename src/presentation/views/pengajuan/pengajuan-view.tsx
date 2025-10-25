import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTambahPengajuanIzin from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-izin";
import useTambahPengajuanSakit from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-sakit";
import useDaftarPengajuan from "../../hooks/pengajuan/use-daftar-pengajuan";
import FormDateTimePicker from "./components/form-date-time-picker";
import FormIzin from "./components/form-izin";
import FormSakit from "./components/form-sakit";
import PaginationControls from "./components/pagination-controls";
import PengajuanCard from "./components/pengajuan-card";
import usePagination from "./hooks/use-pagination";
import usePengajuanView from "./hooks/use-pengajuan-view";

const PengajuanView = () => {
  const { uid } = useFirebaseAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    loading: loadingTambahSakit,
    buktiPendukung: buktiPendukungSakit,
    handlePickEvidence: handlePickEvidenceSakit,
    canSubmit: canSubmitSakit,
    control: controlSakit,
    errors: errorsSakit,
    showSakitSheet,
    openSakitSheet,
    closeSakitSheet,
    handleTambahPengajuanSakit,
  } = useTambahPengajuanSakit(uid);

  const {
    buktiPendukung,
    handlePickEvidence,
    canSubmit,
    control,
    errors,
    openIzinSheet,
    closeIzinSheet,
    showIzinSheet,
    handleTambahPengajuanIzin,
    loading: loadingTambahIzin,
    showDatePicker,
    showPickerFor,
    onDateChange,
    pickerFor,
    leaveStartDate,
    leaveEndDate,
  } = useTambahPengajuanIzin(uid);

  const {
    showPilihanSheet,
    openSheet,
    handlePilihIzin,
    handlePilihSakit,
    closeSheet,
  } = usePengajuanView(openSakitSheet, openIzinSheet);

  const {
    loading: loadingDaftar,
    pengajuanList,
    handleEdit,
    confirmVisible,
    requestDelete,
    confirmDelete,
    cancelDelete,
    deleting,
  } = useDaftarPengajuan();

  const {
    currentPage,
    paginatedData,
    handleNextPage,
    handlePrevPage,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({
    data: pengajuanList,
    itemsPerPage: 3,
  });

  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  const renderItem = ({ item }: { item: DaftarPengajuan }) => (
    <PengajuanCard
      item={item}
      isDark={isDark}
      onEdit={() => handleEdit(item)}
      onDelete={() => requestDelete(item.id)}
    />
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center mt-20">
      <Text className={`text-lg ${textSecondary} opacity-70`}>
        Belum ada pengajuan.
      </Text>
      <Text className={`${textSecondary} opacity-70`}>
        Tekan "Tambah Pengajuan" untuk memulai.
      </Text>
    </View>
  );

  const modalMessage = deleting
    ? "Menghapus pengajuan... Mohon tunggu."
    : "Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.";

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      {/* HEADER */}
      <View className="px-5 pt-5 pb-3 mb-4">
        <Text className={`text-3xl font-bold ${textPrimary}`}>Pengajuan</Text>
      </View>

      <View className="flex-1 px-5">
        {loadingDaftar ? (
          <ActivityIndicator
            size="large"
            color={isDark ? "#FFFFFF" : "#000000"}
            className="mt-10"
          />
        ) : (
          <>
            <FlatList
              data={paginatedData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={ListEmptyComponent}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
            {totalItems > 0 && (
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
          </>
        )}
      </View>

      <View className={`p-5 pt-3 border-t ${borderColor}`}>
        <Button
          title="Tambah Pengajuan"
          onPress={openSheet}
          className={`py-4 w-full rounded-xl ${buttonBg}`}
          textClassName={`font-bold text-lg text-white`}
        />
      </View>

      {/* Pilih jenis pengajuan */}
      <DynamicBottomSheet
        isVisible={showPilihanSheet}
        title="Pilih Jenis Pengajuan"
        onClose={closeSheet}
        isDark={isDark}
        primaryButtonText="Pengajuan Sakit"
        onPrimaryButtonPress={handlePilihSakit}
        secondaryButtonText="Pengajuan Izin"
        onSecondaryButtonPress={handlePilihIzin}
      />

      {/* Sakit */}
      <DynamicBottomSheet
        isVisible={showSakitSheet}
        title="Formulir Pengajuan Sakit"
        onClose={closeSakitSheet}
        isDark={isDark}
        customContent={
          <FormSakit
            control={controlSakit}
            errors={errorsSakit}
            handlePickEvidence={handlePickEvidenceSakit}
            buktiPendukung={buktiPendukungSakit}
            isDark={isDark}
            onSubmit={handleTambahPengajuanSakit}
            canSubmit={canSubmitSakit}
            loading={loadingTambahSakit}
          />
        }
      />

      {/* Izin */}
      <DynamicBottomSheet
        isVisible={showIzinSheet}
        title="Formulir Pengajuan Izin"
        onClose={closeIzinSheet}
        isDark={isDark}
        customContent={
          <FormIzin
            control={control}
            errors={errors}
            handlePickEvidence={handlePickEvidence}
            buktiPendukung={buktiPendukung}
            isDark={isDark}
            onSubmit={handleTambahPengajuanIzin}
            canSubmit={canSubmit}
            loading={loadingTambahIzin}
            showPickerFor={showPickerFor}
            leaveStartDate={leaveStartDate}
            leaveEndDate={leaveEndDate}
          />
        }
      />

      {showDatePicker && (
        <View>
          <FormDateTimePicker
            pickerFor={pickerFor}
            leaveStartDate={leaveStartDate}
            leaveEndDate={leaveEndDate}
            onDateChange={onDateChange}
          />
        </View>
      )}

      <DynamicModal
        isVisible={confirmVisible}
        title="Konfirmasi Hapus"
        message={modalMessage}
        onClose={cancelDelete}
        primaryButtonText={deleting ? "Menghapus..." : "Hapus"}
        onPrimaryButtonPress={confirmDelete}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={cancelDelete}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default PengajuanView;
