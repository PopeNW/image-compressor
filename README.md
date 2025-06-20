# Image Compressor App

A modern web application for bulk image compression in your browser, powered by [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression). Easily compress multiple images or entire folders, then download them as a ZIP file—all without uploading your files to a server.

## Features

- 🖼️ Bulk image compression (select multiple files or folders)
- ⚡ Fast, client-side processing—no uploads required
- 📦 Download all compressed images as a single ZIP archive
- 🎨 Clean, responsive UI with Tailwind CSS
- 🔒 Your images never leave your device
- 🛠️ Built with React, TypeScript, and React Router

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t image-compressor-app .

# Run the container
docker run -p 3000:3000 image-compressor-app
```

### DIY Deployment

After building, deploy the contents of the `build/` directory using your preferred Node hosting solution.

## How It Works

1. **Select Images or Folders:** Use the file picker to select individual images or entire folders.
2. **Compress:** Click the "Compress" button to process all selected images in your browser.
3. **Download ZIP:** Once compression is complete, download all images as a ZIP archive.

## Technologies Used

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)
- [JSZip](https://stuk.github.io/jszip/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

---

Built with ❤️ using React Router.
