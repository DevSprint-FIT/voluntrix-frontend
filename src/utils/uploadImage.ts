import ImageKit from "imagekit-javascript";

const uploadImage = async (file: File): Promise<any> => {
  // Get JWT token from environment variable
  const jwtToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  
  if (!jwtToken) {
    console.error("No authentication token found in environment variables");
    throw new Error("Authentication token not found. Please check your environment variables or login again.");
  }

  const authRes = await fetch("http://localhost:8080/api/public/imagekit/auth", {
    headers: {
      'Authorization': `Bearer ${jwtToken}`
    }
  });

  console.log("Auth response:", authRes);
  if (!authRes.ok) {
    throw new Error("Failed to get ImageKit authentication. Status: " + authRes.status);
  }
  
  const { token, expire, signature } = await authRes.json();

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  });

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file,
        fileName: file.name,
        token,
        expire,
        signature,
      },
      (err: any, result: any) => {
        if (err) {
          console.error("Upload failed:", err);
          reject(err);
        } else {
          console.log("Upload successful:", result);
          resolve(result);
        }
      }
    );
  });
};

export default uploadImage;
