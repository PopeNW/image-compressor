import { useRef, type ChangeEvent } from "react";

import styled from "styled-components";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  display: block;
  width: 100%;
  color: #fff;
  background-color: #28a745;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const UploadCount = styled.p`
  margin: 0.5rem 0;
  color: #555;
`;

interface UploadOptionsProps {
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  uploadedFileCount?: number;
}

const ImageUploader = ({
  handleFileUpload,
  uploadedFileCount,
}: UploadOptionsProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadCountText = uploadedFileCount
    ? `${uploadedFileCount} image${uploadedFileCount > 1 ? "s" : ""} selected`
    : "No images selected";

  return (
    <Section>
      <SectionTitle>Upload Images</SectionTitle>
      <UploadCount>{uploadCountText}</UploadCount>
      <HiddenInput
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        accept="image/*"
      />
      <UploadButton onClick={() => inputRef.current?.click()}>
        Choose Images
      </UploadButton>
    </Section>
  );
};

export { ImageUploader };
