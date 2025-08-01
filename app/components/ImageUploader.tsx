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
      <Button onClick={() => inputRef.current?.click()}>Choose Images</Button>
    </Section>
  );
};

export { ImageUploader };
