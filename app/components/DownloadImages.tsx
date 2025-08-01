import { css } from "styled-components";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";
import styled from "styled-components";

interface DownloadImagesProps {
  zipBlob: Blob | null;
}

const Link = styled.a`
  display: inline-block;
  margin-top: 1rem;
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

export const DownloadImages = ({ zipBlob }: DownloadImagesProps) => {
  return (
    <Section>
      <SectionTitle>Download Compressed Images</SectionTitle>
      {zipBlob ? (
        <Link
          href={URL.createObjectURL(zipBlob)}
          download="compressed-images.zip"
        >
          Download Compressed Images (ZIP)
        </Link>
      ) : (
        <p>No compressed images available for download.</p>
      )}
    </Section>
  );
};
