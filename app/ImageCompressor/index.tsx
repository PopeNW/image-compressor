import { useEffect, useRef, useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import imageCompression from "browser-image-compression";

export function ImageCompressor() {
  const [uploaded, setUploaded] = useState(0);
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<File[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  // File Upload (bulk)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setOriginalImages(files);
      setUploaded(1);
    }
  };

  // File Compression (bulk)
  const handleCompression = async () => {
    if (originalImages.length && uploaded) {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 864,
        useWebWorker: true,
        onProgress: (progress: number) => {
          console.log(`Compression progress: ${progress}%`);
        },
      };
      const compressed = await Promise.all(
        originalImages.map((file) => imageCompression(file, options))
      );
      setCompressedImages(compressed);

      // Create ZIP
      const zip = new JSZip();
      compressed.forEach((img, idx) => {
        zip.file(originalImages[idx].name, img);
      });
      const content = await zip.generateAsync({ type: "blob" });
      setZipBlob(content);
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
          multiple
          // @ts-ignore
          webkitdirectory="true"
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
        <h3>Original Images: {originalImages.length}</h3>
        <h3>Compressed Images: {compressedImages.length}</h3>
        {zipBlob && (
          <a
            href={URL.createObjectURL(zipBlob)}
            download="compressed-images.zip"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Download All Compressed Images (ZIP)
          </a>
        )}
      </div>
    </main>
  );
}
