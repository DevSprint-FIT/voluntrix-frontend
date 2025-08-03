import React, { useEffect, useState } from "react";
import uploadImage from "@/utils/uploadImage";
import { Image as ImageIcon, Pencil } from "lucide-react";
import {Textarea} from "@heroui/react";
import { Button } from "@heroui/button";
import Image from "next/image";

interface PostModalProps {
  onClose: () => void;
  onSubmit: (
    content: string,
    mediaUrl?: string,
    mediaSizeInBytes?: number,
    mediaType?: "NONE" | "IMAGE" | "VIDEO",
    postId?: number 
  ) => void;
  organizationName: string;
  organizationImageUrl?: string;
  initialContent?: string;
  initialImageUrl?: string;
  postId?: number;
  isEditing?: boolean;
}

const PostModal: React.FC<PostModalProps> = ({
  onClose,
  onSubmit,
  organizationName,
  organizationImageUrl,
  initialContent = '',
  initialImageUrl = '',
  postId,
  isEditing
}) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setPreviewImage(initialImageUrl);
  }, [initialContent, initialImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file){
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      let uploadedUrl: string | undefined = undefined;
      let fileSize: number | undefined = undefined;
      let mediaType: "NONE" | "IMAGE" | "VIDEO" | undefined = undefined;
  
      if (imageFile) {
        const uploadedResult = await uploadImage(imageFile);
        uploadedUrl = uploadedResult.url;
        fileSize = imageFile.size;
        mediaType = imageFile.type.startsWith("video") ? "VIDEO" : "IMAGE";
      } else if (previewImage && previewImage !== "") {
        mediaType = "IMAGE"; 
        uploadedUrl = previewImage;
      } else {
        mediaType = "NONE";
        uploadedUrl = undefined;
      }
  
      await onSubmit(content, uploadedUrl, fileSize, mediaType, postId); 
      onClose();
    } catch (error) {
      console.error("Error during image upload or post submission:", error);
      alert("Failed to upload image or submit post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-shark-950 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-xl max-h-[85vh] overflow-y-auto shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-shark-500 hover:text-shark-700"
        >
          ✕
        </button>

        {isEditing ? (
           <h2 className="text-lg font-secondary font-semibold mb-4">
              Edit Post
           </h2>
        ) : (
        <div className="flex items-center gap-3 mb-4">
           {organizationImageUrl && (
             <Image
                src={organizationImageUrl}
                alt={organizationName}
                className="rounded-full object-cover"
                width={40}
                height={40}
             />
           )}
          <div className="flex flex-col">
             <span className="font-semibold font-secondary ">{organizationName}</span>
             <span className="text-sm text-shark-500 -mt-1">Post to Anyone</span>
          </div>
        </div>
    )}


        <Textarea
           value={content}
           onChange={(e) => setContent(e.target.value)}
           placeholder="What do you want to talk about?"
           minRows={6}
           maxRows={8}
           variant="flat"
           classNames={{
              input: "focus:ring-0 focus:outline-none !border-0 focus:!border-0",
              inputWrapper: "!border-0 focus:!border-0 !shadow-none data-[focus=true]:!border-0 data-[hover=true]:!border-0"
      }}
           className="w-full   " 
        />


       <div className="flex flex-col gap-3 mb-4">
         {previewImage && imageFile?.type?.startsWith("video") ? (
           <video
            src={previewImage}
            controls
            className="w-full max-w-md max-h-[28rem] rounded-lg object-contain mx-auto"
           />
         ) : previewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt="Preview"
            className="w-full max-w-md max-h-[28rem] rounded-lg object-contain mx-auto pt-2"
           />
        ) : null}

      <label className="cursor-pointer text-shark-600 flex items-center gap-2 self-start pt-6">
         {previewImage ? (
        <>
        <Pencil size={18} />
        <span className="text-sm">Change Media</span>
        </>
      ) : (
      <>
        <ImageIcon size={18} />
        <span className="text-sm">Add Media</span>
      </>
    )}
       <input
          type="file"
          accept="image/*, video/*"
          className="hidden"
          onChange={handleFileChange}
       />
      </label>
     </div>
        <div className="flex justify-end">
          <Button
           onPress={handleSubmit}
           disabled={isUploading}
           className="bg-shark-950 text-white px-4 py-2 !rounded-full hover:bg-shark-400"
        >
          {isUploading ? "Submitting..." : isEditing ? "Update" : "Post"}
        </Button>
        </div>
        
      </div>
    </div>
  );
};

export default PostModal;
