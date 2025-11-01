import { DIVISI_OPTIONS, HARI_OPTIONS } from "@/src/common/constants/constants";
import { parseTimeToDate } from "@/src/common/utils/parse-time-to-date";
import Button from "@/src/components/ui/button";
import { DynamicModal } from "@/src/components/ui/dynamic-modal";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import useUpdateLengkapiProfil from "@/src/hooks/use-update-lengkapi-profil";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Controller } from "react-hook-form";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LengkapiProfilView = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { uid } = useFirebaseAuth();

  const {
    canSubmit,
    loading,
    fetchingData,
    control,
    errors,
    watch,
    showJamMasukPicker,
    showJamKeluarPicker,
    openJamMasukPicker,
    openJamKeluarPicker,
    showDivisiDropdown,
    toggleDivisiDropdown,
    closeDivisiDropdown,
    selectedHari,
    toggleHari,
    handleTimeChange,
    handleSubmit,
    showConfirmModal,
    closeConfirmModal,
    confirmSubmit,
  } = useUpdateLengkapiProfil(uid);

  const bgColor = isDark ? "bg-screenDark" : "bg-screenLight";
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textPrimary = isDark ? "text-textPrimaryDark" : "text-textPrimaryLight";
  const textSecondary = isDark
    ? "text-textSecondaryDark"
    : "text-textSecondaryLight";
  const inputBg = isDark ? "bg-slate-700" : "bg-gray-100";
  const inputBorder = isDark ? "border-slate-600" : "border-gray-300";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";

  if (fetchingData) {
    return (
      <SafeAreaView className={`flex-1 ${bgColor}`}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDark ? "#3f3f9a" : "#2C2C54"}
          />
          <Text className={`mt-4 ${textSecondary}`}>Memuat data profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 p-4 ${bgColor}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View className={`${cardBg} rounded-xl p-4 justify-center shadow-sm`}>
          <Text className={`text-2xl font-bold mb-6 ${textPrimary}`}>
            Lengkapi Profil
          </Text>

          {/* Nama */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Nama Lengkap
            </Text>
            <Controller
              control={control}
              name="nama"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 ${textPrimary}`}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.nama && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.nama.message}
              </Text>
            )}
          </View>

          {/* Nomor HP */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Nomor HP
            </Text>
            <Controller
              control={control}
              name="nomor_hp"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 ${textPrimary}`}
                  placeholder="Masukkan nomor HP"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.nomor_hp && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.nomor_hp.message}
              </Text>
            )}
          </View>

          {/* Divisi Dropdown */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Divisi
            </Text>
            <Controller
              control={control}
              name="divisi"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TouchableOpacity
                    className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
                    onPress={toggleDivisiDropdown}
                  >
                    <Text className={value ? textPrimary : textSecondary}>
                      {value
                        ? DIVISI_OPTIONS.find((d) => d.value === value)?.label
                        : "Pilih divisi"}
                    </Text>
                    <Feather
                      name={showDivisiDropdown ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                    />
                  </TouchableOpacity>

                  {showDivisiDropdown && (
                    <View
                      className={`${cardBg} border ${inputBorder} rounded-lg mt-2 overflow-hidden`}
                    >
                      {DIVISI_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          className={`px-4 py-3 border-b ${inputBorder} ${
                            value === option.value
                              ? isDark
                                ? "bg-slate-600"
                                : "bg-gray-200"
                              : ""
                          }`}
                          onPress={() => {
                            onChange(option.value);
                            closeDivisiDropdown();
                          }}
                        >
                          <Text className={textPrimary}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
            {errors.divisi && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.divisi.message}
              </Text>
            )}
          </View>

          {/* Jam Masuk */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Jam Masuk
            </Text>
            <Controller
              control={control}
              name="jadwal.jam_masuk"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
                  onPress={openJamMasukPicker}
                >
                  <Text className={value ? textPrimary : textSecondary}>
                    {value || "Pilih jam masuk"}
                  </Text>
                  <Feather
                    name="clock"
                    size={20}
                    color={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </TouchableOpacity>
              )}
            />
            {errors.jadwal?.jam_masuk && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.jadwal.jam_masuk.message}
              </Text>
            )}
          </View>

          {showJamMasukPicker && (
            <DateTimePicker
              value={parseTimeToDate(watch("jadwal.jam_masuk") || "08:00")}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, date) => handleTimeChange(date, "jam_masuk")}
            />
          )}

          {/* Jam Keluar */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Jam Keluar
            </Text>
            <Controller
              control={control}
              name="jadwal.jam_keluar"
              render={({ field: { value } }) => (
                <TouchableOpacity
                  className={`${inputBg} ${inputBorder} border rounded-lg px-4 py-3 flex-row justify-between items-center`}
                  onPress={openJamKeluarPicker}
                >
                  <Text className={value ? textPrimary : textSecondary}>
                    {value || "Pilih jam keluar"}
                  </Text>
                  <Feather
                    name="clock"
                    size={20}
                    color={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </TouchableOpacity>
              )}
            />
            {errors.jadwal?.jam_keluar && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.jadwal.jam_keluar.message}
              </Text>
            )}
          </View>

          {showJamKeluarPicker && (
            <DateTimePicker
              value={parseTimeToDate(watch("jadwal.jam_keluar") || "17:00")}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(_, date) => handleTimeChange(date, "jam_keluar")}
            />
          )}

          {/* Hari Kerja */}
          <View className="mb-4">
            <Text className={`text-sm font-semibold mb-2 ${textPrimary}`}>
              Hari Kerja
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {HARI_OPTIONS.map((hari) => (
                <TouchableOpacity
                  key={hari.value}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedHari.includes(hari.value)
                      ? `${buttonBg} border-transparent`
                      : `${inputBorder} border`
                  }`}
                  onPress={() => toggleHari(hari.value)}
                >
                  <Text
                    className={
                      selectedHari.includes(hari.value)
                        ? "text-white font-semibold"
                        : textSecondary
                    }
                  >
                    {hari.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.jadwal?.hari_kerja && (
              <Text className="text-danger-light text-xs mt-1">
                {errors.jadwal.hari_kerja.message}
              </Text>
            )}
          </View>

          {/* WFH Toggle */}
          <View className="mb-6">
            <Controller
              control={control}
              name="jadwal.is_wfa"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => onChange(!value)}
                >
                  <View
                    className={`w-5 h-5 border-2 rounded ${
                      value
                        ? `${buttonBg} border-transparent`
                        : `${inputBorder} border`
                    } items-center justify-center mr-3`}
                  >
                    {value && <Feather name="check" size={14} color="white" />}
                  </View>
                  <Text className={`${textPrimary} font-medium`}>
                    Work From Home (WFH)
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Simpan Profil"
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
            className={`${buttonBg} py-4 rounded-lg`}
            textClassName="text-white font-bold text-base"
          />
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <DynamicModal
        isVisible={showConfirmModal}
        title="Konfirmasi Simpan"
        message="Apakah Anda yakin ingin menyimpan perubahan profil ini?"
        onClose={closeConfirmModal}
        primaryButtonText="Ya, Simpan"
        onPrimaryButtonPress={confirmSubmit}
        secondaryButtonText="Batal"
        onSecondaryButtonPress={closeConfirmModal}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default LengkapiProfilView;
