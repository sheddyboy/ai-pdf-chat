import { slugify } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import { loadPdfFileToPinecone } from "@/actions/server/files.server";
import { createChat } from "@/actions/server/chat.server";

export async function uploadFileAndCreateChat(file: File) {
  try {
    const { data: uploadFileData, error: uploadFileError } =
      await uploadFile(file);

    if (uploadFileError !== null) {
      return { data: null, error: uploadFileError };
    }
    const { path, publicUrl, userId, fileName } = uploadFileData;
    const {
      data: loadPdfFileToPineconeData,
      error: loadPdfFileToPineconeError,
    } = await loadPdfFileToPinecone(path);

    if (loadPdfFileToPineconeError !== null) {
      return { data: null, error: loadPdfFileToPineconeError };
    }
    const { data, error } = await createChat({
      userId,
      pdfUrl: publicUrl,
      pdfName: fileName,
      pineconeNamespace: path,
    });

    if (error !== null) {
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}

export async function uploadFile(file: File) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    return { data: null, error: userError.message };
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(
      userData.user.id + "/" + slugify(file.name) + "_" + Date.now().toString(),
      file,
    );

  if (uploadError) {
    return { data: null, error: uploadError.message };
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(uploadData.path);

  return {
    data: {
      ...uploadData,
      publicUrl,
      userId: userData.user.id,
      fileName: file.name,
    },
    error: null,
  };
}
