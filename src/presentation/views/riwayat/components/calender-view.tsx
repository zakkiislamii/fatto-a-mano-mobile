import { StatusPresensi } from "@/src/common/enums/status-presensi";
import formatDateToString from "@/src/common/utils/format-date-to-string";
import { Presensi } from "@/src/domain/models/presensi";
import React, { useMemo } from "react";
import { View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface CalendarProps {
  riwayat: Presensi[];
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: Date) => void;
  isDark: boolean;
}

const CalendarView = ({
  riwayat,
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
  isDark,
}: CalendarProps) => {
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";

  const getDotColor = (riwayatPresensi: Presensi): string => {
    const status = riwayatPresensi.status?.toLowerCase();

    if (
      status === StatusPresensi.HADIR &&
      riwayatPresensi.presensi_masuk.terlambat
    ) {
      return isDark ? "#f97316" : "#ea580c";
    }

    switch (status) {
      case "hadir":
        return isDark ? "#22c55e" : "#16a34a";
      case "sakit":
        return isDark ? "#ef4444" : "#dc2626";
      case "izin":
        return isDark ? "#3b82f6" : "#2563eb";
      default:
        return isDark ? "#6b7280" : "#4b5563";
    }
  };

  const markedDates = useMemo(() => {
    const marked: any = {};

    riwayat.forEach((riwayat) => {
      marked[riwayat.tanggal] = {
        marked: true,
        dotColor: getDotColor(riwayat),
      };
    });

    const selectedKey = formatDateToString(selectedDate);
    marked[selectedKey] = {
      ...marked[selectedKey],
      selected: true,
      selectedColor: isDark ? "#3b82f6" : "#2563eb",
      selectedTextColor: "#ffffff",
    };

    // Mark today
    const todayKey = formatDateToString(new Date());
    if (todayKey !== selectedKey) {
      marked[todayKey] = {
        ...marked[todayKey],
        customStyles: {
          container: {
            backgroundColor: isDark ? "#22c55e20" : "#16a34a20",
            borderRadius: 6,
          },
          text: {
            color: isDark ? "#22c55e" : "#16a34a",
            fontWeight: "bold",
          },
        },
      };
    }

    return marked;
  }, [riwayat, selectedDate, isDark]);

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: isDark ? "#1e293b" : "#ffffff",
      calendarBackground: isDark ? "#1e293b" : "#ffffff",
      textSectionTitleColor: isDark ? "#9ca3af" : "#64748b",
      monthTextColor: isDark ? "#ffffff" : "#1e293b",
      dayTextColor: isDark ? "#ffffff" : "#1e293b",
      textDisabledColor: isDark ? "#64748b" : "#cbd5e1",
      textInactiveColor: isDark ? "#475569" : "#e2e8f0",
      todayTextColor: isDark ? "#22c55e" : "#16a34a",
      selectedDayBackgroundColor: isDark ? "#3b82f6" : "#2563eb",
      selectedDayTextColor: "#ffffff",
      arrowColor: isDark ? "#3b82f6" : "#2563eb",
      disabledArrowColor: isDark ? "#475569" : "#cbd5e1",
    }),
    [isDark]
  );

  const onDayPress = (day: DateData) => {
    const newDate = new Date(day.dateString);
    onDateSelect(newDate);
  };

  const onMonthChangeCalendar = (month: DateData) => {
    const newMonth = new Date(month.dateString);
    onMonthChange(newMonth);
  };

  return (
    <View
      className={`${cardBg} mx-5 mb-4 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700`}
    >
      <Calendar
        current={formatDateToString(currentMonth)}
        onDayPress={onDayPress}
        onMonthChange={onMonthChangeCalendar}
        markedDates={markedDates}
        theme={calendarTheme}
        firstDay={1}
        enableSwipeMonths
      />
    </View>
  );
};

export default CalendarView;
