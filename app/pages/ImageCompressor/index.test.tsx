import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import imageCompression from "browser-image-compression";
import JSZip from "jszip";

import { ImageCompressor } from ".";

const { zipFile, generateZip } = vi.hoisted(() => ({
  zipFile: vi.fn(),
  generateZip: vi.fn(),
}));

vi.mock("browser-image-compression", () => ({
  default: vi.fn(),
}));

vi.mock("jszip", () => ({
  default: class {
    file = zipFile;
    generateAsync = generateZip;
  },
}));

const createImage = (name: string) =>
  new File(["image data"], name, { type: "image/jpeg" });

const getFileInput = () =>
  document.querySelector<HTMLInputElement>('input[type="file"]')!;

describe("ImageCompressor", () => {
  beforeEach(() => {
    let urlId = 0;
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => `blob:test-${++urlId}`),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });

    vi.mocked(imageCompression).mockReset();
    zipFile.mockReset();
    generateZip.mockReset();
    generateZip.mockResolvedValue(new Blob(["zip data"]));
  });

  it("shows the initial state and disables actions until images are selected", () => {
    render(<ImageCompressor />);

    expect(
      screen.getByText("Select images to upload")
    ).toBeInTheDocument();
    expect(screen.getByText("No images selected for compression")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compress Images" })).toBeDisabled();
    expect(
      screen.getByRole("link", { name: "Download Compressed Images" })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("ignores files that are not images", () => {
    render(<ImageCompressor />);

    fireEvent.change(getFileInput(), {
      target: {
        files: [
          createImage("photo.jpg"),
          new File(["text"], "notes.txt", { type: "text/plain" }),
        ],
      },
    });

    expect(
      screen.getByText((_, element) => element?.textContent === "1 image selected")
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Show image/ })
    ).toHaveLength(1);
  });

  it("filters uploads, previews the selected image, and compresses images into a ZIP", async () => {
    const user = userEvent.setup();
    const firstImage = createImage("first.jpg");
    const secondImage = createImage("second.jpg");
    const compressedFirst = createImage("first-compressed.jpg");
    const compressedSecond = createImage("second-compressed.jpg");
    const zipBlob = new Blob(["zip data"]);

    vi.mocked(imageCompression)
      .mockResolvedValueOnce(compressedFirst)
      .mockResolvedValueOnce(compressedSecond);
    generateZip.mockResolvedValue(zipBlob);

    render(<ImageCompressor />);
    await user.upload(getFileInput(), [firstImage, secondImage]);

    expect(
      screen.getByText((_, element) => element?.textContent === "2 images selected")
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Preview of image 1" })).toHaveAttribute(
      "src",
      "blob:test-1"
    );

    await user.click(screen.getByRole("button", { name: "Show image 2" }));
    expect(screen.getByRole("img", { name: "Preview of image 2" })).toHaveAttribute(
      "src",
      "blob:test-2"
    );

    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          (_, element) =>
            element?.textContent === "2 images compressed and ready for download"
        )
      ).toBeInTheDocument();
    });

    expect(imageCompression).toHaveBeenCalledTimes(2);
    expect(imageCompression).toHaveBeenCalledWith(
      firstImage,
      expect.objectContaining({
        maxSizeMB: 2,
        maxWidthOrHeight: 864,
        useWebWorker: true,
        onProgress: expect.any(Function),
      })
    );
    expect(zipFile).toHaveBeenNthCalledWith(1, "first.jpg", compressedFirst);
    expect(zipFile).toHaveBeenNthCalledWith(2, "second.jpg", compressedSecond);
    expect(generateZip).toHaveBeenCalledWith(
      { type: "blob" },
      expect.any(Function)
    );
    expect(
      screen.getByRole("link", { name: "Download Compressed Images" })
    ).toHaveAttribute("href", "blob:test-3");
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("uses unique ZIP filenames when selected images share a name", async () => {
    const user = userEvent.setup();
    const images = [
      createImage("photo.jpg"),
      createImage("photo.jpg"),
      createImage("photo (2).jpg"),
    ];
    vi.mocked(imageCompression).mockImplementation(async (file) => file);

    render(<ImageCompressor />);
    await user.upload(getFileInput(), images);
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    await waitFor(() => {
      expect(generateZip).toHaveBeenCalled();
    });

    expect(zipFile.mock.calls.map(([name]) => name)).toEqual([
      "photo.jpg",
      "photo (3).jpg",
      "photo (2).jpg",
    ]);
  });

  it("rejects a non-positive maximum file size", async () => {
    const user = userEvent.setup();
    render(<ImageCompressor />);
    await user.upload(getFileInput(), createImage("photo.jpg"));
    fireEvent.change(screen.getByLabelText("Max Size (MB)"), {
      target: { value: "0" },
    });
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Maximum file size must be greater than 0 MB."
    );
    expect(imageCompression).not.toHaveBeenCalled();
  });

  it("rejects invalid compression settings before starting", async () => {
    const user = userEvent.setup();
    render(<ImageCompressor />);
    await user.upload(getFileInput(), createImage("photo.jpg"));
    fireEvent.change(screen.getByLabelText("Max Width/Height (px)"), {
      target: { value: "1.5" },
    });
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Maximum width/height must be a positive whole number of pixels."
    );
    expect(imageCompression).not.toHaveBeenCalled();
    expect(generateZip).not.toHaveBeenCalled();
  });

  it("limits simultaneous image compression to three", async () => {
    const user = userEvent.setup();
    const images = Array.from({ length: 4 }, (_, index) =>
      createImage(`photo-${index}.jpg`)
    );
    const resolveCompression: Array<() => void> = [];

    vi.mocked(imageCompression).mockImplementation(
      (file) =>
        new Promise((resolve) => {
          resolveCompression.push(() => resolve(file));
        })
    );

    render(<ImageCompressor />);
    await user.upload(getFileInput(), images);
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    await waitFor(() => {
      expect(imageCompression).toHaveBeenCalledTimes(3);
    });

    await act(async () => resolveCompression[0]());
    await waitFor(() => {
      expect(imageCompression).toHaveBeenCalledTimes(4);
    });

    await act(async () => {
      resolveCompression.slice(1).forEach((resolve) => resolve());
    });
    await waitFor(() => expect(generateZip).toHaveBeenCalled());
  });

  it("reports ZIP generation progress as a separate phase", async () => {
    const user = userEvent.setup();
    let reportProgress: ((metadata: { percent: number }) => void) | undefined;
    let finishZip: ((blob: Blob) => void) | undefined;
    vi.mocked(imageCompression).mockImplementation(async (file) => file);
    generateZip.mockImplementation(
      (
        _options: { type: "blob" },
        onUpdate: (metadata: { percent: number }) => void
      ) => {
        reportProgress = onUpdate;
        return new Promise((resolve) => {
          finishZip = resolve;
        });
      }
    );

    render(<ImageCompressor />);
    await user.upload(getFileInput(), createImage("photo.jpg"));
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    await waitFor(() => expect(reportProgress).toBeDefined());
    act(() => reportProgress?.({ percent: 50 }));

    expect(screen.getByText("Creating ZIP archive")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "90"
    );

    await act(async () => finishZip?.(new Blob(["zip data"])));
    expect(await screen.findByText("Complete")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("reports compression failures and allows retry", async () => {
    const user = userEvent.setup();
    const image = createImage("broken.jpg");
    vi.mocked(imageCompression).mockRejectedValueOnce(
      new Error("Could not decode image")
    );

    render(<ImageCompressor />);
    await user.upload(getFileInput(), image);
    await user.click(screen.getByRole("button", { name: "Compress Images" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not decode image"
    );
    expect(screen.getByRole("button", { name: "Compress Images" })).toBeEnabled();
    expect(generateZip).not.toHaveBeenCalled();
  });

  it("cleans up preview URLs when the component unmounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ImageCompressor />);
    await user.upload(getFileInput(), createImage("preview.jpg"));

    const previewUrl = screen.getByRole("img", {
      name: "Preview of image 1",
    }).getAttribute("src");

    unmount();

    await waitFor(() => {
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(previewUrl);
    });
  });
});
