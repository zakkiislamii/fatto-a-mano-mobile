import { TipePengajuan } from "@/src/common/enums/tipe-pengajuan";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { DaftarPengajuan } from "@/src/domain/models/daftar-pengajuan";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PaginationControls from "../../../components/ui/pagination-controls";
import usePagination from "../../../hooks/use-pagination";
import useDetailPengajuanIzin from "../../hooks/pengajuan/detail/use-detail-pengajuan-izin";
import useDetailPengajuanLembur from "../../hooks/pengajuan/detail/use-detail-pengajuan-lembur";
import useDetailPengajuanSakit from "../../hooks/pengajuan/detail/use-detail-pengajuan-sakit";
import useEditPengajuanIzin from "../../hooks/pengajuan/edit/use-edit-pengajuan-izin";
import useEditPengajuanLembur from "../../hooks/pengajuan/edit/use-edit-pengajuan-lembur";
import useEditPengajuanSakit from "../../hooks/pengajuan/edit/use-edit-pengajuan-sakit";
import useTambahPengajuanIzin from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-izin";
import useTambahPengajuanSakit from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-sakit";
import useDaftarPengajuan from "../../hooks/pengajuan/use-daftar-pengajuan";
import DetailContentIzin from "./components/detail/detail-content-izin";
import DetailContentLembur from "./components/detail/detail-content-lembur";
import DetailContentSakit from "./components/detail/detail-content-sakit";
import FormEditIzin from "./components/edit/form-edit-izin";
import FormEditLembur from "./components/edit/form-edit-lembur";
import FormEditSakit from "./components/edit/form-edit-sakit";
import FormDateTimePicker from "./components/form-date-time-picker";
import PengajuanCard from "./components/pengajuan-card";
import FormTambahIzin from "./components/tambah/form-tambah-izin";
import FormTambahSakit from "./components/tambah/form-tambah-sakit";
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

  const {
    loadingEditLembur,
    showModalEditLembur,
    showEditLemburSheet,
    closeEditLemburSheet,
    closeModalEditLembur,
    canSubmitEditLembur,
    openEditLemburSheet,
    handlePickEvidenceEditLembur,
    buktiPendukungEditLembur,
    controlEditLembur,
    errorsEditLembur,
    handleEditPengajuanLembur,
    onPressEditLembur,
  } = useEditPengajuanLembur(uid);

  const {
    loadingEditSakit,
    showModalEditSakit,
    showEditSakitSheet,
    openEditSakitSheet,
    closeEditSakitSheet,
    closeModalEditSakit,
    canSubmitEditSakit,
    handlePickEvidenceEditSakit,
    buktiPendukungEditSakit,
    controlEditSakit,
    errorsEditSakit,
    handleEditPengajuanSakit,
    onPressEditSakit,
  } = useEditPengajuanSakit(uid);

  const {
    loadingEditIzin,
    showModalEditIzin,
    showEditIzinSheet,
    openEditIzinSheet,
    closeEditIzinSheet,
    closeModalEditIzin,
    canSubmitEditIzin,
    handlePickEvidenceEditIzin,
    buktiPendukungEditIzin,
    controlEditIzin,
    errorsEditIzin,
    handleEditPengajuanIzin,
    onPressEditIzin,
    showDatePickerEditIzin,
    showPickerForEditIzin,
    onDateChangeEditIzin,
    pickerForEditIzin,
    leaveStartDateEditIzin,
    leaveEndDateEditIzin,
  } = useEditPengajuanIzin(uid);

  const {
    loadingDetailIzin,
    detailIzin,
    showDetailSheetIzin,
    handleViewDetailIzinPress,
    closeDetailIzin,
  } = useDetailPengajuanIzin(uid);

  const {
    loadingDetailLembur,
    detailLembur,
    showDetailSheetLembur,
    handleViewDetailLemburPress,
    closeDetailLembur,
  } = useDetailPengajuanLembur(uid);

  const {
    loadingDetailSakit,
    detailSakit,
    showDetailSheetSakit,
    handleViewDetailSakitPress,
    closeDetailSakit,
  } = useDetailPengajuanSakit(uid);
  console.log("Detail Sakit", detailSakit);
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";

  const handleEditPress = (item: DaftarPengajuan) => {
    if (item.tipe === TipePengajuan.LEMBUR) {
      openEditLemburSheet(item);
      return;
    }
    if (item.tipe === TipePengajuan.SAKIT) {
      openEditSakitSheet(item);
      return;
    }
    if (item.tipe === TipePengajuan.IZIN) {
      openEditIzinSheet(item);
      return;
    }
    openEditLemburSheet(item);
  };

  const handleDetailPress = (item: DaftarPengajuan) => {
    if (item.tipe === TipePengajuan.LEMBUR) {
      handleViewDetailLemburPress(item);
      return;
    }
    if (item.tipe === TipePengajuan.SAKIT) {
      handleViewDetailSakitPress(item);
      return;
    }
    if (item.tipe === TipePengajuan.IZIN) {
      handleViewDetailIzinPress(item);
      return;
    }
    openEditLemburSheet(item);
  };

  const renderItem = ({ item }: { item: DaftarPengajuan }) => (
    <PengajuanCard
      item={item}
      isDark={isDark}
      onEdit={handleEditPress}
      onDelete={() => requestDelete(item.id)}
      onViewDetail={() => handleDetailPress(item)}
    />
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center">
      <Text className={`text-lg ${textSecondary} opacity-70`}>
        Belum ada pengajuan.
      </Text>
      <Text className={`${textSecondary} opacity-70`}>
        Tekan &quot;+&quot; untuk menambah.
      </Text>
    </View>
  );

  const modalMessage = deleting
    ? "Menghapus pengajuan... Mohon tunggu."
    : "Apakah Anda yakin ingin menghapus pengajuan ini? Tindakan ini tidak dapat dibatalkan.";

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <View className="flex-row items-center justify-between px-5 pt-5 pb-3 mb-3">
        <Text className={`text-3xl font-bold ${textPrimary}`}>Pengajuan</Text>
        <TouchableOpacity
          onPress={openSheet}
          className={`p-2 rounded-lg ${buttonBg}`}
        >
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
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
              contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
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

      {/* Tambah Sakit */}
      <DynamicBottomSheet
        isVisible={showSakitSheet}
        title="Formulir Pengajuan Sakit"
        onClose={closeSakitSheet}
        isDark={isDark}
        customContent={
          <FormTambahSakit
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

      {/* Tambah Izin */}
      <DynamicBottomSheet
        isVisible={showIzinSheet}
        title="Formulir Pengajuan Izin"
        onClose={closeIzinSheet}
        isDark={isDark}
        customContent={
          <FormTambahIzin
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

      {/* EDIT LEMBUR */}
      <DynamicBottomSheet
        isVisible={showEditLemburSheet}
        title="Edit Pengajuan Lembur"
        onClose={closeEditLemburSheet}
        isDark={isDark}
        customContent={
          <FormEditLembur
            control={controlEditLembur}
            errors={errorsEditLembur}
            handlePickEvidence={handlePickEvidenceEditLembur}
            buktiPendukung={buktiPendukungEditLembur}
            isDark={isDark}
            onSubmit={onPressEditLembur}
            canSubmit={canSubmitEditLembur}
            loading={loadingEditLembur}
          />
        }
      />

      {/* EDIT SAKIT */}
      <DynamicBottomSheet
        isVisible={showEditSakitSheet}
        title="Edit Pengajuan Sakit"
        onClose={closeEditSakitSheet}
        isDark={isDark}
        customContent={
          <FormEditSakit
            control={controlEditSakit}
            errors={errorsEditSakit}
            handlePickEvidence={handlePickEvidenceEditSakit}
            buktiPendukung={buktiPendukungEditSakit}
            isDark={isDark}
            onSubmit={onPressEditSakit}
            canSubmit={canSubmitEditSakit}
            loading={loadingEditSakit}
          />
        }
      />

      {/* EDIT IZIN */}
      <DynamicBottomSheet
        isVisible={showEditIzinSheet}
        title="Edit Pengajuan Izin"
        onClose={closeEditIzinSheet}
        isDark={isDark}
        customContent={
          <FormEditIzin
            control={controlEditIzin}
            errors={errorsEditIzin}
            handlePickEvidence={handlePickEvidenceEditIzin}
            buktiPendukung={buktiPendukungEditIzin}
            isDark={isDark}
            onSubmit={onPressEditIzin}
            canSubmit={canSubmitEditIzin}
            loading={loadingEditIzin}
            showPickerFor={showPickerForEditIzin}
            leaveStartDate={leaveStartDateEditIzin}
            leaveEndDate={leaveEndDateEditIzin}
          />
        }
      />

      {/* MODAL KONFIRMASI EDIT IZIN */}
      <DynamicModal
        isVisible={showModalEditIzin}
        title="Konfirmasi Perubahan"
        message={
          loadingEditIzin
            ? "Menyimpan perubahan... Mohon tunggu."
            : "Apakah Anda yakin ingin menyimpan perubahan ini?"
        }
        onClose={closeModalEditIzin}
        primaryButtonText={loadingEditIzin ? "Menyimpan..." : "Simpan"}
        onPrimaryButtonPress={handleEditPengajuanIzin}
        secondaryButtonText={loadingEditIzin ? undefined : "Batal"}
        onSecondaryButtonPress={
          loadingEditIzin ? undefined : closeModalEditIzin
        }
        isDark={isDark}
      />

      {/* Detail Pengajuan Izin */}
      <DynamicBottomSheet
        isVisible={showDetailSheetIzin}
        title="Detail Pengajuan"
        onClose={closeDetailIzin}
        isDark={isDark}
        primaryButtonText="Tutup"
        onPrimaryButtonPress={closeDetailIzin}
        customContent={
          loadingDetailIzin ? (
            <View className="p-5 items-center">
              <ActivityIndicator
                size="large"
                color={isDark ? "#fff" : "#000"}
              />
            </View>
          ) : (
            <DetailContentIzin detail={detailIzin} isDark={isDark} />
          )
        }
      />

      {/* Detail Pengajuan Sakit */}
      <DynamicBottomSheet
        isVisible={showDetailSheetSakit}
        title="Detail Pengajuan"
        onClose={closeDetailSakit}
        isDark={isDark}
        primaryButtonText="Tutup"
        onPrimaryButtonPress={closeDetailSakit}
        customContent={
          loadingDetailSakit ? (
            <View className="p-5 items-center">
              <ActivityIndicator
                size="large"
                color={isDark ? "#fff" : "#000"}
              />
            </View>
          ) : (
            <DetailContentSakit detail={detailSakit} isDark={isDark} />
          )
        }
      />

      {/* Detail Pengajuan Lembur */}
      <DynamicBottomSheet
        isVisible={showDetailSheetLembur}
        title="Detail Pengajuan"
        onClose={closeDetailLembur}
        isDark={isDark}
        primaryButtonText="Tutup"
        onPrimaryButtonPress={closeDetailLembur}
        customContent={
          loadingDetailLembur ? (
            <View className="p-5 items-center">
              <ActivityIndicator
                size="large"
                color={isDark ? "#fff" : "#000"}
              />
            </View>
          ) : (
            <DetailContentLembur detail={detailLembur} isDark={isDark} />
          )
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

      {showDatePickerEditIzin && (
        <View>
          <FormDateTimePicker
            pickerFor={pickerForEditIzin}
            leaveStartDate={leaveStartDateEditIzin}
            leaveEndDate={leaveEndDateEditIzin}
            onDateChange={onDateChangeEditIzin}
          />
        </View>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
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

      {/* MODAL KONFIRMASI EDIT LEMBUR */}
      <DynamicModal
        isVisible={showModalEditLembur}
        title="Konfirmasi Perubahan"
        message={
          loadingEditLembur
            ? "Menyimpan perubahan... Mohon tunggu."
            : "Apakah Anda yakin ingin menyimpan perubahan ini?"
        }
        onClose={closeModalEditLembur}
        primaryButtonText={loadingEditLembur ? "Menyimpan..." : "Simpan"}
        onPrimaryButtonPress={handleEditPengajuanLembur}
        secondaryButtonText={loadingEditLembur ? undefined : "Batal"}
        onSecondaryButtonPress={
          loadingEditLembur ? undefined : closeModalEditLembur
        }
        isDark={isDark}
      />

      {/* MODAL KONFIRMASI EDIT SAKIT */}
      <DynamicModal
        isVisible={showModalEditSakit}
        title="Konfirmasi Perubahan"
        message={
          loadingEditSakit
            ? "Menyimpan perubahan... Mohon tunggu."
            : "Apakah Anda yakin ingin menyimpan perubahan ini?"
        }
        onClose={closeModalEditSakit}
        primaryButtonText={loadingEditSakit ? "Menyimpan..." : "Simpan"}
        onPrimaryButtonPress={handleEditPengajuanSakit}
        secondaryButtonText={loadingEditSakit ? undefined : "Batal"}
        onSecondaryButtonPress={
          loadingEditSakit ? undefined : closeModalEditSakit
        }
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default PengajuanView;
