import Button from "@/src/components/ui/button";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import InfoRow from "../../../../components/ui/info-row";
import ProfilError from "./profil-error";
import ProfilLoading from "./profil-loading";

interface Props {
  profilKaryawan: ProfilKaryawan | null;
  isDark: boolean;
  textColor: string;
  cardBg: string;
  loading: boolean;
  error: string | null;
  secondaryTextColor: string;
}

const AccountInfoCard = ({
  profilKaryawan,
  isDark,
  textColor,
  cardBg,
  loading,
  error,
  secondaryTextColor,
}: Props) => {
  const r = useRouter();
  const bgButton = isDark ? "bg-button-dark" : "bg-button-light";

  const editProfil = () => {
    r.navigate("/edit-profil");
  };

  if (loading) {
    return (
      <ProfilLoading isDark={isDark} secondaryTextColor={secondaryTextColor} />
    );
  }

  if (error) {
    return (
      <ProfilError
        error={error}
        isDark={isDark}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
        cardBg={cardBg}
      />
    );
  }

  if (!profilKaryawan) {
    return (
      <ProfilError
        error="Data pengguna tidak ditemukan"
        isDark={isDark}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
        cardBg={cardBg}
      />
    );
  }

  return (
    <View className={`${cardBg} rounded-xl p-6 mb-6 shadow-sm`}>
      <Text className={`text-lg font-bold ${textColor} mb-5`}>
        Informasi Akun
      </Text>
      <View className="gap-y-5">
        <InfoRow
          icon="mail"
          label="Email"
          value={profilKaryawan.email}
          isDark={isDark}
        />
        <InfoRow
          icon="user"
          label="Nama"
          value={profilKaryawan.nama || "-"}
          isDark={isDark}
        />
        <InfoRow
          icon="hash"
          label="NIK"
          value={profilKaryawan.nik || "-"}
          isDark={isDark}
        />
        <InfoRow
          icon="phone"
          label="Nomor HP"
          value={profilKaryawan.nomor_hp || "-"}
          isDark={isDark}
        />
        <InfoRow
          icon="briefcase"
          label="Divisi"
          value={profilKaryawan.divisi || "-"}
          isDark={isDark}
        />
        <Button
          title="Edit Profil"
          onPress={editProfil}
          className={`${bgButton} flex-row items-center justify-center rounded-lg p-3`}
          textClassName="text-white font-bold text-base"
        />
      </View>
    </View>
  );
};

export default AccountInfoCard;
