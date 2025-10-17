import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import React from "react";
import { Text, View } from "react-native";
import InfoRow from "./info-row";

interface Props {
  user: ProfilKaryawan;
  isDark: boolean;
  textColor: string;
  cardBg: string;
}

const AccountInfoCard = ({ user, isDark, textColor, cardBg }: Props) => {
  return (
    <View className={`${cardBg} rounded-xl p-6 mb-6 shadow-sm`}>
      <Text className={`text-lg font-bold ${textColor} mb-5`}>
        Informasi Akun
      </Text>
      <View className="gap-y-5">
        <InfoRow icon="mail" label="Email" value={user.email} isDark={isDark} />
        <InfoRow
          icon="user"
          label="Nama"
          value={user.nama || "-"}
          isDark={isDark}
        />
        <InfoRow
          icon="briefcase"
          label="Divisi"
          value={user.divisi || "-"}
          isDark={isDark}
        />
      </View>
    </View>
  );
};

export default AccountInfoCard;
