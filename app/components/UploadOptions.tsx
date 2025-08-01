import type { ChangeEvent } from "react";

interface UploadOptionsProps {
  handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadOptions = ({ handleFileUpload }: UploadOptionsProps) => {
  return (
    <div className="flex flex-row items-center mb-4 gap-4">
      {/* File picker for individual files */}
      <label className="bg-gray-100 p-2 rounded cursor-pointer transition hover:bg-gray-200 hover:ring-2 hover:ring-blue-400">
        Select Images
        <input
          className="hidden"
          type="file"
          multiple
          onChange={handleFileUpload}
          accept="image/*"
        />
      </label>
      {/* Folder picker for directories */}
      <label className="bg-gray-100 p-2 rounded cursor-pointer transition hover:bg-gray-200 hover:ring-2 hover:ring-blue-400">
        Select Folder
        <input
          className="hidden"
          type="file"
          multiple
          // @ts-ignore
          webkitdirectory="true"
          onChange={handleFileUpload}
          accept="image/*"
        />
      </label>
    </div>
  );
};

export { UploadOptions };
