import { supabase } from "@/src/configs/supabase";
import * as FileSystem from "expo-file-system";

function filenameFromUri(uri: string, fallback = "evidence") {
  try {
    const part = uri.split("/").pop() || fallback;
    return part.includes(".") ? part : `${part}.jpg`;
  } catch {
    return `${fallback}.jpg`;
  }
}

function guessMimeType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "pdf":
      return "application/pdf";
    case "heic":
      return "image/heic";
    default:
      return "application/octet-stream";
  }
}

export async function uploadToSupabase(
  uid: string,
  localUri: string,
  prefix: string
) {
  const fileName = filenameFromUri(localUri, prefix);
  const contentType = guessMimeType(fileName);
  const objectPath = `requests/${uid}/${Date.now()}/${fileName}`;

  // Baca file sebagai binary string
  const fileInfo = await FileSystem.getInfoAsync(localUri);

  if (!fileInfo.exists) {
    throw new Error("File tidak ditemukan");
  }

  // Upload langsung dari URI menggunakan FileSystem
  const { error: uploadErr } = await supabase.storage.from("files").upload(
    objectPath,
    {
      uri: localUri,
      type: contentType,
      name: fileName,
    } as any,
    {
      contentType,
      upsert: false,
    }
  );

  if (uploadErr) {
    throw new Error(`Upload Supabase gagal: ${uploadErr.message}`);
  }

  const { data: pub } = supabase.storage.from("files").getPublicUrl(objectPath);

  return {
    url: pub?.publicUrl ?? null,
    name: fileName,
  };
}
