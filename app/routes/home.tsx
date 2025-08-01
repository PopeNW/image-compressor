import type { Route } from "./+types/home";
import { ImageCompressor } from "~/pages/ImageCompressor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Image Compressor App" },
    {
      name: "description",
      content:
        "An image compression app using the npm package 'browser-image-compression'",
    },
  ];
}

export default function Home() {
  return <ImageCompressor />;
}
