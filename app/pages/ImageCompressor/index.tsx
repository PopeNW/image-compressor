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
  width: min(100%, 76rem);
  margin: 0 auto;
  padding: clamp(1.25rem, 4vw, 3.5rem);
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 520px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Intro = styled.div`
  max-width: 42rem;
`;

const Subtitle = styled.p`
  max-width: 38rem;
  margin: -1rem 0 0;
  color: var(--text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
`;

const ThemeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  flex-shrink: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
`;

const ThemeButton = styled.button<{ $active: boolean }>`
  padding: 0.55rem 0.8rem;
  border: 0;
  border-radius: 0.55rem;
  color: ${({ $active }) =>
    $active ? "var(--text-primary)" : "var(--text-secondary)"};
  background: ${({ $active }) =>
    $active ? "var(--surface-muted)" : "transparent"};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
`;

const FlexLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
  gap: 1.25rem;

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ImageCompressor = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
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

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("image-compressor-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const handleThemeChange = (nextTheme: "light" | "dark") => {
    window.localStorage.setItem("image-compressor-theme", nextTheme);
    setTheme(nextTheme);
  };

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
      <Header>
        <Intro>
          <PageTitle>Image Compressor</PageTitle>
          <Subtitle>
            Compress images in your browser, then download them together in one
            ZIP. Your files stay on your device.
          </Subtitle>
        </Intro>
        <ThemeControl role="group" aria-label="Color theme">
          <ThemeButton
            type="button"
            $active={theme === "light"}
            aria-pressed={theme === "light"}
            onClick={() => handleThemeChange("light")}
          >
            Light
          </ThemeButton>
          <ThemeButton
            type="button"
            $active={theme === "dark"}
            aria-pressed={theme === "dark"}
            onClick={() => handleThemeChange("dark")}
          >
            Dark
          </ThemeButton>
        </ThemeControl>
      </Header>
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
