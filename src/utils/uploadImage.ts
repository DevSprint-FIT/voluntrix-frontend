import ImageKit from "imagekit-javascript";

const uploadImage = async (file: File): Promise<any> => {
  const authRes = await fetch("http://localhost:8080/api/public/imagekit/auth");

  console.log("Auth response:", authRes);
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
