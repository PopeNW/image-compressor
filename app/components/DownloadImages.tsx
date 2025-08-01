import styled from "styled-components";
import { interactiveStyles } from "./Button";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";

const Link = styled.a<{ disabled: boolean }>`
  ${interactiveStyles}

  margin-top: auto;
  color: white;
  background-color: ${({ disabled }) => (disabled ? "#6c757d" : "#28a745")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#6c757d" : "#218838")};
  }
`;

const Text = styled.p`
  margin: 0.5rem 0;
  color: #555;
`;

interface DownloadLinkProps {
  zipBlob: Blob | null;
}

const DownloadLink = ({ zipBlob }: DownloadLinkProps) => {
  return (
    <Link
      disabled={!zipBlob}
      href={zipBlob ? URL.createObjectURL(zipBlob) : "#"}
      download="compressed-images.zip"
    >
      Download Compressed Images
    </Link>
  );
};

interface DownloadImagesProps {
  zipBlob: Blob | null;
  compressedImages: File[];
}

export const DownloadImages = ({
  zipBlob,
  compressedImages,
}: DownloadImagesProps) => {
  return (
    <Section>
      <SectionTitle>Download</SectionTitle>
      <Text>
        {compressedImages.length > 0
          ? `${compressedImages.length} image${
              compressedImages.length > 1 ? "s" : ""
            } compressed and ready for download`
          : "No images compressed yet"}
      </Text>
      <DownloadLink zipBlob={zipBlob} />
    </Section>
  );
};
