import { DaftarPengajuan } from "@/src/common/types/daftar-pengajuan";
import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
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
import useTambahPengajuanSakit from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-sakit";
import useDaftarPengajuan from "../../hooks/pengajuan/use-daftar-pengajuan";
import FormSakit from "./components/form-sakit";
import PengajuanCard from "./components/pengajuan-card";
import usePengajuanView from "./hooks/use-pengajuan-view";

const PengajuanView = () => {
  const { uid } = useFirebaseAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    loading: loadingTambah,
    buktiPendukung,
    handlePickEvidence,
    canSubmit,
    control,
    errors,
    showSakitSheet,
    openSakitSheet,
    closeSakitSheet,
    handleTambahPengajuanSakit,
  } = useTambahPengajuanSakit(uid);

  const {
    showPilihanSheet,
    openSheet,
    handlePilihIzin,
    handlePilihSakit,
    closeSheet,
  } = usePengajuanView(openSakitSheet);

  const {
    loading: loadingDaftar,
    pengajuanList,
    handleDelete,
    handleEdit,
  } = useDaftarPengajuan();

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
      onDelete={() => handleDelete(item.id)}
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

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      {/* HEADER */}
      <View className="px-5 pt-5 pb-3 mb-4">
        <Text className={`text-3xl font-bold ${textPrimary}`}>Pengajuan</Text>
      </View>

      {/* --- AREA KONTEN (DAFTAR PENGAJUAN) --- */}
      <View className="flex-1 px-5">
        {loadingDaftar ? (
          <ActivityIndicator
            size="large"
            color={isDark ? "#FFFFFF" : "#000000"}
            className="mt-10"
          />
        ) : (
          <FlatList
            data={pengajuanList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
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

      <DynamicBottomSheet
        isVisible={showSakitSheet}
        title="Formulir Pengajuan Sakit"
        onClose={closeSakitSheet}
        isDark={isDark}
        customContent={
          <FormSakit
            control={control}
            errors={errors}
            handlePickEvidence={handlePickEvidence}
            buktiPendukung={buktiPendukung}
            isDark={isDark}
            onSubmit={handleTambahPengajuanSakit}
            canSubmit={canSubmit}
            loading={loadingTambah}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PengajuanView;
