"use server";
import { createClient } from "@/lib/supabase/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { LangChainDocument } from "@/types";
import pc, { embedDocument, prepareDocument } from "@/lib/pinecone";

export async function downloadFile(filePath: string) {
  const supabase = createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return { data: null, error: userError.message };
  }

  const { data: fileData, error: fileError } = await supabase.storage
    .from("images")
    .download(filePath);

  if (fileError) {
    return { data: null, error: fileError.message };
  }

  try {
    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const outputPath = path.join("/tmp", `pdf-${Date.now()}.pdf`);
    const file = fs.createWriteStream(outputPath);
    file.write(buffer);
    file.end();

    const data = await new Promise<string>((resolve, reject) => {
      file.on("finish", () => {
        resolve(outputPath);
      });

      file.on("error", (err) => {
        reject(new Error(`File write failed: ${err.message}`));
      });
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}

export async function loadPdfFileToPinecone(filePath: string) {
  try {
    // download pdf
    const { data: fileName, error } = await downloadFile(filePath);
    if (error !== null) {
      return {
        data: null,
        error,
      };
    }
    // split pdf into pages
    const loader = new PDFLoader(fileName);
    const pages = (await loader.load()) as unknown as LangChainDocument[];
    // // split pages into segments
    const documents = await Promise.all(pages.map(prepareDocument));
    // // vectorized each segments
    const vectors = await Promise.all(documents.flat().map(embedDocument));
    // // upload vectors to pinecone
    const pineconeIndex = pc.Index("chat-with-pdf");
    const namespace = pineconeIndex.namespace(filePath);
    await namespace.upsert(vectors);
    return { data: "Loaded to pinecone", error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}
