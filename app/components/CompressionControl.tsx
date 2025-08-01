import { Button } from "./Button";
import { ProgressBar } from "./ProgressBar";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";

interface CompressButtonProps {
  handleCompression: () => void;
  isCompressing: boolean;
  hasUploadedImages: boolean;
}

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

export const CompressionControl = ({
  uploadedFileCount,
  handleCompression,
  isCompressing,
  progress,
}: {
  uploadedFileCount: number;
  handleCompression: () => void;
  isCompressing: boolean;
  progress: number;
}) => {
  return (
    <Section>
      <SectionTitle>Compress Images</SectionTitle>
      <p className="mb-4">
        {uploadedFileCount > 0
          ? `${uploadedFileCount} image${
              uploadedFileCount !== 1 ? "s" : ""
            } selected for compression`
          : "No images selected"}
      </p>
      <ProgressBar progress={progress} />
      <CompressButton
        handleCompression={handleCompression}
        isCompressing={isCompressing}
        hasUploadedImages={uploadedFileCount > 0}
      />
    </Section>
  );
};
