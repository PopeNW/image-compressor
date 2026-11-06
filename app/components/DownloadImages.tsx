import { useEffect, useState } from "react";
import styled from "styled-components";

import { interactiveStyles } from "./Button";
import { Section } from "./Section";
import { SectionTitle } from "./SectionTitle";

const Link = styled.a<{ $disabled: boolean }>`
  ${interactiveStyles}

  margin-top: auto;
  color: white;
  background-color: ${({ $disabled }) => ($disabled ? "#6c757d" : "#28a745")};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ $disabled }) => ($disabled ? "#6c757d" : "#218838")};
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
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!zipBlob) {
      setDownloadUrl(null);
      return;
    }

    const url = URL.createObjectURL(zipBlob);
    setDownloadUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [zipBlob]);

  return (
    <Link
      $disabled={!downloadUrl}
      href={downloadUrl ?? "#"}
      aria-disabled={!downloadUrl}
      tabIndex={downloadUrl ? undefined : -1}
      onClick={(event) => {
        if (!downloadUrl) event.preventDefault();
      }}
      download="compressed-images.zip"
    >
      Download Compressed Images
    </Link>
  );
};

interface DownloadImagesProps {
  zipBlob: Blob | null;
  compressedFileCount: number;
}

export const DownloadImages = ({
  zipBlob,
  compressedFileCount,
}: DownloadImagesProps) => {
  return (
    <Section>
      <SectionTitle>Download</SectionTitle>
      <Text>
        {compressedFileCount > 0 ? (
          <>
            <b>{compressedFileCount}</b> image{compressedFileCount === 1 ? "" : "s"}{" "}
            compressed and ready for download
          </>
        ) : (
          "No images compressed yet"
        )}
      </Text>
      <DownloadLink zipBlob={zipBlob} />
    </Section>
  );
};
