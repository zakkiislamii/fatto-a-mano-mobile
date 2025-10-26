import { JadwalKaryawan } from "@/src/common/types/jadwal-karyawan";
import InfoRow from "@/src/components/ui/info-row";
import React from "react";
import { View } from "react-native";

interface Props {
  user: JadwalKaryawan;
  isDark: boolean;
  cardBg: string;
}

export const WorkScheduleCard = ({ user, isDark, cardBg }: Props) => {
  const checkInText = user?.jam_masuk?.trim() || "-";
  const checkOutText = user?.jam_keluar?.trim() || "-";
  const workingDays = user?.hari_kerja?.trim() || "-";
  const isWfh = user.is_wfh;
  const modeKerjaText = isWfh ? "WFH (Work From Home)" : "WFO (On-site)";

  return (
    <View className={`${cardBg} rounded-xl p-6 mb-3 shadow-sm`}>
      <View className="gap-y-5">
        <InfoRow
          icon="clock"
          label="Jam Masuk"
          value={checkInText}
          isDark={isDark}
        />
        <InfoRow
          icon="clock"
          label="Jam Keluar"
          value={checkOutText}
          isDark={isDark}
        />
        <InfoRow
          icon="calendar"
          label="Hari Kerja"
          value={workingDays}
          isDark={isDark}
        />

        <InfoRow
          icon="briefcase"
          label="Mode Kerja"
          value={modeKerjaText}
          isDark={isDark}
        />
      </View>
    </View>
  );
};
