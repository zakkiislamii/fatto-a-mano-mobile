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

function extractPathFromUrl(publicUrl: string): string | null {
  try {
    // Format URL Supabase: https://{project}.supabase.co/storage/v1/object/public/files/{path}
    const match = publicUrl.match(/\/files\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
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

export async function updateFileInSupabase(
  uid: string,
  localUri: string,
  oldPublicUrl: string,
  prefix: KeteranganFile
) {
  try {
    // Hapus file lama terlebih dahulu
    const oldPath = extractPathFromUrl(oldPublicUrl);
    if (oldPath) {
      const { error: deleteErr } = await supabase.storage
        .from("files")
        .remove([oldPath]);

      if (deleteErr) {
        console.warn("Gagal menghapus file lama:", deleteErr);
        // Lanjutkan upload meskipun gagal hapus
      }
    }

    // Upload file baru
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
    console.error("Update file in Supabase error:", error);
    throw error;
  }
}

export async function deleteFileFromSupabase(publicUrl: string) {
  try {
    const filePath = extractPathFromUrl(publicUrl);

    if (!filePath) {
      throw new Error("URL file tidak valid");
    }

    const { error } = await supabase.storage.from("files").remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      throw new Error(`Hapus file gagal: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Delete file from Supabase error:", error);
    throw error;
  }
}
