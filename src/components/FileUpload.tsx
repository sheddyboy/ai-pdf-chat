"use client";
import { uploadFileAndCreateChat } from "@/actions/client/files.client";
import { Download, Inbox, LoaderCircle, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/lib/reactQuery";
interface FileUploadProps {
  isButton?: boolean;
}

export default function FileUpload({ isButton }: FileUploadProps) {
  const router = useRouter();
  const reactQuery = getQueryClient();
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps, isDragAccept, isDragActive } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      disabled: loading,
      maxSize: 5 * 1024 * 1024,
      onDrop: (acceptedFiles, fileRejections, event) => {
        if (acceptedFiles.length > 0) {
          setLoading(true);
          toast.promise(uploadFileAndCreateChat(acceptedFiles[0]), {
            success: ({ data, error }) => {
              if (error !== null) {
                throw new Error(error);
              }
              const url = `/chats/${data.id}`;
              reactQuery.invalidateQueries({ queryKey: ["chats"] });
              router.push(url);
              return "Uploaded";
            },
            error: (err: Error) => {
              return err.message;
            },
            loading: "Uploading...",
            finally: () => {
              setLoading(false);
            },
          });
        }
      },
      onDropRejected: (rejectedFiles, event) => {
        toast.error(rejectedFiles[0].errors[0].message);
      },
    });
  return (
    <>
      {isButton ? (
        <Button
          {...getRootProps()}
          className="w-full overflow-hidden border border-dashed border-white"
        >
          <input {...getInputProps()} />
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      ) : (
        <div className="flex rounded-2xl bg-white p-2">
          <div
            {...getRootProps({
              className:
                "border-dashed border-2 rounded-xl w-full cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
            })}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Download className="h-10 w-10 animate-bounce text-blue-500" />
            ) : loading ? (
              <LoaderCircle className="h-10 w-10 animate-spin text-blue-500" />
            ) : (
              <Inbox className="h-10 w-10 text-blue-500" />
            )}
            <p className="m-2 text-center text-sm text-slate-400">
              Drop PDF Here
            </p>
          </div>
        </div>
      )}
    </>
  );
}
