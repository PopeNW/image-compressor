import { useEffect, useRef, useState, type ChangeEvent } from "react";
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

const PreviewButton = styled.button`
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

const PreviewImg = styled.img<{ $selected: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid ${({ $selected }) => ($selected ? "#007bff" : "#ddd")};
  box-shadow: ${({ $selected }) => ($selected ? "0 0 0 2px #007bff33" : "none")};
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
  onFilesSelected: (event: ChangeEvent<HTMLInputElement>) => void;
  previewUrls: string[];
  disabled?: boolean;
}

const ImageUploader = ({
  onFilesSelected,
  previewUrls,
  disabled = false,
}: UploadOptionsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [previewUrls]);

  const uploadCountText = previewUrls.length > 0 ? (
    <>
      <b>{previewUrls.length}</b> image{previewUrls.length === 1 ? "" : "s"} selected
    </>
  ) : (
    "Select images to upload"
  );

  const selectedIndex = Math.max(
    0,
    Math.min(selectedImageIndex, previewUrls.length - 1)
  );

  return (
    <Section>
      <SectionTitle>Upload</SectionTitle>
      <UploadCount>{uploadCountText}</UploadCount>
      {previewUrls.length > 0 && (
        <>
          <LargePreviewWrapper>
            <LargePreviewImg
              src={previewUrls[selectedIndex]}
              alt={`Preview of image ${selectedIndex + 1}`}
            />
          </LargePreviewWrapper>
          <PreviewGrid>
            {previewUrls.map((url, index) => (
              <PreviewButton
                key={url}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === selectedIndex}
                onClick={() => setSelectedImageIndex(index)}
              >
                <PreviewImg
                  src={url}
                  alt=""
                  $selected={index === selectedIndex}
                />
              </PreviewButton>
            ))}
          </PreviewGrid>
        </>
      )}
      <HiddenInput
        ref={inputRef}
        type="file"
        multiple
        onChange={onFilesSelected}
        accept="image/*"
        disabled={disabled}
      />
      <StyledUploadButton
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Choose Images
      </StyledUploadButton>
    </Section>
  );
};

export { ImageUploader };
