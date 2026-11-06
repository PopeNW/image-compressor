import imageCompression, { type Options } from "browser-image-compression";

const MAX_CONCURRENT_COMPRESSIONS = 3;

export async function compressImages(
  images: File[],
  options: Options,
  onProgress: (progress: number) => void
) {
  const compressed: File[] = new Array(images.length);
  const progressByImage = images.map(() => 0);
  let nextIndex = 0;
  let hasFailed = false;
  let failure: unknown;

  const compressNext = async () => {
    while (nextIndex < images.length && !hasFailed) {
      const index = nextIndex++;

      try {
        compressed[index] = await imageCompression(images[index], {
          ...options,
          onProgress: (progress) => {
            progressByImage[index] = progress;
            const average =
              progressByImage.reduce((total, value) => total + value, 0) /
              progressByImage.length;
            onProgress(average);
          },
        });
      } catch (error) {
        hasFailed = true;
        failure = error;
      }
    }
  };

  const workerCount = Math.min(MAX_CONCURRENT_COMPRESSIONS, images.length);
  await Promise.all(Array.from({ length: workerCount }, () => compressNext()));

  if (hasFailed) {
    throw failure;
  }

  return compressed;
}

export function getUniqueArchiveNames(images: readonly Pick<File, "name">[]) {
  const reservedNames = new Set(images.map(({ name }) => name));
  const usedNames = new Set<string>();

  return images.map(({ name }) => {
    const extensionIndex = name.lastIndexOf(".");
    const hasExtension = extensionIndex > 0;
    const baseName = hasExtension ? name.slice(0, extensionIndex) : name;
    const extension = hasExtension ? name.slice(extensionIndex) : "";

    let uniqueName = name;
    let suffix = 2;

    while (
      usedNames.has(uniqueName) ||
      (uniqueName !== name && reservedNames.has(uniqueName))
    ) {
      uniqueName = `${baseName} (${suffix})${extension}`;
      suffix += 1;
    }

    usedNames.add(uniqueName);
    return uniqueName;
  });
}
