import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";

type FormDateTimePickerProps = {
  pickerFor: "start" | "end" | null;
  leaveStartDate: Date | null;
  leaveEndDate: Date | null;
  onDateChange: (event: any, date?: Date) => void;
};

const FormDateTimePicker = ({
  pickerFor,
  leaveStartDate,
  leaveEndDate,
  onDateChange,
}: FormDateTimePickerProps) => {
  if (!pickerFor) return null;

  const value =
    pickerFor === "start"
      ? leaveStartDate || new Date()
      : leaveEndDate || leaveStartDate || new Date();

  const minimumDate =
    pickerFor === "end" ? leaveStartDate || undefined : undefined;

  return (
    <DateTimePicker
      value={value}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "calendar"}
      onChange={onDateChange}
      minimumDate={minimumDate}
    />
  );
};

export default FormDateTimePicker;
