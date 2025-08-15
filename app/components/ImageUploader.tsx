import { useRef, useState, useEffect, type ChangeEvent } from "react";

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
  margin-bottom: 1rem;
`;

const PreviewImg = styled.img<{ selected?: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid ${({ selected }) => (selected ? "#007bff" : "#ddd")};
  cursor: pointer;
  box-shadow: ${({ selected }) => (selected ? "0 0 0 2px #007bff33" : "none")};
`;

const LargePreviewWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const LargePreviewImg = styled.img`
  max-width: 100%;
  max-height: 360px;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px #0001;
  background: #fafbfc;
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [previewUrls]);

  const uploadCountText = uploadedFileCount ? (
    <>
      <b>{uploadedFileCount}</b> image{uploadedFileCount > 1 ? "s" : ""}{" "}
      selected
    </>
  ) : (
    "Select images to upload"
  );

  return (
    <Section>
      <SectionTitle>Upload</SectionTitle>
      <UploadCount>{uploadCountText}</UploadCount>
      {previewUrls && previewUrls.length > 0 && (
        <>
          <LargePreviewWrapper>
            <LargePreviewImg
              src={previewUrls[selectedImageIndex]}
              alt={`Large preview ${selectedImageIndex + 1}`}
            />
          </LargePreviewWrapper>
          <PreviewGrid>
            {previewUrls.map((url, index) => (
              <PreviewImg
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                selected={index === selectedImageIndex}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </PreviewGrid>
        </>
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
