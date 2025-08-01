import { Button } from "./Button";
import { DownloadLink } from "./DownloadImages";
import { ProgressBar } from "./ProgressBar";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
import styled from "styled-components";

interface CompressButtonProps {
  handleCompression: () => void;
  isCompressing: boolean;
  hasUploadedImages: boolean;
}

const OptionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1em;
  justify-content: center;
  margin: 1em 0;
`;

const CompressButton = ({
  handleCompression,
  isCompressing,
  hasUploadedImages,
}: CompressButtonProps) => {
  return (
    <Button
      onClick={handleCompression}
      disabled={isCompressing || !hasUploadedImages}
    >
      {isCompressing ? "Compressing..." : "Compress"}
    </Button>
  );
};

const Text = styled.p`
  margin: 0.5rem 0;
  color: #555;
`;

interface CompressionDescriptionProps {
  uploadedFileCount: number;
  compressedFileCount: number;
}

const CompressionDescription = ({
  uploadedFileCount,
  compressedFileCount,
}: CompressionDescriptionProps) => {
  if (compressedFileCount > 0) {
    return (
      <Text>
        Compressed {compressedFileCount} image
        {compressedFileCount !== 1 ? "s" : ""}
      </Text>
    );
  }

  if (uploadedFileCount === 0) {
    return <Text>No images selected for compression</Text>;
  }

  return (
    <Text>
      {uploadedFileCount} image{uploadedFileCount !== 1 ? "s" : ""} selected for
      compression
    </Text>
  );
};

interface CompressionControlProps {
  uploadedFileCount: number;
  compressedFileCount: number;
  handleCompression: () => void;
  isCompressing: boolean;
  progress: number;
  zipBlob: Blob | null;
}

export const CompressionControl = ({
  uploadedFileCount,
  compressedFileCount,
  handleCompression,
  isCompressing,
  progress,
  zipBlob,
}: CompressionControlProps) => {
  return (
    <Section>
      <SectionTitle>Compress Images</SectionTitle>
      <CompressionDescription
        uploadedFileCount={uploadedFileCount}
        compressedFileCount={compressedFileCount}
      />

      <ProgressBar progress={progress} />
      <OptionsWrapper>
        <CompressButton
          handleCompression={handleCompression}
          isCompressing={isCompressing}
          hasUploadedImages={uploadedFileCount > 0}
        />
        <DownloadLink zipBlob={zipBlob} />
      </OptionsWrapper>
    </Section>
  );
};
