import { Karyawan } from "@/src/common/types/karyawan";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import JadwalDetailContent from "./jadwal-detail-content";
import KaryawanActionButtons from "./karyawan-action-buttons";

interface KaryawanCardProps {
  karyawan: Karyawan;
  isDark: boolean;
  key?: string;
}

const KaryawanCard = ({ karyawan, isDark }: KaryawanCardProps) => {
  const [isSheetVisible, setSheetVisible] = useState(false);

  if (!karyawan) {
    return null;
  }

  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const textPrimary = isDark ? "#f9fafb" : "#111827";
  const textSecondary = isDark ? "#9ca3af" : "#6b7280";
  const iconColor = isDark ? "#d1d5db" : "#64748b";
  const borderColor = isDark ? "#374151" : "#e5e7eb";

  const toRiwayat = () => {
    router.push({
      pathname: "/riwayat-detail",
      params: {
        uid: karyawan.uid,
        nama: karyawan.nama,
      },
    });
  };

  return (
    <>
      <View
        style={[
          styles.card,
          { backgroundColor: bgCard, borderColor: borderColor },
        ]}
      >
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={[styles.nama, { color: textPrimary }]} numberOfLines={1}>
            {karyawan.nama || "-"}
          </Text>

          <View style={styles.infoRow}>
            <Feather name="briefcase" size={14} color={iconColor} />
            <Text
              style={[styles.infoText, { color: textSecondary }]}
              numberOfLines={1}
            >
              {karyawan.divisi || "-"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="mail" size={14} color={iconColor} />
            <Text
              style={[styles.infoText, { color: textSecondary }]}
              numberOfLines={1}
            >
              {karyawan.email || "-"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="phone" size={14} color={iconColor} />
            <Text
              style={[styles.infoText, { color: textSecondary }]}
              numberOfLines={1}
            >
              {karyawan.nomor_hp || "-"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <KaryawanActionButtons
          isDark={isDark}
          borderColor={borderColor}
          onLihatJadwal={() => setSheetVisible(true)}
          onLihatRiwayat={toRiwayat}
          onLihatDetail={() =>
            console.log(`[Aksi] Lihat Detail for: ${karyawan.nama}`)
          }
        />
      </View>

      {karyawan.jadwal && (
        <DynamicBottomSheet
          isVisible={isSheetVisible}
          onClose={() => setSheetVisible(false)}
          title={`Detail Jadwal \n ${karyawan.nama}`}
          isDark={isDark}
          customContent={
            <JadwalDetailContent jadwal={karyawan.jadwal} isDark={isDark} />
          }
          primaryButtonText="Edit Jadwal"
          onPrimaryButtonPress={() => {
            console.log(
              `[Aksi] edit jadwal kerja for: ${karyawan.nama}, ${karyawan.uid}`
            );
          }}
          secondaryButtonText="Tutup"
          onSecondaryButtonPress={() => setSheetVisible(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 12,
  },
  nama: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default KaryawanCard;
