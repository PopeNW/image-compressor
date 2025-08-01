import styled from "styled-components";
import { interactiveStyles } from "./Button";

interface DownloadImagesProps {
  zipBlob: Blob | null;
}

const Link = styled.a<{ disabled: boolean }>`
  ${interactiveStyles}

  color: white;
  background-color: ${({ disabled }) => (disabled ? "#6c757d" : "#28a745")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#6c757d" : "#218838")};
  }
`;

export const DownloadLink = ({ zipBlob }: DownloadImagesProps) => {
  return (
    <Link
      disabled={!zipBlob}
      href={zipBlob ? URL.createObjectURL(zipBlob) : "#"}
      download="compressed-images.zip"
    >
      Download
    </Link>
  );
};
