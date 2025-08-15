import { useRef, type ChangeEvent } from "react";

import styled from "styled-components";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
import { Button } from "./Button";

const HiddenInput = styled.input`
  display: none;
`;

const UploadCount = styled.p`
  margin: 0.5rem 0;
  color: #555;
`;

const StyledUploadButton = styled(Button)`
  margin-top: auto;
`;

const PreviewGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const PreviewImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

interface UploadOptionsProps {
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  uploadedFileCount?: number;
  previewUrls?: string[];
}

const ImageUploader = ({
  handleFileUpload,
  uploadedFileCount,
  previewUrls,
}: UploadOptionsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadCountText = uploadedFileCount
    ? `${uploadedFileCount} image${uploadedFileCount > 1 ? "s" : ""} selected`
    : "Select images to upload";

  return (
    <Section>
      <SectionTitle>Upload</SectionTitle>
      <UploadCount>{uploadCountText}</UploadCount>
      {previewUrls && previewUrls.length > 0 && (
        <PreviewGrid>
          {previewUrls.map((url, index) => (
            <PreviewImg key={index} src={url} alt={`Preview ${index + 1}`} />
          ))}
        </PreviewGrid>
      )}
      <HiddenInput
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        accept="image/*"
      />
      <StyledUploadButton onClick={() => inputRef.current?.click()}>
        Choose Images
      </StyledUploadButton>
    </Section>
  );
};

export { ImageUploader };
