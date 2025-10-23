import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

interface PickImageOptions {
  maxSizeMB?: number;
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
}

export const pickImageFromLibrary = async (
  options: PickImageOptions = {}
): Promise<string | null> => {
  const {
    maxSizeMB = 3,
    aspect = [4, 3],
    quality = 1,
    allowsEditing = true,
  } = options;

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing,
      aspect,
      quality,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);

      if (fileInfo.exists && fileInfo.size) {
        const sizeInMB = fileInfo.size / (1024 * 1024);

        if (sizeInMB > maxSizeMB) {
          Toast.show({
            type: "error",
            text1: "Ukuran file terlalu besar",
            text2: `Maksimal ukuran file adalah ${maxSizeMB} MB`,
          });
          return null;
        }

        return asset.uri;
      }
    }

    return null;
  } catch (error) {
    console.error("Error picking image:", error);
    Toast.show({
      type: "error",
      text1: "Gagal memilih gambar",
    });
    return null;
  }
};
