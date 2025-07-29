import ImageKit from "imagekit-javascript";
import authService from "@/services/authService";

// Get API base URL 
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

const uploadImage = async (file: File): Promise<any> => {
  try {
    console.log("Starting image upload process...");
    
    // Use consistent base URL and auth headers
    const baseUrl = getBaseUrl();
    const authRes = await fetch(`${baseUrl}/api/public/imagekit/auth`, {
      method: 'GET',
      headers: authService.getAuthHeaders()
    });

    console.log("Auth response status:", authRes.status);
    console.log("Auth response ok:", authRes.ok);
    
    if (!authRes.ok) {
      const errorText = await authRes.text();
      console.error("ImageKit auth API error:", errorText);
      throw new Error(`Failed to get ImageKit authentication: ${authRes.status} - ${errorText}`);
    }
    
    const authData = await authRes.json();
    console.log("Auth data received:", authData);
    
    const { token, expire, signature } = authData;

    if (!token || !expire || !signature) {
      console.error("Missing auth data:", { token: !!token, expire: !!expire, signature: !!signature });
      throw new Error("Incomplete authentication data received from server");
    }

    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY) {
      throw new Error("NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not set");
    }
    
    if (!process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
      throw new Error("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set");
    }

    console.log("Initializing ImageKit...");
    const imagekit = new ImageKit({
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });

    console.log("Starting ImageKit upload...");
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
            console.error("ImageKit upload failed:", err);
            reject(new Error(`Upload failed: ${err.message || 'Unknown error'}`));
          } else {
            console.log("ImageKit upload successful:", result);
            resolve(result);
          }
        }
      );
    });

  } catch (error) {
    console.error("Error in uploadImage function:", error);
    throw error;
  }
};

export default uploadImage;