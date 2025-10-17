import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import React from "react";
import AccountInfoCard from "./account-info-card";
import AccountSettingsCard from "./account-settings-card";
import ProfilError from "./profil-error";
import ProfilLoading from "./profil-loading";

interface Props {
  user: ProfilKaryawan | null;
  loading: boolean;
  error: string | null;
  loggingOut: boolean;
  onLogoutPress: () => void;
  isDark: boolean;
  textColor: string;
  secondaryTextColor: string;
  cardBg: string;
}

const ProfilContent = ({
  user,
  loading,
  error,
  loggingOut,
  onLogoutPress,
  isDark,
  textColor,
  secondaryTextColor,
  cardBg,
}: Props) => {
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

  if (!user) {
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
    <>
      <AccountInfoCard
        user={user}
        isDark={isDark}
        textColor={textColor}
        cardBg={cardBg}
      />
      <AccountSettingsCard
        loggingOut={loggingOut}
        onLogoutPress={onLogoutPress}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
        cardBg={cardBg}
      />
    </>
  );
};

export default ProfilContent;
