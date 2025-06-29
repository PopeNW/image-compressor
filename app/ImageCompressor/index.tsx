import { useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import imageCompression from "browser-image-compression";

export function ImageCompressor() {
  const [uploaded, setUploaded] = useState(0);
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<File[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);

  // File Upload (bulk)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setOriginalImages(files);
      setUploaded(1);
      setOverallProgress(0);
      setCompressedImages([]);
      setZipBlob(null);
    }
  };

  // File Compression (bulk) with overall progress estimation
  const handleCompression = async () => {
    if (originalImages.length && uploaded) {
      setIsCompressing(true);
      setOverallProgress(0);

      // Create an array to store progress for each file
      const progressArr = Array(originalImages.length).fill(0);

      // Start all compressions in parallel
      const compressions = originalImages.map((file, idx) =>
        imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 864,
          useWebWorker: true,
          onProgress: (progress: number) => {
            progressArr[idx] = progress;
            // Calculate average progress
            const avg =
              progressArr.reduce((sum, val) => sum + val, 0) /
              progressArr.length;
            setOverallProgress(Math.round(avg));
          },
        })
      );

      const compressed = await Promise.all(compressions);
      setCompressedImages(compressed);

      // Create ZIP
      const zip = new JSZip();
      compressed.forEach((img, idx) => {
        zip.file(originalImages[idx].name, img);
      });
      const content = await zip.generateAsync({ type: "blob" });
      setZipBlob(content);
      setOverallProgress(100);
      setIsCompressing(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">
        Image compressor with{" "}
        <span className="text-blue-600">
          <a
            href="https://github.com/Donaldcwl/browser-image-compression"
            target="_blank"
            rel="noopener noreferrer"
          >
            browser-image-compression
          </a>
        </span>
      </h1>
      <br />
      <div className="flex flex-row items-center mb-4 gap-4">
        {/* File picker for individual files */}
        <label className="bg-gray-100 p-2 rounded cursor-pointer transition hover:bg-gray-200 hover:ring-2 hover:ring-blue-400">
          Select Images
          <input
            className="hidden"
            type="file"
            multiple
            onChange={handleFileUpload}
            accept="image/*"
          />
        </label>
        {/* Folder picker for directories */}
        <label className="bg-gray-100 p-2 rounded cursor-pointer transition hover:bg-gray-200 hover:ring-2 hover:ring-blue-400">
          Select Folder
          <input
            className="hidden"
            type="file"
            multiple
            // @ts-ignore
            webkitdirectory="true"
            onChange={handleFileUpload}
            accept="image/*"
          />
        </label>
      </div>
      <br />

      <div className="flex flex-col items-center">
        <h3>Original Images: {originalImages.length}</h3>
        <h3>Compressed Images: {compressedImages.length}</h3>
      </div>
      <br />

      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleCompression}
        disabled={isCompressing || originalImages.length === 0}
      >
        {isCompressing ? "Compressing..." : "Compress"}
      </button>
      <br />

      {/* Progress Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${overallProgress}%` }}
        ></div>
        <div className="text-center text-sm mt-1">{overallProgress}%</div>
      </div>
      <br />

      <div className="flex flex-col items-center min-h-[48px]">
        <a
          href={zipBlob ? URL.createObjectURL(zipBlob) : undefined}
          download="compressed-images.zip"
          className={`mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
            zipBlob ? "" : "invisible"
          }`}
          tabIndex={zipBlob ? 0 : -1}
          aria-disabled={!zipBlob}
        >
          Download All Compressed Images (ZIP)
        </a>
      </div>
    </main>
  );
}
