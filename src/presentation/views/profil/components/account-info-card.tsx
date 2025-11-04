import { UserRole } from "@/src/common/enums/user-role";
import Button from "@/src/components/ui/button";
import { DynamicBottomSheet } from "@/src/components/ui/dynamic-bottom-sheet";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { ProfilKaryawan } from "@/src/domain/models/profil-karyawan";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import useEditProfil from "@/src/presentation/hooks/profile/use-edit-profil";
import { useGetProfile } from "@/src/presentation/hooks/profile/use-get-profil";
import React from "react";
import { Text, View } from "react-native";
import InfoRow from "../../../../components/ui/info-row";
import FormEditProfil from "./form-edit-profil";
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
  role: string | null;
}

const AccountInfoCard = ({
  profilKaryawan,
  isDark,
  textColor,
  cardBg,
  loading,
  error,
  secondaryTextColor,
  role,
}: Props) => {
  const { uid } = useFirebaseAuth();
  const { profilKaryawan: profil, loading: loadingProfil } = useGetProfile(
    uid ?? null
  );
  const {
    control,
    errors,
    canSubmit,
    handleUpdateProfil,
    loading: loadingSubmit,
    showModal,
    closeModal,
    onPress,
    showEditSheet,
    openEditSheet,
    closeEditSheet,
  } = useEditProfil(uid ?? null, profil);

  const bgButton = isDark ? "bg-button-dark" : "bg-button-light";

  if (loading || loadingProfil) {
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

        {role === UserRole.karyawan && (
          <InfoRow
            icon="briefcase"
            label="Divisi"
            value={profilKaryawan.divisi || "-"}
            isDark={isDark}
          />
        )}
        <Button
          title="Edit Profil"
          onPress={openEditSheet}
          className={`${bgButton} flex-row items-center justify-center rounded-lg p-3`}
          textClassName="text-white font-bold text-base"
        />
      </View>

      {/* Bottom sheet untuk edit profil */}
      <DynamicBottomSheet
        isVisible={showEditSheet}
        title="Edit Profil"
        onClose={closeEditSheet}
        isDark={isDark}
        customContent={
          <FormEditProfil
            control={control}
            errors={errors}
            onSubmit={onPress}
            canSubmit={canSubmit}
            loading={loadingSubmit}
            isDark={isDark}
          />
        }
      />

      {/* Modal Konfirmasi (sama seperti sebelumnya, dari hook) */}
      <DynamicModal
        isVisible={showModal}
        title="Konfirmasi Perubahan"
        message="Apakah Anda yakin ingin menyimpan perubahan profil ini?"
        onClose={closeModal}
        primaryButtonText="Simpan"
        onPrimaryButtonPress={() => {
          handleUpdateProfil();
        }}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={closeModal}
        isDark={isDark}
      />
    </View>
  );
};

export default AccountInfoCard;
