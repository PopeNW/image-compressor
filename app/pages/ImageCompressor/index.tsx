import { useEffect, useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import imageCompression from "browser-image-compression";
import styled from "styled-components";

import { PageTitle } from "~/components/PageTitle";
import { ImageUploader } from "~/components/ImageUploader";
import { CompressionControl } from "~/components/CompressionControl";
import { DownloadImages } from "~/components/DownloadImages";
import { compressImages, getUniqueArchiveNames } from "./compression";

const COMPRESSION_PROGRESS_WEIGHT = 80;

const Main = styled.main`
  margin: auto;
  padding: 2rem;
`;

const FlexLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 45rem;
  margin: auto;
`;

const ImageCompressor = () => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<File[]>([]);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [progressPhase, setProgressPhase] = useState("Ready");
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [maxSizeMB, setMaxSizeMB] = useState(2);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(864);

  const handleFilesSelected = ({
    currentTarget,
  }: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(currentTarget.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );

    setOriginalImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
    setCompressedImages([]);
    setZipBlob(null);
    setOverallProgress(0);
    setProgressPhase("Ready");
    setCompressionError(null);
    currentTarget.value = "";
  };

  const handleCompress = async () => {
    if (originalImages.length === 0) {
      return;
    }

    setCompressedImages([]);
    setZipBlob(null);
    setOverallProgress(0);
    setProgressPhase("Ready");

    if (!Number.isFinite(maxSizeMB) || maxSizeMB <= 0) {
      setCompressionError("Maximum file size must be greater than 0 MB.");
      return;
    }

    if (
      !Number.isFinite(maxWidthOrHeight) ||
      maxWidthOrHeight <= 0 ||
      !Number.isInteger(maxWidthOrHeight)
    ) {
      setCompressionError(
        "Maximum width/height must be a positive whole number of pixels."
      );
      return;
    }

    setIsCompressing(true);
    setProgressPhase("Compressing images");
    setCompressionError(null);

    try {
      const compressed = await compressImages(
        originalImages,
        { maxSizeMB, maxWidthOrHeight, useWebWorker: true },
        (progress) =>
          setOverallProgress(
            Math.round((progress * COMPRESSION_PROGRESS_WEIGHT) / 100)
          )
      );

      setProgressPhase("Creating ZIP archive");
      setOverallProgress(COMPRESSION_PROGRESS_WEIGHT);

      const zip = new JSZip();
      const archiveNames = getUniqueArchiveNames(originalImages);
      compressed.forEach((image, index) => {
        zip.file(archiveNames[index], image);
      });

      const content = await zip.generateAsync(
        { type: "blob" },
        ({ percent }) =>
          setOverallProgress(
            COMPRESSION_PROGRESS_WEIGHT +
              Math.round((percent * (100 - COMPRESSION_PROGRESS_WEIGHT)) / 100)
          )
      );
      setCompressedImages(compressed);
      setZipBlob(content);
      setOverallProgress(100);
      setProgressPhase("Complete");
    } catch (error) {
      setProgressPhase("Failed");
      setCompressionError(
        error instanceof Error
          ? error.message
          : "Unable to compress images or create the ZIP archive."
      );
    } finally {
      setIsCompressing(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <Main>
      <PageTitle>Image Compressor</PageTitle>
      <FlexLayout>
        <ImageUploader
          onFilesSelected={handleFilesSelected}
          previewUrls={previewUrls}
          disabled={isCompressing}
        />
        <CompressionControl
          uploadedFileCount={originalImages.length}
          compressedFileCount={compressedImages.length}
          onCompress={handleCompress}
          isCompressing={isCompressing}
          progress={overallProgress}
          progressPhase={progressPhase}
          error={compressionError}
          maxSizeMB={maxSizeMB}
          setMaxSizeMB={setMaxSizeMB}
          maxWidthOrHeight={maxWidthOrHeight}
          setMaxWidthOrHeight={setMaxWidthOrHeight}
        />
        <DownloadImages
          zipBlob={zipBlob}
          compressedFileCount={compressedImages.length}
        />
      </FlexLayout>
    </Main>
  );
};

export { ImageCompressor };
