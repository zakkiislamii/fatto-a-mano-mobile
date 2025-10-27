import formatTimestamp from "@/src/common/utils/format-timestamp";
import { Notifikasi } from "@/src/domain/models/notifikasi";
import { useFirebaseAuth } from "@/src/hooks/use-auth";
import useGetNotifikasi from "@/src/presentation/hooks/notifikasi/use-get-notifikasi";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotifikasiView = () => {
  const { user } = useFirebaseAuth();
  const uid = user?.uid || "";
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const screenBg = isDark ? "bg-screenDark" : "bg-screenLight";
  const cardBg = isDark ? "bg-cardDark" : "bg-cardLight";
  const textPrimary = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-white" : "text-black";
  const textMuted = isDark ? "text-textMutedDark" : "text-textMutedLight";
  const buttonBg = isDark ? "bg-button-dark" : "bg-button-light";
  const unreadBg = isDark ? "bg-info-dark-bg" : "bg-info-light-bg";
  const indicatorColor = isDark ? "#c7d2fe" : "#3730a3";

  const { notifikasi, unreadCount, loading, markAsRead, markAllAsRead } =
    useGetNotifikasi(uid);

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${screenBg}`}
      >
        <ActivityIndicator size="large" color={indicatorColor} />
        <Text className={`mt-4 ${textSecondary}`}>Memuat notifikasi...</Text>
      </SafeAreaView>
    );
  }

  const handleNotificationPress = (notifId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notifId);
    }
    router.push("/(tabs)/jadwal");
  };

  const renderNotificationItem = ({ item }: { item: Notifikasi }) => {
    const isItemUnread = !item.read;
    const itemBg = isItemUnread ? unreadBg : cardBg;
    const titleColor = isItemUnread ? textPrimary : textSecondary;
    const bodyColor = textSecondary;

    return (
      <TouchableOpacity
        onPress={() => handleNotificationPress(item.id, item.read)}
        className={`mx-4 my-2 p-4 rounded-lg shadow-sm ${itemBg} flex-row items-start`}
        activeOpacity={0.7}
      >
        <View className="flex-row">
          <View className="flex-1 gap-2">
            <Text className={`text-lg font-bold ${titleColor}`}>
              {item.title}
            </Text>
            <Text className={`text-base ${bodyColor}`}>{item.body}</Text>
          </View>
          <Text className={`text-xs font-bold ${textMuted}`}>
            {formatTimestamp(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center">
      <Text className={`text-xl font-semibold ${textPrimary}`}>
        Tidak ada notifikasi
      </Text>
    </View>
  );

  const ListHeader = () => {
    if (unreadCount === 0) return null;

    return (
      <View className={`px-4 pt-4 pb-2 flex-row justify-between items-center`}>
        <Text className={`text-sm ${textSecondary}`}>
          {unreadCount} notifikasi belum dibaca
        </Text>
        <TouchableOpacity
          onPress={markAllAsRead}
          className={`${buttonBg} px-4 py-2 rounded-lg`}
          activeOpacity={0.8}
        >
          <Text className={`font-semibold text-sm text-textPrimaryDark`}>
            Tandai Semua
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${screenBg}`}>
      <FlatList
        data={notifikasi}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          notifikasi.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
        }
      />
    </SafeAreaView>
  );
};

export default NotifikasiView;
