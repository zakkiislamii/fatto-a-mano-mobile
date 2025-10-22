import { supabase } from "@/src/configs/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { KeteranganFile } from "../enums/keterangan-file";

function filenameFromUri(uri: string, fallback = "bukti") {
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
  prefix: KeteranganFile
) {
  try {
    const fileName = filenameFromUri(localUri, prefix);
    const contentType = guessMimeType(fileName);
    const objectPath = `${uid}/${Date.now()}/${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    if (!fileInfo || !fileInfo.exists) {
      throw new Error("File tidak ditemukan");
    }

    const formData = new FormData();
    formData.append("file", {
      uri: localUri,
      type: contentType,
      name: fileName,
    } as any);

    const { error: uploadErr } = await supabase.storage
      .from("files")
      .upload(objectPath, formData, {
        contentType,
        upsert: false,
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      throw new Error(`Upload Supabase gagal: ${uploadErr.message}`);
    }

    const { data: pub } = supabase.storage
      .from("files")
      .getPublicUrl(objectPath);

    if (pub?.publicUrl) {
      try {
        const response = await fetch(pub.publicUrl, { method: "HEAD" });
        if (response.status !== 200) {
          console.warn("File uploaded but may not be publicly accessible");
        }
      } catch (verifyError) {
        console.warn("Could not verify file accessibility:", verifyError);
      }
    }

    return {
      url: pub?.publicUrl ?? null,
      name: fileName,
    };
  } catch (error) {
    console.error("Upload to Supabase error:", error);
    throw error;
  }
}
