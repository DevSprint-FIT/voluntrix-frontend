import axios from "axios";

export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = "drbmpcktx";
  const uploadPreset = "event_images";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );

  return res.data.secure_url;
}
