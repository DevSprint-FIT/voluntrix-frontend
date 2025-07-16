export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = 'drbmpcktx';
  const uploadPreset = 'event_images';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
}
