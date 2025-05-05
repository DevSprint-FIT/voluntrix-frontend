import React, { useEffect, useState } from "react";
import uploadImage from "@/utils/uploadImage";
import { Image as ImageIcon } from "lucide-react";

interface PostModalProps {
  onClose: () => void;
  onSubmit: (
    content: string,
    mediaUrl?: string,
    mediaSizeInBytes?: number,
    mediaType?: "TEXT" | "IMAGE" | "VIDEO",
    postId?: number 
  ) => void;
  organizationName: string;
  organizationImageUrl?: string;
  initialContent?: string;
  initialImageUrl?: string;
  postId?: number;
}

const PostModal: React.FC<PostModalProps> = ({
  onClose,
  onSubmit,
  organizationName,
  organizationImageUrl,
  initialContent = '',
  initialImageUrl = '',
  postId
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
    let uploadedUrl = previewImage;
    let fileSize = imageFile?.size || 0;
    let mediaType: "TEXT" | "IMAGE" | "VIDEO" = "TEXT";

    try {
      if (imageFile) {
        const uploadedResult = await uploadImage(imageFile);
        uploadedUrl = uploadedResult.url;
        mediaType = imageFile.type.startsWith("video") ? "VIDEO" : "IMAGE";
      } else if (previewImage) {
        mediaType = "IMAGE";
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {postId ? "Edit Post" : "Create Post"}
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex items-center gap-3 mb-4">
          <label className="cursor-pointer text-verdant-600 flex items-center gap-2">
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
          <button
           onClick={handleSubmit}
           disabled={isUploading}
           className="bg-verdant-500 text-white px-4 py-2 rounded-full hover:bg-verdant-300"
        >
          {isUploading ? "Submitting..." : postId ? "Update" : "Post"}
        </button>
        </div>
        
      </div>
    </div>
  );
};

export default PostModal;
