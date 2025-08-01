import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
import styled from "styled-components";

interface CompressButtonProps {
  handleCompression: () => void;
  isCompressing: boolean;
  hasUploadedImages: boolean;
}

const StyledCompressionButton = styled(Button)`
  margin-top: auto;
`;

const CompressButton = ({
  handleCompression,
  isCompressing,
  hasUploadedImages,
}: CompressButtonProps) => {
  return (
    <StyledCompressionButton
      onClick={handleCompression}
      disabled={isCompressing || !hasUploadedImages}
    >
      {isCompressing ? "Compressing Images..." : "Compress Images"}
    </StyledCompressionButton>
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
}

export const CompressionControl = ({
  uploadedFileCount,
  compressedFileCount,
  handleCompression,
  isCompressing,
  progress,
}: CompressionControlProps) => {
  return (
    <Section>
      <SectionTitle>Compress</SectionTitle>
      <CompressionDescription
        uploadedFileCount={uploadedFileCount}
        compressedFileCount={compressedFileCount}
      />
      <ProgressBar progress={progress} />
      <CompressButton
        handleCompression={handleCompression}
        isCompressing={isCompressing}
        hasUploadedImages={uploadedFileCount > 0}
      />
    </Section>
  );
};
