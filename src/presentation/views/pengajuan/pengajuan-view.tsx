import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useTambahPengajuanSakit from "../../hooks/pengajuan/tambah/use-tambah-pengajuan-sakit";
import FormSakit from "./components/form-sakit";
import usePengajuanView from "./hooks/use-pengajuan-view";

const PengajuanView = () => {
  const { uid } = useFirebaseAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    loading,
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

  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <View className="px-5 pt-5 pb-3 mb-4">
        <Text className={`text-3xl font-bold ${textPrimary}`}>Pengajuan</Text>
      </View>

      <View className="flex-1 px-5">
        <Text className={`${textPrimary} opacity-60`}>
          Daftar pengajuan akan muncul di sini...
        </Text>
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
            loading={loading}
          />
        }
      />
    </SafeAreaView>
  );
};

export default PengajuanView;
