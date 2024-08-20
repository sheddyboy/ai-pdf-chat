import { slugify } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import { loadPdfFileToPinecone } from "@/actions/server/files.server";
import { createChat } from "@/actions/server/chat.server";

export async function uploadFileAndCreateChat(file: File) {
  try {
    const { path, publicUrl, userId, fileName } = await uploadFile(file);
    await loadPdfFileToPinecone(path);
    const data = await createChat({
      userId,
      pdfUrl: publicUrl,
      pdfName: fileName,
      pineconeNamespace: path,
    });

    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function uploadFile(file: File) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(
      userData.user.id + "/" + slugify(file.name) + "_" + Date.now().toString(),
      file,
    );

  if (uploadError) {
    throw new Error(uploadError.message);
  }
  const {
    data: { publicUrl },
  } = supabase.storage.from("images").getPublicUrl(uploadData.path);

  return {
    ...uploadData,
    publicUrl,
    userId: userData.user.id,
    fileName: file.name,
  };
}
