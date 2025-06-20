import imageCompression from "browser-image-compression";
import { useState, type ChangeEvent } from "react";

export function Welcome() {
  const [uploaded, setUploaded] = useState(0);
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<File | null>(null);

  // File Upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOriginalImage(e.target.files[0]);
      setUploaded(1);
    }
  };

  // File Compression
  const handleCompression = () => {
    if (originalImage && uploaded) {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 864,
        useWebWorker: true,
      };
      imageCompression(originalImage, options).then((img) => {
        setCompressedImage(img);
      });
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Image compression with
        <span className="text-blue-600"> browser-image-compression </span>
        dependency!
      </h1>
      <div className="flex flex-col items-center mb-4">
        <input
          className="bg-gray-100 p-2 rounded transition hover:bg-gray-200 hover:ring-2 hover:ring-blue-400"
          type="file"
          onChange={handleFileUpload}
        />
      </div>
      <br />
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleCompression}
      >
        Compress
      </button>

      <div className="flex flex-col items-center">
        <h3>Original Image Size: {originalImage?.size}</h3>
        <h3>Compressed Image size: {compressedImage?.size}</h3>
        {compressedImage && (
          <a
            href={URL.createObjectURL(compressedImage)}
            download={`compressed-${originalImage?.name}`}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download Compressed Image
          </a>
        )}
      </div>
    </main>
  );
}
