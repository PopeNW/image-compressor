import styled from "styled-components";

import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
import { Settings } from "./Settings";

const Text = styled.p`
  margin-bottom: 1rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

interface CompressionStatusProps {
  uploadedFileCount: number;
  compressedFileCount: number;
}

const CompressionStatus = ({
  uploadedFileCount,
  compressedFileCount,
}: CompressionStatusProps) => {
  if (compressedFileCount > 0) {
    return (
      <Text>
        Compressed <b>{compressedFileCount}</b> image
        {compressedFileCount !== 1 ? "s" : ""}
      </Text>
    );
  }

  if (uploadedFileCount === 0) {
    return <Text>No images selected for compression</Text>;
  }

  return (
    <Text>
      <b>{uploadedFileCount}</b> image{uploadedFileCount !== 1 ? "s" : ""}{" "}
      selected for compression
    </Text>
  );
};

interface CompressionControlProps {
  uploadedFileCount: number;
  compressedFileCount: number;
  onCompress: () => void;
  isCompressing: boolean;
  progress: number;
  progressPhase: string;
  error: string | null;
  maxSizeMB: number;
  setMaxSizeMB: (size: number) => void;
  maxWidthOrHeight: number;
  setMaxWidthOrHeight: (size: number) => void;
}

export const CompressionControl = ({
  uploadedFileCount,
  compressedFileCount,
  onCompress,
  isCompressing,
  progress,
  progressPhase,
  error,
  maxSizeMB,
  setMaxSizeMB,
  maxWidthOrHeight,
  setMaxWidthOrHeight,
}: CompressionControlProps) => {
  return (
    <Section>
      <SectionTitle>Compress</SectionTitle>
      <CompressionStatus
        uploadedFileCount={uploadedFileCount}
        compressedFileCount={compressedFileCount}
      />
      <Settings
        maxSizeMB={maxSizeMB}
        setMaxSizeMB={setMaxSizeMB}
        maxWidthOrHeight={maxWidthOrHeight}
        setMaxWidthOrHeight={setMaxWidthOrHeight}
      />
      <ProgressBar progress={progress} phase={progressPhase} />
      <Button
        onClick={onCompress}
        disabled={isCompressing || uploadedFileCount === 0}
      >
        {isCompressing ? "Compressing Images..." : "Compress Images"}
      </Button>
      {error && <Text role="alert">{error}</Text>}
    </Section>
  );
};
