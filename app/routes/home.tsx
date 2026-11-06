import { ImageCompressor } from "~/pages/ImageCompressor";

export const meta = () => {
  return [
    { title: "Image Compressor" },
    {
      name: "description",
      content: "Compress images in your browser and download them as a ZIP file.",
    },
  ];
};

export default function Home() {
  return <ImageCompressor />;
}
