import { useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import imageCompression from "browser-image-compression";
import { Settings } from "~/components/Settings";
import { Main } from "~/components/Main";
import { PageTitle } from "~/components/PageTitle";
import { ImageUploader } from "~/components/ImageUploader";
import { Section } from "~/components/Section";
import { SectionTitle } from "~/components/SectionTitle";
import { CompressionControl } from "~/components/CompressionControl";
import { DownloadImages } from "~/components/DownloadImages";

// Main component for Image Compressor
const ImageCompressor = () => {
  const [uploaded, setUploaded] = useState(0);
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [_compressedImages, setCompressedImages] = useState<File[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [maxSizeMB, setMaxSizeMB] = useState(2);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(864);

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
          maxSizeMB: maxSizeMB,
          maxWidthOrHeight: maxWidthOrHeight,
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
    <Main>
      <PageTitle>Image Compressor</PageTitle>

      <Settings
        maxSizeMB={maxSizeMB}
        setMaxSizeMB={setMaxSizeMB}
        maxWidthOrHeight={maxWidthOrHeight}
        setMaxWidthOrHeight={setMaxWidthOrHeight}
      />

      <ImageUploader
        handleFileUpload={handleFileUpload}
        uploadedFileCount={originalImages.length}
      />

      <CompressionControl
        uploadedFileCount={originalImages.length}
        handleCompression={handleCompression}
        isCompressing={isCompressing}
        progress={overallProgress}
      />

      <DownloadImages zipBlob={zipBlob} />
    </Main>
  );
};

export { ImageCompressor };
