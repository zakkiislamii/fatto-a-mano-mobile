import { StatusPengajuan } from "@/src/common/enums/status-pengajuan";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { DaftarVerifikasi } from "@/src/domain/models/daftar-verifikasi";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetAllVerifikasi from "../../hooks/verifikasi/use-get-all-verifikasi";
import useDetailVerifikasi from "../../hooks/verifikasi/use-get-detail-verifikasi";
import useVerifikasiPengajuan from "../../hooks/verifikasi/use-verifikasi-pengajuan";
import DetailBottomSheetContent from "./components/detail-bottom-sheet-content";
import VerifikasiCard from "./components/verifikasi-card";

const VerifikasiView = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const textColor = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const mutedColor = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";

  const {
    verifikasiList,
    loading: listLoading,
    error: listError,
  } = useGetAllVerifikasi();
  const {
    detail,
    loading: detailLoading,
    error: detailError,
    fetchDetail,
    clearDetail,
  } = useDetailVerifikasi();
  const {
    setujuiPengajuan,
    tolakPengajuan,
    loading: verifikasiLoading,
  } = useVerifikasiPengajuan();

  const [isDetailSheetVisible, setDetailSheetVisible] = useState(false);
  const [isKonfirmasiModalVisible, setKonfirmasiModalVisible] = useState(false);
  const [selectedVerifikasi, setSelectedVerifikasi] =
    useState<DaftarVerifikasi | null>(null);
  const [konfirmasiAksi, setKonfirmasiAksi] = useState<
    "setujui" | "tolak" | null
  >(null);

  const handleDetailClick = (item: DaftarVerifikasi) => {
    setSelectedVerifikasi(item);
    fetchDetail(item.uid, item.id);
    setDetailSheetVisible(true);
  };

  const handleTolakClick = (item: DaftarVerifikasi) => {
    setSelectedVerifikasi(item);
    setKonfirmasiAksi("tolak");
    setKonfirmasiModalVisible(true);
  };

  const handleSetujuiClick = (item: DaftarVerifikasi) => {
    setSelectedVerifikasi(item);
    setKonfirmasiAksi("setujui");
    setKonfirmasiModalVisible(true);
  };

  const handleCloseDetailSheet = () => {
    setDetailSheetVisible(false);
    clearDetail();
    setSelectedVerifikasi(null);
  };

  const handleCloseKonfirmasiModal = () => {
    setKonfirmasiModalVisible(false);
  };

  const handleKonfirmasiAksi = async () => {
    if (!selectedVerifikasi || !konfirmasiAksi) return;

    const { uid, id } = selectedVerifikasi;

    try {
      if (konfirmasiAksi === "setujui") {
        await setujuiPengajuan(uid, id);
      } else if (konfirmasiAksi === "tolak") {
        await tolakPengajuan(uid, id);
      }
    } catch (error) {
      console.error("Gagal mengeksekusi aksi verifikasi:", error);
    } finally {
      setKonfirmasiModalVisible(false);
      setSelectedVerifikasi(null);
      setKonfirmasiAksi(null);
    }
  };

  const renderContent = () => {
    if (listLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDark ? "#FFFFFF" : "#888888"}
          />
          <Text className={`mt-3 ${mutedColor}`}>
            Memuat data verifikasi...
          </Text>
        </View>
      );
    }

    if (listError) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg text-danger-light`}>
            Error: {listError}
          </Text>
        </View>
      );
    }

    if (verifikasiList.length === 0) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${mutedColor}`}>
            Tidak ada data verifikasi.
          </Text>
        </View>
      );
    }

    const pendingList = verifikasiList.filter(
      (v) => v.status === StatusPengajuan.menunggu
    );
    const completedList = verifikasiList.filter(
      (v) => v.status !== StatusPengajuan.menunggu
    );

    return (
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {pendingList.length > 0 && (
          <Text className={`text-xl font-bold mt-4 mb-2 px-4 ${textColor}`}>
            Perlu Verifikasi ({pendingList.length})
          </Text>
        )}
        {pendingList.map((item) => (
          <VerifikasiCard
            key={item.id}
            item={item}
            isDark={isDark}
            onDetail={handleDetailClick}
            onTolak={handleTolakClick}
            onSetujui={handleSetujuiClick}
          />
        ))}

        {completedList.length > 0 && (
          <Text className={`text-xl font-bold mt-6 mb-2 px-4 ${textColor}`}>
            Riwayat Verifikasi ({completedList.length})
          </Text>
        )}
        {completedList.map((item) => (
          <VerifikasiCard
            key={item.id}
            item={item}
            isDark={isDark}
            onDetail={handleDetailClick}
            onTolak={handleTolakClick}
            onSetujui={handleSetujuiClick}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <Text
        className={`text-2xl font-bold px-4 pt-4 pb-2 ${textColor} border-b ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        Verifikasi Pengajuan
      </Text>

      {renderContent()}

      <DynamicBottomSheet
        isVisible={isDetailSheetVisible}
        title="Detail Pengajuan"
        onClose={handleCloseDetailSheet}
        isDark={isDark}
        customContent={
          <DetailBottomSheetContent
            detail={detail}
            loading={detailLoading}
            error={detailError}
            isDark={isDark}
          />
        }
        secondaryButtonText="Tutup"
        onSecondaryButtonPress={handleCloseDetailSheet}
      />

      <DynamicModal
        isVisible={isKonfirmasiModalVisible}
        title={
          konfirmasiAksi === "setujui"
            ? "Konfirmasi Persetujuan"
            : "Konfirmasi Penolakan"
        }
        message={`Apakah Anda yakin ingin ${
          konfirmasiAksi === "setujui" ? "menyetujui" : "menolak"
        } pengajuan dari ${selectedVerifikasi?.nama} ini?`}
        onClose={handleCloseKonfirmasiModal}
        isDark={isDark}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={handleCloseKonfirmasiModal}
        primaryButtonText={
          verifikasiLoading
            ? "Memproses..."
            : konfirmasiAksi === "setujui"
              ? "Setujui"
              : "Tolak"
        }
        onPrimaryButtonPress={
          verifikasiLoading ? () => {} : handleKonfirmasiAksi
        }
      />
    </SafeAreaView>
  );
};

export default VerifikasiView;
