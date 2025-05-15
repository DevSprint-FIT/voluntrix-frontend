import React, { useEffect, useState } from "react";
import uploadImage from "@/utils/uploadImage";
import { Image as ImageIcon, Underline } from "lucide-react";
import {Textarea} from "@heroui/react";
import { Button } from "@heroui/button";

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
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-shark-500 hover:text-shark-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-secondary font-semibold mb-4">
          {isEditing ? "Edit Post" : "Create Post"}
        </h2>

        <Textarea
           value={content}
           onChange={(e) => setContent(e.target.value)}
           placeholder="What do you want to talk about?"
           minRows={7}
           className="w-full h-24 mb-3"
        />


        <div className="flex items-center gap-3 mb-4">
          <label className="cursor-pointer text-shark-600 flex items-center gap-2">
            <ImageIcon size={18} />
             <input 
               type="file"
               accept="image/*, video/*"
               className="hidden" 
               onChange={handleFileChange} />
          </label>
          {previewImage && imageFile?.type?.startsWith("video") ? (
            <video src={previewImage} controls className="h-32 rounded" />
          ) : previewImage ? (
            <img src={previewImage} alt="Preview" className="h-16 rounded" />
          ) : null}
        </div>
        <div className="flex justify-end">
          <Button
           onPress={handleSubmit}
           disabled={isUploading}
           className="bg-shark-950 text-white px-4 py-2 rounded-full hover:bg-shark-400"
        >
          {isUploading ? "Submitting..." : isEditing ? "Update" : "Post"}
        </Button>
        </div>
        
      </div>
    </div>
  );
};

export default PostModal;
